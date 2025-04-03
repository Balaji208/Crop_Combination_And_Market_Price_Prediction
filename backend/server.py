from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import mysql.connector
from flask_bcrypt import Bcrypt
from datetime import datetime, timedelta
import pandas as pd
from selenium import webdriver
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException
from bs4 import BeautifulSoup
import logging
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.arima.model import ARIMA
import time
from train import SubCropRecommender
from database.db_connection import get_db_connection, close_db_connection  # Ensure this file exists

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Set up logging
logging.basicConfig(
    filename="scrape_log.log",
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)

# Load the trained model for crop recommendation
try:
    with open("subcrop_recommender.pkl", "rb") as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    print("Error: Model file 'subcrop_recommender.pkl' not found.")
    model = None

# Crop Recommendation Endpoint
@app.route("/predict", methods=["POST"])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        data = request.json
        required_fields = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        try:
            values = [float(data[field]) for field in required_fields]
        except ValueError:
            return jsonify({"error": "Invalid input: All parameters must be numeric"}), 400

        result = model.recommend_sub_crops(*values)
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Signup Endpoint
@app.route("/signup", methods=["POST"])
def signup():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    data = request.json

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
    sql = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"

    try:
        cursor.execute(sql, (data["username"], data["email"], hashed_password))
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        close_db_connection(db, cursor)

# Login Endpoint
@app.route("/login", methods=["POST"])
def login():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    data = request.json
    sql = "SELECT username, password FROM users WHERE email = %s"

    try:
        cursor.execute(sql, (data["email"],))
        user = cursor.fetchone()

        if not user or not bcrypt.check_password_hash(user[1], data["password"]):
            close_db_connection(db, cursor)
            return jsonify({"message": "Invalid credentials"}), 401

        close_db_connection(db, cursor)
        return jsonify({"message": "Login successful", "username": user[0]})
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        close_db_connection(db, cursor)

# Market Price Scraping Logic
def close_popup(driver):
    try:
        popup = WebDriverWait(driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, "popup-onload"))
        )
        close_button = popup.find_element(By.CLASS_NAME, "close")
        close_button.click()
        logging.info("Popup closed")
    except (NoSuchElementException, TimeoutException):
        logging.info("No popup found or failed to close")
        pass

def fetch_market_prices(state, commodity, market, from_date, to_date, max_retries=3):
    options = webdriver.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument('--headless')  # Uncomment for production

    for attempt in range(max_retries):
        driver = None
        try:
            driver = webdriver.Chrome(options=options)
            driver.set_page_load_timeout(120)
            url = "https://agmarknet.gov.in/"
            logging.info(f"Attempt {attempt + 1}/{max_retries}: Loading URL: {url}")
            driver.get(url)
            close_popup(driver)

            logging.info(f"Fetching data for {commodity} in {state}, {market}")
            WebDriverWait(driver, 30).until(
                EC.presence_of_element_located((By.ID, "ddlCommodity"))
            )

            commodity_dropdown = Select(driver.find_element(By.ID, "ddlCommodity"))
            commodity_dropdown.select_by_visible_text(commodity)
            state_dropdown = Select(driver.find_element(By.ID, "ddlState"))
            state_dropdown.select_by_visible_text(state)
            time.sleep(2)
            market_dropdown = Select(driver.find_element(By.ID, "ddlMarket"))
            market_dropdown.select_by_visible_text(market)
            time.sleep(2)

            from_date_input = driver.find_element(By.ID, "txtDate")
            from_date_input.clear()
            from_date_input.send_keys(from_date.strftime("%d-%b-%Y"))
            time.sleep(2)
            to_date_input = driver.find_element(By.ID, "txtDateTo")
            to_date_input.clear()
            to_date_input.send_keys(to_date.strftime("%d-%b-%Y"))
            time.sleep(2)

            driver.find_element(By.ID, "btnGo").click()
            WebDriverWait(driver, 60).until(
                EC.presence_of_element_located((By.ID, "cphBody_GridPriceData"))
            )

            soup = BeautifulSoup(driver.page_source, "html.parser")
            table = soup.find("table", {"id": "cphBody_GridPriceData"})
            if not table:
                logging.warning("No price data table found")
                driver.quit()
                return []

            data_list = []
            for row in table.find_all("tr")[1:]:  # Skip header
                cols = row.find_all("td")
                if len(cols) >= 10:
                    date_str = cols[9].text.strip()
                    try:
                        date_obj = datetime.strptime(date_str, "%d %b %Y")
                        standardized_date = date_obj.strftime("%Y-%m-%d")
                    except ValueError:
                        standardized_date = date_str
                    data = {
                        "S.No": cols[0].text.strip(),
                        "Market": market,
                        "Commodity": cols[3].text.strip(),
                        "Min Price": cols[6].text.strip(),
                        "Max Price": cols[7].text.strip(),
                        "Modal Price": cols[8].text.strip(),
                        "Date": standardized_date,
                        "State": state,
                    }
                    data_list.append(data)
            driver.quit()
            return data_list
        except Exception as e:
            logging.error(f"Attempt {attempt + 1} failed: {str(e)}")
            if driver:
                driver.quit()
            if attempt + 1 < max_retries:
                time.sleep(5)
            else:
                logging.error("All retries failed")
                return []

def preprocess_and_predict(df, freq="W"):
    df["Date"] = pd.to_datetime(df["Date"], errors="coerce")
    df["Modal Price"] = pd.to_numeric(df["Modal Price"], errors="coerce")
    df = df.dropna(subset=["Date", "Modal Price"])
    
    if len(df) < 10:
        return {"error": "Not enough data points for prediction (minimum 10 required)"}
    
    df = df.sort_values("Date").set_index("Date")
    df = df["Modal Price"].resample(freq).mean().interpolate(method="linear").ffill().bfill()
    price_series = df

    horizons = {"one_week": 1, "one_month": 4, "three_months": 12, "six_months": 24}
    predictions = {}
    last_date = price_series.index[-1]

    try:
        if len(price_series) >= 52:
            model = SARIMAX(price_series, order=(1, 0, 1), seasonal_order=(1, 0, 1, 52))
            fitted_model = model.fit(disp=False, maxiter=100)
        else:
            model = ARIMA(price_series, order=(1, 0, 1))
            fitted_model = model.fit()

        for period, steps in horizons.items():
            forecast = fitted_model.forecast(steps=steps)
            forecast = np.maximum(forecast, 0)  # Ensure non-negative prices
            future_dates = pd.date_range(start=last_date, periods=steps + 1, freq="W")[1:]
            predictions[period] = {
                "dates": [date.strftime("%Y-%m-%d") for date in future_dates],
                "predicted_prices": forecast.tolist(),
            }
        return predictions
    except Exception as e:
        return {"error": f"Model fitting failed: {str(e)}"}

# Price Prediction Endpoint
@app.route("/predict_prices", methods=["POST"])
def predict_prices():
    try:
        data = request.json
        required_fields = ["state", "market", "commodity"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing required field: {field}"}), 400

        # Define date range (e.g., past 3 years to March 29, 2025)
        to_date = datetime(2025, 4, 3)  # Hardcoded as per your context
        from_date = to_date - timedelta(days=3 * 365)  # 3 years back

        # Fetch market prices
        market_data = fetch_market_prices(
            data["state"], data["commodity"], data["market"], from_date, to_date
        )

        if not market_data:
            return jsonify({"error": "No data found for the specified inputs"}), 404

        # Convert to DataFrame and save
        df = pd.DataFrame(market_data)
        safe_commodity = data["commodity"].replace(" ", "").replace("/", "")
        filename = f"{safe_commodity}{data['state']}{data['market']}_past3years.csv"
        df.to_csv(filename, index=False)

        # Predict prices
        prediction = preprocess_and_predict(df)
        if "error" in prediction:
            return jsonify({"error": prediction["error"]}), 400

        return jsonify({
            "state": data["state"],
            "market": data["market"],
            "commodity": data["commodity"],
            "data_file": filename,
            "predictions": prediction,
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
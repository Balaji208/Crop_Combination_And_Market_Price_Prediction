import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import logging
import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.tsa.arima.model import ARIMA
import numpy as np
import requests
from requests.exceptions import Timeout

# Set up logging
logging.basicConfig(
    filename='scrape_log.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Initialize FastAPI app
app = FastAPI()

# Define input model for FastAPI
class MarketRequest(BaseModel):
    state: str
    market: str
    commodity: str

# Function to close popups
def close_popup(driver):
    try:
        popup = WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CLASS_NAME, 'popup-onload')))
        close_button = popup.find_element(By.CLASS_NAME, 'close')
        close_button.click()
        logging.info("Popup closed")
    except (NoSuchElementException, TimeoutException):
        logging.info("No popup found or failed to close")
        pass

# Function to fetch market prices with retries and sleep before submit
def fetch_market_prices(state, commodity, market, from_date, to_date, max_retries=3):
    options = webdriver.ChromeOptions()
    # options.add_argument('--headless')  # Uncomment for production
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    
    for attempt in range(max_retries):
        try:
            driver = webdriver.Chrome(options=options)
            driver.set_page_load_timeout(120)
            url = "https://agmarknet.gov.in/"
            
            logging.info(f"Attempt {attempt + 1}/{max_retries}: Loading URL: {url}")
            driver.get(url)
            
            close_popup(driver)
            
            logging.info(f"Fetching data for {commodity} in {state}, {market}")
            print(f"Fetching data for {commodity} in {state}, {market}")
            
            WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.ID, "ddlCommodity")))
            
            try:
                commodity_dropdown = Select(driver.find_element(By.ID, "ddlCommodity"))
                commodity_dropdown.select_by_visible_text(commodity)
                logging.info(f"Selected commodity: {commodity}")
            except NoSuchElementException:
                logging.error(f"Commodity dropdown not found or {commodity} not available")
                driver.quit()
                return []
            
            try:
                state_dropdown = Select(driver.find_element(By.ID, "ddlState"))
                state_dropdown.select_by_visible_text(state)
                time.sleep(2)
                logging.info(f"Selected state: {state}")
            except NoSuchElementException:
                logging.error(f"State dropdown not found or {state} not available")
                driver.quit()
                return []
            
            try:
                market_dropdown = Select(driver.find_element(By.ID, "ddlMarket"))
                available_markets = [opt.text.strip() for opt in market_dropdown.options if opt.text.strip()]
                logging.info(f"Available markets for {state}: {available_markets}")
                market_normalized = market.strip()
                matched_market = next((opt for opt in available_markets if opt.lower() == market_normalized.lower()), None)
                if matched_market:
                    market_dropdown.select_by_visible_text(matched_market)
                    logging.info(f"Selected market: {matched_market}")
                else:
                    logging.error(f"Market '{market}' not found in dropdown. Available options: {available_markets}")
                    driver.quit()
                    return []
            except NoSuchElementException:
                logging.error(f"Market dropdown not found or {market} not available")
                driver.quit()
                return []
            
            try:
                time.sleep(2)
                from_date_input = driver.find_element(By.ID, "txtDate")
                from_date_input.clear()
                from_date_str = from_date.strftime('%d-%b-%Y')
                from_date_input.send_keys(from_date_str)
                logging.info(f"Set From Date: {from_date_str}")
            except NoSuchElementException:
                logging.error("From Date input field not found")
                driver.quit()
                return []
            
            try:
                time.sleep(2)
                to_date_input = driver.find_element(By.ID, "txtDateTo")
                to_date_input.clear()
                to_date_str = to_date.strftime('%d-%b-%Y')
                to_date_input.send_keys(to_date_str)
                logging.info(f"Set To Date: {to_date_str}")
            except NoSuchElementException:
                logging.error("To Date input field not found")
                driver.quit()
                return []
            
            try:
                logging.info("Waiting 2 seconds before form submission")
                time.sleep(2)
                driver.find_element(By.ID, "btnGo").click()
                logging.info("Form submitted")
            except NoSuchElementException:
                logging.error("Submit button not found")
                driver.quit()
                return []
            
            try:
                WebDriverWait(driver, 60).until(
                    EC.presence_of_element_located((By.ID, "cphBody_GridPriceData"))
                )
                logging.info("Price table loaded")
            except TimeoutException:
                logging.error("Timeout waiting for price table")
                with open('timeout_page.html', 'w', encoding='utf-8') as f:
                    f.write(driver.page_source)
                logging.info("Saved page source to 'timeout_page.html' for debugging")
                driver.quit()
                return []
            
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            table = soup.find("table", {"id": "cphBody_GridPriceData"})
            if not table:
                logging.warning(f"No price table found for {market}")
                driver.quit()
                return []
            
            data_list = []
            for row in table.find_all("tr")[1:]:
                cols = row.find_all("td")
                if len(cols) >= 10:
                    date_str = cols[9].text.strip()
                    try:
                        date_obj = datetime.strptime(date_str, '%d %b %Y')
                        standardized_date = date_obj.strftime('%Y-%m-%d')
                    except ValueError:
                        logging.warning(f"Invalid date format: {date_str}")
                        standardized_date = date_str
                    
                    data = {
                        "S.No": cols[0].text.strip(),
                        "Market": market,
                        "Commodity": cols[3].text.strip(),
                        "Min Price": cols[6].text.strip(),
                        "Max Price": cols[7].text.strip(),
                        "Modal Price": cols[8].text.strip(),
                        "Date": standardized_date,
                        "State": state
                    }
                    data_list.append(data)
            
            driver.quit()
            logging.info(f"Completed data fetch for {market}. Records collected: {len(data_list)}")
            return data_list
        
        except (WebDriverException, Timeout, requests.RequestException) as e:
            logging.error(f"Attempt {attempt + 1} failed: {str(e)}")
            if 'driver' in locals():
                driver.quit()
            if attempt + 1 < max_retries:
                time.sleep(5)
                continue
            return []
        except Exception as e:
            logging.error(f"Unexpected error in fetch_market_prices: {str(e)}")
            if 'driver' in locals():
                driver.quit()
            return []

# Function to preprocess data and predict with improved modeling
def preprocess_and_predict(df, freq='W'):
    # Convert dates and prices
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    df['Modal Price'] = pd.to_numeric(df['Modal Price'], errors='coerce')
    
    df = df.dropna(subset=['Date', 'Modal Price'])
    logging.info(f"Raw data points after dropna: {len(df)}")
    
    if len(df) < 10:
        return {"error": "Not enough data points for prediction (minimum 10 required)"}
    
    # Sort by date and set index
    df = df.sort_values('Date')
    df = df.set_index('Date')
    
    # Resample to weekly frequency, filling gaps
    start_date = df.index.min()
    end_date = df.index.max()
    full_index = pd.date_range(start=start_date, end=end_date, freq=freq)
    df = df['Modal Price'].resample(freq).mean().reindex(full_index)
    
    # Interpolate and fill remaining NaNs
    df = df.interpolate(method='linear').ffill().bfill()
    logging.info(f"Processed data points after resampling: {len(df)}")
    logging.info(f"Sample processed prices: {df.tail(5).tolist()}")
    
    if len(df) < 5:
        return {"error": "Not enough data points after filling gaps (minimum 5 required)"}
    
    price_series = df
    
    horizons = {
        "one_week": 1,
        "one_month": 4,
        "three_months": 12,
        "six_months": 24
    }
    
    predictions = {}
    last_date = price_series.index[-1]
    
    try:
        # Use SARIMA with yearly seasonality (52 weeks) if enough data, else ARIMA
        if len(price_series) >= 52:  # Require at least one year for seasonality
            # Adjusted parameters: less aggressive differencing and seasonality
            model = SARIMAX(
                price_series,
                order=(1, 0, 1),  # (p,d,q) - reduced differencing to preserve trend
                seasonal_order=(1, 0, 1, 52),  # (P,D,Q,s) - yearly seasonality
                enforce_stationarity=True,
                enforce_invertibility=True
            )
            fitted_model = model.fit(disp=False, maxiter=100)
            logging.info("SARIMA model fitted successfully")
        else:
            model = ARIMA(
                price_series,
                order=(1, 0, 1)  # Reduced differencing
            )
            fitted_model = model.fit()
            logging.info("Fallback to ARIMA due to insufficient data for seasonality")
        
        # Forecast for each horizon
        for period, steps in horizons.items():
            forecast = fitted_model.forecast(steps=steps)
            # Prevent negative prices and cap extreme values
            forecast = np.maximum(forecast, 0)
            # Optional: Cap at a reasonable max (e.g., 2x the max historical price)
            max_historical = price_series.max()
            forecast = np.minimum(forecast, max_historical * 2)
            future_dates = pd.date_range(start=last_date, periods=steps + 1, freq='W')[1:]
            predictions[period] = {
                "dates": [date.strftime('%Y-%m-%d') for date in future_dates],
                "predicted_prices": forecast.tolist()
            }
        
        return predictions
    except Exception as e:
        logging.error(f"Model fitting failed: {str(e)}")
        return {"error": f"Model fitting failed: {str(e)}"}

# FastAPI endpoint
@app.post("/predict_prices/")
async def predict_prices(request: MarketRequest):
    to_date = datetime(2025, 3, 29)  # Today as per context
    from_date = to_date - timedelta(days=3 * 365)  # 3 years back
    
    data = fetch_market_prices(request.state, request.commodity, request.market, from_date, to_date)
    
    if not data:
        raise HTTPException(status_code=404, detail="No data found for the specified inputs. Check logs for details.")
    
    df = pd.DataFrame(data)
    safe_commodity = request.commodity.replace(" ", "_").replace("/", "_")
    filename = f"{safe_commodity}_{request.state}_{request.market}_past3years.csv"
    df.to_csv(filename, index=False)
    logging.info(f"Data saved to {filename}. Total records: {len(data)}")
    
    prediction = preprocess_and_predict(df, freq='W')
    
    if "error" in prediction:
        raise HTTPException(status_code=400, detail=prediction["error"])
    
    return {
        "state": request.state,
        "market": request.market,
        "commodity": request.commodity,
        "data_file": filename,
        "predictions": prediction
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
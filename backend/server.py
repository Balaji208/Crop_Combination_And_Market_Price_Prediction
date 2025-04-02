from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
from database.db_connection import get_db_connection, close_db_connection  # Import from your db file
from flask_bcrypt import Bcrypt
from train import SubCropRecommender

app = Flask(__name__)
bcrypt = Bcrypt(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Load the trained model
try:
    with open("subcrop_recommender.pkl", "rb") as model_file:
        model = pickle.load(model_file)
except FileNotFoundError:
    print("Error: Model file 'subcrop_recommender.pkl' not found.")
    model = None

@app.route('/predict', methods=['POST'])
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
        # Ensure result matches: {main_crop, sub_crops: [{sub_crop, distance}], warnings}
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/signup', methods=['POST'])
def signup():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    data = request.json
    
    # Hash the password
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    sql = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
    
    try:
        cursor.execute(sql, (data['username'], data['email'], hashed_password))
        db.commit()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    finally:
        close_db_connection(db, cursor)

@app.route('/login', methods=['POST'])
def login():
    db = get_db_connection()
    if not db:
        return jsonify({"error": "Database connection failed"}), 500

    cursor = db.cursor()
    data = request.json
    sql = "SELECT username, password FROM users WHERE email = %s"

    cursor.execute(sql, (data['email'],))
    user = cursor.fetchone()
    
    if not user or not bcrypt.check_password_hash(user[1], data['password']):
        close_db_connection(db, cursor)
        return jsonify({"message": "Invalid credentials"}), 401
    
    close_db_connection(db, cursor)
    return jsonify({"message": "Login successful", "username": user[0]})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
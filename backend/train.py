import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import euclidean_distances
import pickle
import os

# Realistic Ranges
realistic_ranges = {
    'N': (0, 200), 'P': (0, 200), 'K': (0, 250), 'temperature': (5, 50),
    'humidity': (0, 100), 'ph': (3, 11), 'rainfall': (0, 500)
}

# Updated Crop Mapping
crop_name_mapping = {
    'Rice': 'Rice_subcrop_data.csv',
    'Maize': 'Maize_subcrop_data.csv',
    'Bengal Gram (Gram)(Whole)': 'Bengal Gram (Gram)(Whole)_subcrop_data.csv',
    'Pegeon Pea (Arhar Fali)': 'Pegeon Pea (Arhar Fali)_subcrop_data.csv',
    'Moath Dal': 'Moath Dal_subcrop_data.csv',
    'Green Gram (Moong)(Whole)': 'Green Gram (Moong)(Whole)_subcrop_data.csv',
    'Black Gram (Urd Beans)(Whole)': 'Black Gram (Urd Beans)(Whole)_subcrop_data.csv',
    'Lentil (Masur)(Whole)': 'Lentil (Masur)(Whole)_subcrop_data.csv',
    'Pomegranate': 'Pomegranate_subcrop_data.csv',
    'Banana': 'Banana_subcrop_data.csv',
    'Mango': 'Mango_subcrop_data.csv',
    'Grapes': 'Grapes_subcrop_data.csv',
    'Water Melon': 'Water Melon_subcrop_data.csv',
    'Karbuja (Musk Melon)': 'Karbuja (Musk Melon)_subcrop_data.csv',
    'Apple': 'Apple_subcrop_data.csv',
    'Orange': 'Orange_subcrop_data.csv',
    'Papaya': 'Papaya_subcrop_data.csv',
    'Coconut': 'Coconut_subcrop_data.csv',
    'Cotton': 'Cotton_subcrop_data.csv',
    'Jute': 'Jute_subcrop_data.csv',
    'Coffee': 'Coffee_subcrop_data.csv'
}

# SubCropRecommender Class
class SubCropRecommender:
    def __init__(self, main_model_path='main_crop_model.pkl', subcrop_dir='sub_crop_data'):
        self.main_model = self.load_main_crop_model(main_model_path)
        self.subcrop_dir = subcrop_dir
        self.crop_name_mapping = crop_name_mapping
        self.realistic_ranges = realistic_ranges

    def load_main_crop_model(self, path):
        with open(path, 'rb') as file:
            return pickle.load(file)

    def validate_and_preprocess_input(self, N, P, K, temperature, humidity, ph, rainfall):
        inputs = {'N': N, 'P': P, 'K': K, 'temperature': temperature, 
                  'humidity': humidity, 'ph': ph, 'rainfall': rainfall}
        for param, val in inputs.items():
            try:
                inputs[param] = float(val)
            except (ValueError, TypeError):
                return False, f"Invalid input: {param} must be a number", []
        capped_inputs = {}
        warnings_list = []
        for param, val in inputs.items():
            min_val, max_val = self.realistic_ranges[param]
            if val < min_val or val > max_val:
                warnings_list.append(f"{param} ({val}) outside realistic range ({min_val}-{max_val}), capped")
                capped_inputs[param] = max(min_val, min(val, max_val))
            else:
                capped_inputs[param] = val
        return True, capped_inputs, warnings_list

    def recommend_sub_crops(self, N, P, K, temperature, humidity, ph, rainfall, num_recommendations=3):
        try:
            is_valid, capped_inputs, warnings = self.validate_and_preprocess_input(
                N, P, K, temperature, humidity, ph, rainfall
            )
            if not is_valid:
                return {"error": capped_inputs, "main_crop": None, "sub_crops": [], "warnings": warnings}
            
            input_df = pd.DataFrame([[capped_inputs['N'], capped_inputs['P'], 
                                      capped_inputs['K'], capped_inputs['temperature'], 
                                      capped_inputs['humidity'], capped_inputs['ph'], 
                                      capped_inputs['rainfall']]],
                                    columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
            main_crop = self.main_model.predict(input_df)[0]
            main_confidence = float(max(self.main_model.predict_proba(input_df)[0]))
            
            if main_crop not in self.crop_name_mapping:
                return {"error": f"No sub-crop mapping for {main_crop}", "main_crop": main_crop, 
                        "sub_crops": [], "warnings": warnings}
            
            subcrop_filename = self.crop_name_mapping[main_crop]
            subcrop_file = os.path.join(self.subcrop_dir, subcrop_filename)
            
            if not os.path.exists(subcrop_file):
                return {"error": f"Sub-crop file {subcrop_filename} not found", 
                        "main_crop": main_crop, "sub_crops": [], "warnings": warnings}
            
            sub_crop_df = pd.read_csv(subcrop_file)
            required_cols = ['sub-crop', 'N', 'P', 'K', 'temperature', 'rainfall', 'ph', 'humidity']
            missing_cols = [col for col in required_cols if col not in sub_crop_df.columns]
            if missing_cols:
                return {"error": f"Missing columns: {missing_cols}", "main_crop": main_crop, 
                        "sub_crops": [], "warnings": warnings}
            
            input_vector = np.array([[capped_inputs['N'], capped_inputs['P'], capped_inputs['K'], 
                                      capped_inputs['temperature'], capped_inputs['rainfall'], 
                                      capped_inputs['ph'], capped_inputs['humidity']]])
            sub_crop_features = sub_crop_df[['N', 'P', 'K', 'temperature', 'rainfall', 'ph', 'humidity']].values
            
            distances = euclidean_distances(input_vector, sub_crop_features)[0]
            sub_crops_with_distances = sorted(zip(sub_crop_df['sub-crop'], distances), key=lambda x: x[1])
            
            unique_sub_crops = []
            seen_sub_crops = set()
            for crop, dist in sub_crops_with_distances:
                if crop not in seen_sub_crops:
                    unique_sub_crops.append({"sub_crop": crop, "distance": float(dist)})
                    seen_sub_crops.add(crop)
                if len(unique_sub_crops) == num_recommendations:
                    break
            
            return {
                "main_crop": main_crop,
                "main_confidence": main_confidence,
                "sub_crops": unique_sub_crops,
                "warnings": warnings if warnings else None
            }
        except Exception as e:
            return {"error": str(e), "main_crop": None, "sub_crops": [], "warnings": None}

    def calculate_subcrop_accuracy(self, num_recommendations=3):
        total_tests = 0
        correct_matches = 0
        
        with open('subcrop_accuracy_debug.txt', 'w') as debug_file:
            for main_crop, filename in self.crop_name_mapping.items():
                file_path = os.path.join(self.subcrop_dir, filename)
                if not os.path.exists(file_path):
                    debug_file.write(f"Skipping {main_crop}: {filename} not found\n")
                    continue
                
                sub_crop_df = pd.read_csv(file_path)
                required_cols = ['sub-crop', 'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall']
                if not all(col in sub_crop_df.columns for col in required_cols):
                    debug_file.write(f"Skipping {main_crop}: {filename} missing required columns\n")
                    continue
                
                for _, row in sub_crop_df.iterrows():
                    expected_sub_crop = row['sub-crop']
                    test_input = [row['N'], row['P'], row['K'], row['temperature'], 
                                  row['humidity'], row['ph'], row['rainfall']]
                    
                    result = self.recommend_sub_crops(*test_input, num_recommendations=num_recommendations)
                    
                    if "error" in result:
                        debug_file.write(f"Error for {main_crop}: {result['error']}\n")
                        continue
                    
                    predicted_sub_crops = [item['sub_crop'] for item in result['sub_crops']]
                    total_tests += 1
                    
                    if expected_sub_crop in predicted_sub_crops:
                        correct_matches += 1
                    else:
                        debug_file.write(f"Mismatch for {main_crop}: Expected {expected_sub_crop}, Got {predicted_sub_crops}\n")
            
            accuracy = (correct_matches / total_tests) * 100 if total_tests > 0 else 0.0
            accuracy_message = f"Accuracy: {accuracy:.2f}% (Correct: {correct_matches}/{total_tests})"
            debug_file.write(f"\n{accuracy_message}\n")
        
        return accuracy, accuracy_message

# Save the Model as a .pkl File
def save_subcrop_model(filename='subcrop_recommender.pkl'):
    recommender = SubCropRecommender(main_model_path='main_crop_model.pkl', 
                                     subcrop_dir='sub_crop_data')
    with open(filename, 'wb') as file:
        pickle.dump(recommender, file)
    print(f"Sub-crop recommender model saved as '{filename}'")

# Load and Use the Saved Model
def load_subcrop_model(filename='subcrop_recommender.pkl'):
    with open(filename, 'rb') as file:
        return pickle.load(file)

# Test the Model
if __name__ == "__main__":
    # Save the model
    save_subcrop_model('subcrop_recommender.pkl')
    
    # Load and test the saved model
    recommender = load_subcrop_model('subcrop_recommender.pkl')
    
    # Example prediction
    result = recommender.recommend_sub_crops(20, 30, 40, 25, 80, 6.0, 150)
    print("Prediction Result:", result)
    
    # Calculate accuracy
    accuracy, message = recommender.calculate_subcrop_accuracy()
    print(message)
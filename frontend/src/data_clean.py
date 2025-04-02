import json

def remove_duplicate_markets(json_file, output_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)
    
    cleaned_data = {}
    
    for state, markets in data.items():
        cleaned_data[state] = list(set(markets))  # Remove duplicates by converting to set and back to list
    
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(cleaned_data, file, indent=4)

# Usage
input_file = './states_and_markets.json'  # Replace with your actual JSON file
output_file = 'cleaned_states_markets.json'
remove_duplicate_markets(input_file, output_file)
print("Duplicate markets removed and saved to", output_file)
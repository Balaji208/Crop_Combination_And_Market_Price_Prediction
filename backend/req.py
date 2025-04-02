import requests

payload = {"state": 'Tamil Nadu', "market": 'Tiruchengode', "commodity": 'Tomato'}
response = requests.post("http://localhost:8000/predict_prices/", json=payload)
print(response.json())
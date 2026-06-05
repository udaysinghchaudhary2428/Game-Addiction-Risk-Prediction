import joblib
import pandas as pd

model = joblib.load("model/gaming_addiction_rf_v1.joblib")

MODEL_VERSION = "1.0.0"

def predict_output(user_input : dict): 
    data = pd.DataFrame([user_input])
    output = model.predict(data)
    return output[0]
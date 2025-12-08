import tensorflow as tf
import numpy as np
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load LSTM model
model = tf.keras.models.load_model(os.path.join(BASE_DIR, "threat_lstm.keras"))

# Load encoders and scaler
with open(os.path.join(BASE_DIR, "protocol_encoder.pkl"), "rb") as f:
    protocol_encoder = pickle.load(f)

with open(os.path.join(BASE_DIR, "label_encoder.pkl"), "rb") as f:
    label_encoder = pickle.load(f)

with open(os.path.join(BASE_DIR, "scaler.pkl"), "rb") as f:
    scaler = pickle.load(f)


def ip_to_int(ip):
    parts = ip.split(".")
    return sum([int(parts[i]) << (8 * (3 - i)) for i in range(4)])


def predict_payload(src_ip, dst_ip, port, protocol, packet_size):
    try:
        protocol_encoded = protocol_encoder.transform([protocol])[0]
        x = np.array([[ip_to_int(src_ip), ip_to_int(dst_ip), port, protocol_encoded, packet_size]])
        x_scaled = scaler.transform(x)
        x_seq = np.repeat(x_scaled, 10, axis=0).reshape(1, 10, 5)
        prediction = model.predict(x_seq, verbose=0)
        label_idx = prediction.argmax()
        if label_idx >= len(label_encoder.classes_):
            label_idx = 0
        label = label_encoder.inverse_transform([label_idx])[0]
        confidence = float(prediction.max())
        return label, confidence
    except Exception as e:
        print("ML prediction failed:", e)
        return "normal", 0.0

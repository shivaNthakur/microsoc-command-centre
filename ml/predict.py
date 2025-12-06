import tensorflow as tf
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load model
model = tf.keras.models.load_model(r"D:\p3-threat-engine\microsoc-command-centre\ml\ml\threat_lstm.keras")

# Load encoders and scaler
with open("D:\p3-threat-engine\microsoc-command-centre\ml\ml\protocol_encoder.pkl", "rb") as f:
    protocol_encoder = pickle.load(f)

with open("D:\p3-threat-engine\microsoc-command-centre\ml\ml\label_encoder.pkl", "rb") as f:
    label_encoder = pickle.load(f)

with open("D:\p3-threat-engine\microsoc-command-centre\ml\ml\scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

def ip_to_int(ip):
    parts = ip.split(".")
    return sum([int(parts[i]) << (8*(3-i)) for i in range(4)])

def predict_payload(src_ip, dst_ip, port, protocol, packet_size):
    protocol_encoded = protocol_encoder.transform([protocol])[0]
    x = np.array([[ip_to_int(src_ip), ip_to_int(dst_ip), port, protocol_encoded, packet_size]])
    x_scaled = scaler.transform(x)
    x_seq = np.repeat(x_scaled, 10, axis=0).reshape(1, 10, 5)
    prediction = model.predict(x_seq)
    label = label_encoder.inverse_transform([prediction.argmax()])[0]
    confidence = float(prediction.max())
    return label, confidence

if __name__ == "__main__":
    lbl, conf = predict_payload("192.168.1.10", "192.168.1.20", 443, "TCP", 300)
    print(lbl, conf)

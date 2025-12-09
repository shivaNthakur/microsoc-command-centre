import numpy as np
import pickle
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Lazy load model and encoders to avoid TensorFlow issues
_model = None
_protocol_encoder = None
_label_encoder = None
_scaler = None


def _load_models():
    global _model, _protocol_encoder, _label_encoder, _scaler
    if _model is None:
        try:
            import tensorflow as tf
            _model = tf.keras.models.load_model(os.path.join(BASE_DIR, "threat_lstm.keras"))
            
            with open(os.path.join(BASE_DIR, "protocol_encoder.pkl"), "rb") as f:
                _protocol_encoder = pickle.load(f)
            
            with open(os.path.join(BASE_DIR, "label_encoder.pkl"), "rb") as f:
                _label_encoder = pickle.load(f)
            
            with open(os.path.join(BASE_DIR, "scaler.pkl"), "rb") as f:
                _scaler = pickle.load(f)
            
            print("✓ ML models loaded successfully")
        except Exception as e:
            print(f"⚠️  Failed to load ML models: {e}")
    return _model, _protocol_encoder, _label_encoder, _scaler


def ip_to_int(ip):
    parts = ip.split(".")
    return sum([int(parts[i]) << (8 * (3 - i)) for i in range(4)])


def predict_payload(src_ip, dst_ip, port, protocol, packet_size):
    try:
        model, protocol_encoder, label_encoder, scaler = _load_models()
        
        if model is None:
            return "normal", 0.0
        
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

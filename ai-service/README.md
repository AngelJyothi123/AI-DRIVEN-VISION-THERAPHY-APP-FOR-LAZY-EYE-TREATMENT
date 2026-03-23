# Vision Therapy AI Service

This is the Python Flask ML service for the Vision Therapy App. It provides machine learning predictions for exercise improvement scores.

## Features

- **ML Prediction**: Predicts improvement scores based on exercise metrics
- **Fallback Logic**: Uses rule-based prediction when trained model is not available
- **REST API**: Clean RESTful API endpoints
- **Health Checks**: Built-in health check endpoints
- **Error Handling**: Comprehensive error handling and logging
- **CORS Support**: Cross-origin resource sharing enabled

## API Endpoints

### POST /predict
Predicts improvement score based on exercise metrics.

**Request Body:**
```json
{
    "accuracy": 85.5,
    "focus_duration": 240,
    "movement_score": 78.2
}
```

**Response:**
```json
{
    "improvement_score": 82.5,
    "input_data": {
        "accuracy": 85.5,
        "focus_duration": 240,
        "movement_score": 78.2
    },
    "model_type": "trained"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
    "status": "healthy",
    "model_loaded": true,
    "scaler_loaded": true
}
```

### GET /model/info
Get information about the loaded model.

**Response:**
```json
{
    "model_loaded": true,
    "scaler_loaded": true,
    "prediction_method": "trained_model",
    "description": "Vision Therapy Improvement Score Prediction Model"
}
```

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

### Development Mode
```bash
python src/api/ml_service.py
```

### Production Mode
```bash
gunicorn --bind 0.0.0.0:5000 src.api.ml_service:app
```

## Environment Variables

- `PORT`: Port number (default: 5000)
- `DEBUG`: Debug mode (default: False)

## Model Training

The service can work with both trained models and rule-based predictions:

1. **Trained Model**: Place your trained model at `models/vision_therapy_model.pkl`
2. **Scaler**: Place the scaler at `models/scaler.pkl`
3. **Fallback**: If no model is found, the service uses rule-based prediction

## Rule-based Prediction Logic

When no trained model is available, the service uses a weighted combination:
- Accuracy: 40% weight
- Focus Duration: 30% weight (normalized to 5 minutes max)
- Movement Score: 30% weight

Additional bonuses and penalties are applied based on performance thresholds.

## Integration with Spring Boot

The Spring Boot backend calls this service using the `/predict` endpoint with exercise metrics and receives the improvement score to store in the database.

## Error Handling

The service includes comprehensive error handling for:
- Missing or invalid input data
- Model loading errors
- Prediction errors
- Server errors

All errors return appropriate HTTP status codes and descriptive error messages.

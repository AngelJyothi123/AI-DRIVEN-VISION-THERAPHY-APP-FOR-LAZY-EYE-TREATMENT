print("Starting ml_service.py execution...")
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import joblib
import os
import logging

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VisionTherapyMLModel:
    def __init__(self):
        """Initialize the ML model"""
        self.model = None
        self.scaler = None
        self.load_model()
    
    def load_model(self):
        """Load the trained improvement and recommendation models"""
        try:
            imp_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'improvement_model.pkl')
            rec_path = os.path.join(os.path.dirname(__file__), '..', '..', 'models', 'recommendation_model.pkl')
            
            if os.path.exists(imp_path) and os.path.exists(rec_path):
                self.model = joblib.load(imp_path)
                self.rec_model = joblib.load(rec_path)
                logger.info("Loaded trained ML models from disk")
            else:
                logger.warning("Models not found, defaulting to rule-based fallback")
                self.model = None
                self.rec_model = None
                
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = None
            self.rec_model = None
    
    def predict_improvement_score(self, features):
        """Predict improvement score based on exercise metrics"""
        try:
            if self.model is not None:
                # Use trained Gradient Boosting Regression model
                improvement_score = float(self.model.predict(features)[0])
                improvement_score = max(0.0, min(100.0, improvement_score))
            else:
                # Rule-based fallback
                improvement_score = float(self.rule_based_prediction(*features.values[0][:3]))
                
            return float(round(improvement_score, 2))
            
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            return 50.0
    
    def rule_based_prediction(self, accuracy, focus_duration, movement_score):
        """
        Rule-based prediction for improvement score
        
        This is a fallback method when no trained model is available
        """
        # Normalize inputs
        norm_accuracy = accuracy / 100.0
        norm_focus = min(focus_duration / 300.0, 1.0)  # Normalize to 5 minutes max
        norm_movement = movement_score / 100.0
        
        # Weighted combination (these weights can be adjusted based on domain expertise)
        accuracy_weight = 0.4
        focus_weight = 0.3
        movement_weight = 0.3
        
        # Calculate improvement score
        base_score = (norm_accuracy * accuracy_weight + 
                     norm_focus * focus_weight + 
                     norm_movement * movement_weight) * 100
        
        # Add bonus for good performance
        if accuracy > 80 and focus_duration > 180 and movement_score > 70:
            base_score += 10  # Bonus for excellent performance
        
        # Add penalty for very poor performance
        if accuracy < 30 or focus_duration < 60:
            base_score -= 10  # Penalty for very poor performance
        
        return max(0, min(100, base_score))

    def recommend_exercise(self, features, backup_improvement_score):
        """Decision tree classification for next exercise"""
        if getattr(self, 'rec_model', None) is not None:
            return str(self.rec_model.predict(features)[0])
            
        # Fallback tree
        if backup_improvement_score > 85:
            return "Advanced Saccadic Movement Training"
        elif backup_improvement_score > 60:
            return "Smooth Pursuit Tracking"
        elif backup_improvement_score > 40:
            return "Basic Eye Alignment Check"
        else:
            return "Near-Far Focus Drill"

# Initialize ML model
ml_model = VisionTherapyMLModel()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': ml_model.model is not None,
        'scaler_loaded': ml_model.scaler is not None
    })

@app.route('/predict', methods=['POST'])
def predict():
    """
    Predict improvement score based on exercise metrics
    
    Expected JSON payload:
    {
        "accuracy": 85.5,
        "focus_duration": 240,
        "movement_score": 78.2
    }
    """
    try:
        # Get JSON data from request
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No JSON data provided'}), 400
        
        # Validate required fields
        required_fields = ['accuracy', 'focus_duration', 'movement_score']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract full feature payload for ML algorithms
        accuracy = float(data['accuracy'])
        focus = int(data['focus_duration'])
        mov = float(data['movement_score'])
        fatigue = int(data.get('fatigue_level', 0))
        age = int(data.get('patient_age', 30))
        amblyopia_type = int(data.get('amblyopia_type', 1))
        
        # Format the 1x6 dimension tensor array matching SciKit Learn pipeline
        features = pd.DataFrame(
            [[accuracy, focus, mov, fatigue, age, amblyopia_type]], 
            columns=['accuracy', 'focus_duration', 'movement_score', 'fatigue_level', 'patient_age', 'amblyopia_type']
        )
        
        # Make inferences
        improvement_score = ml_model.predict_improvement_score(features)
        recommended_exercise = ml_model.recommend_exercise(features, improvement_score)
        
        # Return response
        response = {
            'improvementScore': improvement_score,
            'recommendedExercise': recommended_exercise,
            'input_data': {
                'accuracy': accuracy,
                'focus_duration': focus,
                'movement_score': mov
            },
            'model_type': 'trained' if ml_model.model is not None else 'rule_based'
        }
        
        return jsonify(response)
        
    except ValueError as e:
        logger.error(f"Value error in prediction: {e}")
        return jsonify({'error': f'Invalid data format: {str(e)}'}), 400
    
    except Exception as e:
        logger.error(f"Unexpected error in prediction: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    return jsonify({
        'model_loaded': ml_model.model is not None,
        'scaler_loaded': ml_model.scaler is not None,
        'prediction_method': 'trained_model' if ml_model.model is not None else 'rule_based',
        'description': 'Vision Therapy Improvement Score Prediction Model'
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    print("Inside __main__ block!")
    # Run the Flask app
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Vision Therapy ML Service on port {port}")
    logger.info(f"Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)

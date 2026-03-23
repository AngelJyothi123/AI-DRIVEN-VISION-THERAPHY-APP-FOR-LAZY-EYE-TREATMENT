import pandas as pd
import numpy as np
import os
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import mean_squared_error, accuracy_score

print("Loading synthetic Vision Therapy dataset...")
df = pd.read_csv('data/vision_therapy_dataset.csv')

# Features for predicting improvement score
# The AI needs to look at their actual performance to predict their clinical improvement
X = df[['accuracy', 'focus_duration', 'movement_score', 'fatigue_level', 'patient_age', 'amblyopia_type']]

# Targets
y_improvement = df['improvement_score']
y_recommendation = df['recommended_exercise']

print("\n--- Training Improvement Predictor (Gradient Boosting) ---")
X_train_imp, X_test_imp, y_train_imp, y_test_imp = train_test_split(X, y_improvement, test_size=0.2, random_state=42)

gbr = GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=4, random_state=42)
gbr.fit(X_train_imp, y_train_imp)

preds_imp = gbr.predict(X_test_imp)
mse = mean_squared_error(y_test_imp, preds_imp)
print(f"Gradient Boosting MSE: {mse:.4f}")
print(f"Sample Predictions vs Actual: {preds_imp[:3].round(2)} vs {y_test_imp.values[:3]}")


print("\n--- Training Exercise Recommender (Decision Tree) ---")
X_train_rec, X_test_rec, y_train_rec, y_test_rec = train_test_split(X, y_recommendation, test_size=0.2, random_state=42)

dtc = DecisionTreeClassifier(max_depth=5, random_state=42)
dtc.fit(X_train_rec, y_train_rec)

preds_rec = dtc.predict(X_test_rec)
acc = accuracy_score(y_test_rec, preds_rec)
print(f"Decision Tree Accuracy: {acc * 100:.2f}%")
print(f"Sample Recommendations: {preds_rec[:3]}")

print("\nSaving Models to Disk...")
os.makedirs('models', exist_ok=True)
joblib.dump(gbr, 'models/improvement_model.pkl')
joblib.dump(dtc, 'models/recommendation_model.pkl')

print("Models successfully saved to 'models/' directory!")
print("Pipeline complete.")

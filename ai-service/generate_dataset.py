import pandas as pd
import numpy as np
import random
import os

print("Generating synthetic Vision Therapy dataset...")

NUM_SAMPLES = 10000

# Input Features
accuracies = np.random.normal(loc=75.0, scale=15.0, size=NUM_SAMPLES).clip(0, 100)
focus_durations = np.random.normal(loc=45.0, scale=10.0, size=NUM_SAMPLES).clip(0, 60)
movement_scores = np.random.normal(loc=85.0, scale=10.0, size=NUM_SAMPLES).clip(0, 100)

# Simulate patient traits underlying the metrics
ages = np.random.randint(5, 60, size=NUM_SAMPLES)
# 0 = Strabismic, 1 = Refractive, 2 = Deprivation
amblyopia_types = np.random.randint(0, 3, size=NUM_SAMPLES)
fatigue_levels = np.random.randint(0, 3, size=NUM_SAMPLES)

improvement_scores = []
recommended_exercises = []

EXERCISES = [
    "Target Pursuit Tracking", 
    "Contrast Sensitivity Array", 
    "Dynamic Near-Far Focus", 
    "Pattern Synthesizer Matrix"
]

for i in range(NUM_SAMPLES):
    acc = accuracies[i]
    focus = focus_durations[i]
    mov = movement_scores[i]
    fatigue = fatigue_levels[i]
    
    # 1. Generate Target: Improvement Score (Gradient Boosting Target)
    # A complex non-linear relationship simulating human physiological improvement
    base_improvement = (acc * 0.4) + (focus * 0.8) + (mov * 0.2)
    # Penalize for high fatigue
    fatigue_penalty = fatigue * 12.0
    # Random variance
    noise = np.random.normal(0, 3.0)
    
    final_score = base_improvement - fatigue_penalty + noise
    # Map to a 0-100 curve
    final_score = np.clip(final_score / 130.0 * 100.0, 0, 100)
    improvement_scores.append(round(final_score, 2))
    
    # 2. Generate Target: Recommended Exercise (Decision Tree Target)
    if fatigue >= 2:
        # High fatigue: recommend a logic game to rest the tracking muscles
        rec = "Pattern Synthesizer Matrix"
    else:
        if mov < 75.0:
            rec = "Target Pursuit Tracking"
        elif focus < 40.0:
            rec = "Dynamic Near-Far Focus"
        elif acc < 65.0:
            rec = "Contrast Sensitivity Array"
        else:
            # Everything is great, push difficulty
            rec = random.choice(EXERCISES)
            
    recommended_exercises.append(rec)

data = {
    'accuracy': accuracies.round(2),
    'focus_duration': focus_durations.round(1),
    'movement_score': movement_scores.round(2),
    'fatigue_level': fatigue_levels,
    'patient_age': ages,
    'amblyopia_type': amblyopia_types,
    'improvement_score': improvement_scores,
    'recommended_exercise': recommended_exercises
}

df = pd.DataFrame(data)

os.makedirs('data', exist_ok=True)
df.to_csv('data/vision_therapy_dataset.csv', index=False)
print(f"Successfully generated 10,000 synthetic clinical records at data/vision_therapy_dataset.csv!")
print("Dataset Head:")
print(df.head())

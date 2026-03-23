import os
import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from skimage.feature import hog
import joblib

# Path
BASE_PATH = r"D:\vision-therapy-app\ai-service\data\processed"

CLASSES = ["left", "right", "center"]

X = []
y = []

label_map = {
    "left": 0,
    "right": 1,
    "center": 2
}

for label in CLASSES:
    folder = os.path.join(BASE_PATH, label)

    for img_name in os.listdir(folder):
        img_path = os.path.join(folder, img_name)

        img = cv2.imread(img_path, cv2.IMREAD_GRAYSCALE)

        if img is None:
            continue

        img = cv2.resize(img, (100, 100))

        # 🔥 HOG FEATURE
        hog_features = hog(
            img,
            orientations=9,
            pixels_per_cell=(8, 8),
            cells_per_block=(2, 2),
            visualize=False
        )

        # 🔥 POSITION FEATURE
        h, w = img.shape
        left_half = img[:, :w//2]
        right_half = img[:, w//2:]

        left_mean = np.mean(left_half)
        right_mean = np.mean(right_half)

        position_feature = [left_mean - right_mean]

        # Combine features
        features = np.hstack([hog_features, position_feature])

        X.append(features)
        y.append(label_map[label])

X = np.array(X)
y = np.array(y)

print("Data loaded:", X.shape)

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Accuracy:", accuracy)

# Save model
MODEL_PATH = r"D:\vision-therapy-app\ai-service\models\eye_model.pkl"
joblib.dump(model, MODEL_PATH)

print("Model saved at:", MODEL_PATH)
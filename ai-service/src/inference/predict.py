import cv2
import numpy as np
import joblib
from collections import deque
from skimage.feature import hog

# Load model
model = joblib.load(r"D:\vision-therapy-app\ai-service\models\eye_model.pkl")

IMG_SIZE = (100, 100)

# Load cascades
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_eye.xml'
)

# Smoothing
history = deque(maxlen=10)

frame_count = 0

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame_count += 1
    if frame_count % 3 != 0:
        continue

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:

        face = gray[y:y+h, x:x+w]

        eyes = eye_cascade.detectMultiScale(face)

        for (ex, ey, ew, eh) in eyes:

            # Filter bad detections
            if ew < 30 or eh < 15:
                continue
            if ew < eh:
                continue

            eye = face[ey:ey+eh, ex:ex+ew]

            # Normalize lighting
            eye = cv2.equalizeHist(eye)

            resized = cv2.resize(eye, IMG_SIZE)

            # 🔥 HOG FEATURES
            hog_features = hog(
                resized,
                orientations=9,
                pixels_per_cell=(8, 8),
                cells_per_block=(2, 2),
                visualize=False
            )

            # 🔥 POSITION FEATURE
            h_, w_ = resized.shape
            left_half = resized[:, :w_//2]
            right_half = resized[:, w_//2:]

            left_mean = np.mean(left_half)
            right_mean = np.mean(right_half)

            position_feature = [left_mean - right_mean]

            features = np.hstack([hog_features, position_feature])

            img_flat = features.reshape(1, -1)

            prediction = model.predict(img_flat)[0]

            history.append(prediction)
            final_prediction = max(set(history), key=history.count)

            if final_prediction == 0:
                text = "LEFT"
            elif final_prediction == 1:
                text = "RIGHT"
            else:
                text = "CENTER"

            # Draw boxes
            cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.rectangle(frame, (x+ex, y+ey), (x+ex+ew, y+ey+eh), (0,255,0), 2)

            cv2.putText(frame, text, (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1,
                        (0,255,0), 2)

            break

        break

    cv2.imshow("Eye Direction Detection", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
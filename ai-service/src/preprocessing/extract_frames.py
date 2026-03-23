import cv2
import os

# Paths
BASE_PATH = r"D:\vision-therapy-app\ai-service\data"
RAW_PATH = os.path.join(BASE_PATH, "raw")
PROCESSED_PATH = os.path.join(BASE_PATH, "processed")

CLASSES = ["left", "right", "center"]

FRAME_SKIP = 5
IMG_SIZE = (100, 100)

# Load cascades
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
)

eye_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + 'haarcascade_eye.xml'
)

def process_videos():
    for label in CLASSES:
        raw_folder = os.path.join(RAW_PATH, label)
        processed_folder = os.path.join(PROCESSED_PATH, label)

        os.makedirs(processed_folder, exist_ok=True)

        video_files = os.listdir(raw_folder)

        print(f"\nProcessing {label}...")

        count = 0

        for video in video_files:
            video_path = os.path.join(raw_folder, video)
            cap = cv2.VideoCapture(video_path)

            frame_num = 0

            while True:
                ret, frame = cap.read()

                if not ret:
                    break

                if frame_num % FRAME_SKIP == 0:

                    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

                    faces = face_cascade.detectMultiScale(gray, 1.3, 5)

                    for (x, y, w, h) in faces:

                        face = gray[y:y+h, x:x+w]

                        eyes = eye_cascade.detectMultiScale(face)

                        for (ex, ey, ew, eh) in eyes:

                            # 🔴 FILTER WRONG DETECTIONS
                            if ew < 30 or eh < 15:
                                continue

                            if ew < eh:  # eye should be wider than tall
                                continue

                            eye = face[ey:ey+eh, ex:ex+ew]

                            resized = cv2.resize(eye, IMG_SIZE)

                            filename = f"{label}_{count}.jpg"
                            save_path = os.path.join(processed_folder, filename)

                            cv2.imwrite(save_path, resized)
                            count += 1

                            break  # take only one eye

                        break  # take only one face

                frame_num += 1

            cap.release()

        print(f"{label} done. Total images: {count}")

if __name__ == "__main__":
    process_videos()
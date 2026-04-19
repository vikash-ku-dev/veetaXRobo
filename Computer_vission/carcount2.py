from ultralytics import YOLO
import cv2

model = YOLO("yolov8n.pt")  # pre-trained model

cap = cv2.VideoCapture("video.mp4")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    results = model(frame)

    for r in results:
        boxes = r.boxes
        for box in boxes:
            cls = int(box.cls[0])

            if cls == 2:  # class 2 = car
                # Get coordinates

                x1, y1, x2, y2 = map(int, box.xyxy[0])

                # Draw RED rectangle (BGR → (0,0,255))
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 0, 255), 2)

                # Optional: label
                cv2.putText(frame, "Car", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                            (0, 0, 255), 2)

    cv2.imshow("frame", frame)

    if cv2.waitKey(1) == 32:
        break

cap.release()
cv2.destroyAllWindows()
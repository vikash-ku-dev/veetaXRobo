from ultralytics import YOLO
import cv2
model = YOLO("yolov8n.pt")
image = cv2.imread("traffic.png")  # <-- put your image path

results = model(image)

car_count = 0

for r in results:
    boxes = r.boxes
    for box in boxes:
        cls = int(box.cls[0])

        if cls == 2:  
            car_count += 1

 
            x1, y1, x2, y2 = map(int, box.xyxy[0])

            
            cv2.rectangle(image, (x1, y1), (x2, y2), (0, 0, 255), 2)

            # Label
            cv2.putText(image, f"Car no.{car_count}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5,
                        (0, 0, 255), 2)

# Show count on image
cv2.putText(image, f"Total Cars:{car_count}", (20, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 1,
            (225, 225, 225), 3
            )

# Show result
cv2.imshow("Car Detection", image)
cv2.imwrite("image2.png",image)
cv2.waitKey(0)
cv2.destroyAllWindows() 

# Print count
print("Total cars detected:", car_count)
# WiFi Siren System 🚨

## What Does It Do?

An **ESP32** device that:
- Connects to WiFi
- Reads a signal from Firebase database
- **Activates a siren** (flashing LEDs + beeping sound) when triggered
- **Auto-stops after 5 minutes**

Perfect for remote-controlled alarms and emergency systems.

---

## Hardware Needed

- **ESP32 microcontroller**
- **2 LEDs** (with 220Ω resistors)
- **Piezo speaker/buzzer**
- Jumper wires & breadboard

### Connections

```
ESP32 PIN 18 → LED1 → GND
ESP32 PIN 19 → LED2 → GND
ESP32 PIN 25 → Speaker → GND
```

---

## Quick Setup (5 Steps)

### 1. Install Arduino IDE
Download from: https://www.arduino.cc/en/software

### 2. Add ESP32 Support
- File → Preferences
- Add this to "Additional Board Manager URLs":
  ```
  https://dl.espressif.com/dl/package_esp32_index.json
  ```
- Tools → Board Manager → Search "ESP32" → Install

### 3. Create Firebase Project
- Go to: https://console.firebase.google.com/
- Create project → Realtime Database
- Create this structure:
  ```
  servo/
    └── status: 0
  ```

### 4. Get Firebase Credentials
- Firebase Console → Project Settings → Service Accounts
- Copy: **Project ID** and **Database Secret**

### 5. Update the Code
Open `sketch_apr19a.ino` and change these lines:

```cpp
// Line 5-6: WiFi
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASS";

// Line 9-10: Firebase
String firebaseHost = "https://YOUR-PROJECT-ID-default-rtdb.firebaseio.com";
String firebaseAuth = "YOUR_DATABASE_SECRET";
```

### 6. Upload
- Select Board: ESP32-WROOM-DA
- Select COM Port
- Click Upload button
- Open Serial Monitor (115200 baud)
- Wait for: `RECEIVER READY`

---

## How to Trigger

Change status in Firebase Console from `0` → `1`:
- Go to Firebase Realtime Database
- Click `servo` → `status`
- Change to `1` ✅
- **Siren activates!** 🚨

Automatically stops after 5 minutes.

---

## How It Works (Simple)

1. **Every 800ms:** Check Firebase for status
2. **If status = 1:** Turn on LEDs + speaker
3. **LEDs:** Blink alternately (80ms speed)
4. **Speaker:** Play tones (900 Hz ↔ 1200 Hz)
5. **After 5 mins:** Stop everything

---

## Done! 🎉

Your remote alarm system is ready to use!

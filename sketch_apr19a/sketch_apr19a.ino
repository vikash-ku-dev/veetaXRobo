#include <WiFi.h>
#include <HTTPClient.h>

// ================= WIFI =================
const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASS";

// ================= FIREBASE =================
String firebaseHost = "https://your-project-id-default-rtdb.firebaseio.com";
String firebaseAuth = "YOUR_DATABASE_SECRET";

// ================= PINS =================
#define LED1 18
#define LED2 19
#define SPEAKER 25

bool active = false;
unsigned long startTime = 0;
unsigned long lastCheck = 0;

// 🔥 SIREN CONTROL
unsigned long lastBlink = 0;
bool ledState = false;
int toneFreq = 800;

// ================= FIREBASE =================
int readStatus(){

  HTTPClient http;
  String url = firebaseHost + "/servo/status.json?auth=" + firebaseAuth;

  http.begin(url);
  int code = http.GET();

  if(code==200){
    String val = http.getString();
    val.trim();
    http.end();
    return val.toInt();
  }

  http.end();
  return 0;
}

// ================= SETUP =================
void setup(){

  Serial.begin(115200);

  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);

  ledcAttach(SPEAKER, 1000, 8);

  WiFi.begin(ssid,password);
  while(WiFi.status()!=WL_CONNECTED) delay(500);

  Serial.println("RECEIVER READY");
}

// ================= LOOP =================
void loop(){

  // 🔥 CHECK DATABASE
  if(millis()-lastCheck > 800){
    lastCheck = millis();

    if(readStatus() == 1){
      Serial.println("🚨 TRIGGER");
      active = true;
      startTime = millis();
    }
  }

  // 🔥 AUTO STOP AFTER 5 MIN
  if(active && millis()-startTime >= 300000){

    active = false;

    digitalWrite(LED1, LOW);
    digitalWrite(LED2, LOW);
    ledcWriteTone(SPEAKER, 0);

    Serial.println("STOPPED");
  }

  // ================= FAST SIREN =================
  if(active){

    // 🔥 FAST BLINK (every 80 ms)
    if(millis() - lastBlink > 80){

      lastBlink = millis();
      ledState = !ledState;

      digitalWrite(LED1, ledState);
      digitalWrite(LED2, !ledState);

      // 🔥 CHANGE SOUND WITH LED
      if(ledState){
        toneFreq = 1200;
      } else {
        toneFreq = 900;
      }

      ledcWriteTone(SPEAKER, toneFreq);
    }
  }
}
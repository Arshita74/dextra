/*
  =============================================================================
  DEXTRA — Smart Wrist-Hand Orthosis Firmware (ESP32)
  =============================================================================
  Hardware Components:
  - ESP32 Development Board (Wi-Fi Enabled)
  - 2 × MG90S Servo Motors (PWM Pins 18 and 19)
  - 2 × Push Buttons (GPIO Pins 4 and 5 with internal pull-up)
  - Status LED (GPIO Pin 2)

  Network Architecture:
  ESP32 -> HTTP POST -> FastAPI Backend (/api/ingest)
  =============================================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>

// --- Wi-Fi Credentials ---
const char* ssid     = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// --- API Server Settings ---
const char* apiIngestEndpoint = "http://192.168.1.100:8000/api/ingest";

// --- Hardware Pin Definitions ---
#define SERVO1_PIN 18
#define SERVO2_PIN 19
#define BTN_START_PIN 4
#define BTN_COUNT_PIN 5
#define LED_STATUS_PIN 2

// --- Servo Instances ---
Servo servo1;
Servo servo2;

// --- State Variables ---
int servo1NeutralAngle = 90;
int servo2NeutralAngle = 90;
int currentServo1Angle = 90;
int currentServo2Angle = 90;

bool sessionActive = false;
int currentRepetitions = 0;
unsigned long lastDebounceTime = 0;
const unsigned long debounceDelay = 250; // ms

void setup() {
  Serial.begin(115200);
  pinMode(LED_STATUS_PIN, OUTPUT);
  pinMode(BTN_START_PIN, INPUT_PULLUP);
  pinMode(BTN_COUNT_PIN, INPUT_PULLUP);

  digitalWrite(LED_STATUS_PIN, LOW);

  // Attach MG90S Servos
  ESP32PWM::allocateTimer(0);
  ESP32PWM::allocateTimer(1);
  servo1.setPeriodHertz(50);
  servo2.setPeriodHertz(50);
  servo1.attach(SERVO1_PIN, 500, 2400);
  servo2.attach(SERVO2_PIN, 500, 2400);

  // Reset Servos to Neutral Position
  servo1.write(servo1NeutralAngle);
  servo2.write(servo2NeutralAngle);

  // Connect to Wi-Fi
  Serial.print("Connecting to Wi-Fi: ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi Connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    digitalWrite(LED_STATUS_PIN, HIGH);
    sendTelemetry("HEARTBEAT", "CONNECTED", 90, 90, "RELEASED");
  } else {
    Serial.println("\nWi-Fi Connection failed. Running in offline standalone mode.");
  }
}

void loop() {
  unsigned long now = millis();

  // Button 1: Start/Pause Session
  if (digitalRead(BTN_START_PIN) == LOW && (now - lastDebounceTime > debounceDelay)) {
    lastDebounceTime = now;
    sessionActive = !sessionActive;
    Serial.print("Session State Toggled: ");
    Serial.println(sessionActive ? "ACTIVE" : "PAUSED");

    sendTelemetry("SESSION_TOGGLE", sessionActive ? "ACTIVE" : "PAUSED", currentServo1Angle, currentServo2Angle, "PRESSED");
  }

  // Button 2: Manual Repetition Hardware Trigger
  if (digitalRead(BTN_COUNT_PIN) == LOW && (now - lastDebounceTime > debounceDelay)) {
    lastDebounceTime = now;
    if (sessionActive) {
      currentRepetitions++;
      Serial.print("Repetition Triggered! Count: ");
      Serial.println(currentRepetitions);

      // Perform Physical Servo Flexion/Extension Assist
      performFlexionSweep();

      sendTelemetry("REP_COMPLETE", "ACTIVE", currentServo1Angle, currentServo2Angle, "PRESSED");
    }
  }

  // Periodical Heartbeat (Every 10 seconds)
  static unsigned long lastHeartbeat = 0;
  if (now - lastHeartbeat > 10000) {
    lastHeartbeat = now;
    if (WiFi.status() == WL_CONNECTED) {
      sendTelemetry("HEARTBEAT", sessionActive ? "ACTIVE" : "IDLE", currentServo1Angle, currentServo2Angle, "RELEASED");
    }
  }
}

void performFlexionSweep() {
  // Controlled Flexion sweep for Wrist-Hand Orthosis
  for (int angle = 90; angle <= 150; angle += 5) {
    servo1.write(angle);
    servo2.write(angle);
    currentServo1Angle = angle;
    currentServo2Angle = angle;
    delay(20);
  }
  delay(300); // Hold peak flexion
  for (int angle = 150; angle >= 90; angle -= 5) {
    servo1.write(angle);
    servo2.write(angle);
    currentServo1Angle = angle;
    currentServo2Angle = angle;
    delay(20);
  }
}

void sendTelemetry(const char* eventType, const char* status, int s1Angle, int s2Angle, const char* btnState) {
  if (WiFi.status() != WL_CONNECTED) return;

  HTTPClient http;
  http.begin(apiIngestEndpoint);
  http.addHeader("Content-Type", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"device_id\":\"ESP32-DEXTRA-01\",";
  jsonPayload += "\"event_type\":\"" + String(eventType) + "\",";
  jsonPayload += "\"servo1_angle\":" + String(s1Angle) + ",";
  jsonPayload += "\"servo2_angle\":" + String(s2Angle) + ",";
  jsonPayload += "\"button_state\":\"" + String(btnState) + "\",";
  jsonPayload += "\"user_id\":\"usr-patient\"";
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);
  if (httpResponseCode > 0) {
    Serial.printf("Telemetry sent successfully. Response: %d\n", httpResponseCode);
  } else {
    Serial.printf("Error sending telemetry POST: %s\n", http.errorToString(httpResponseCode).c_str());
  }
  http.end();
}

#include <M5StickC.h>

int16_t accX = 0;
int16_t accY = 0;
int16_t accZ = 0;

int16_t gyroX = 0;
int16_t gyroY = 0;
int16_t gyroZ = 0;

void setup() {
  // put your setup code here, to run once:
  M5.begin();
  pinMode(M5_BUTTON_HOME, INPUT);
  M5.IMU.Init();
  M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(40, 0);
  M5.Lcd.println("SH200I TEST");
  M5.Lcd.setCursor(0, 15);
  M5.Lcd.println("  X       Y       Z");
}



int count = 0;


void loop() {
  // put your main code here, to run repeatedly:
  M5.IMU.getGyroData(&gyroX, &gyroY, &gyroZ);
  M5.IMU.getAccelData(&accX, &accY, &accZ);


  M5.Lcd.setCursor(0, 30);
  M5.Lcd.printf("%.2f   %.2f   %.2f      ", ((float) gyroX) * M5.IMU.gRes, ((float) gyroY) * M5.IMU.gRes, ((float) gyroZ) * M5.IMU.gRes);
  M5.Lcd.setCursor(140, 30);
  M5.Lcd.print("mg");
  M5.Lcd.setCursor(0, 45);
  M5.Lcd.printf("%.2f   %.2f   %.2f      ", ((float) accX) * M5.IMU.aRes, ((float) accY) * M5.IMU.aRes, ((float) accZ) * M5.IMU.aRes);
  M5.Lcd.setCursor(140, 45);
  M5.Lcd.print("o/s");
  M5.Lcd.setCursor(0, 60);
  M5.Lcd.printf("count = %d", count);

  while (((float) accY) * M5.IMU.aRes < 0.10) {
    M5.IMU.getAccelData(&accX, &accY, &accZ);
    if (((float) accY) * M5.IMU.aRes >= 0.10) {
      count++;
      break;
    }

  }
  delay(800);

 


}

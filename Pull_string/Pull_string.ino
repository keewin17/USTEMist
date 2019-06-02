#include <M5StickC.h>
#include <SPI.h>
#include <WiFi.h>


int16_t accX = 0;
int16_t accY = 0;
int16_t accZ = 0;

int16_t gyroX = 0;
int16_t gyroY = 0;
int16_t gyroZ = 0;

void setup() {
  // put your setup code here, to run once:
  M5.begin();
  M5.IMU.Init();
  pinMode(M5_BUTTON_HOME, INPUT);
  
}




void loop() {
  pull_string();

  
}
void pull_string() {
  int count=0;
   M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  M5.Lcd.setTextSize(1);
  M5.Lcd.setCursor(40, 0);
  M5.Lcd.println("SH200I TEST");
  M5.Lcd.setCursor(0, 15);
  M5.Lcd.println("  X       Y       Z");
    // put your main code here, to run repeatedly:
  M5.IMU.getGyroData(&gyroX,&gyroY,&gyroZ);
  M5.IMU.getAccelData(&accX,&accY,&accZ);
 
  
  M5.Lcd.setCursor(0, 30);
  M5.Lcd.printf("%.2f   %.2f   %.2f      ", ((float) gyroX) * M5.IMU.gRes, ((float) gyroY) * M5.IMU.gRes,((float) gyroZ) * M5.IMU.gRes);
  M5.Lcd.setCursor(140, 30);
  M5.Lcd.print("mg");
  M5.Lcd.setCursor(0, 45);
  M5.Lcd.printf("%.2f   %.2f   %.2f      ",((float) accX) * M5.IMU.aRes,((float) accY) * M5.IMU.aRes, ((float) accZ) * M5.IMU.aRes);
  M5.Lcd.setCursor(140, 45);
  M5.Lcd.print("o/s");
  M5.Lcd.setCursor(0, 60);
  M5.Lcd.printf("%d",count);
  
   while (((float) accY) * M5.IMU.aRes<0){
    M5.IMU.getAccelData(&accX,&accY,&accZ);
    if (((float) accY) * M5.IMU.aRes >=0){
      count++;
      break;
    }
 
 }
 delay(500);

}

void connect_wifi() {
  char ssid[] = "Keewin";     //  your network SSID (name)
  char pass[] = "12345678";  // your network password
  int status = WL_IDLE_STATUS;     // the Wifi radio's status
  M5.begin(9600);
  M5.IMU.Init();
  M5.Lcd.setRotation(3);
  M5.Lcd.fillScreen(BLACK);
  
  status = WiFi.begin(ssid,pass);

  // check for the presence of the shield:
  if (WiFi.status() == WL_NO_SHIELD) {
    M5.Lcd.println("WiFi shield not present");
    // don't continue:
    while (true);
  }



  // attempt to connect to Wifi network:
  while (status != WL_CONNECTED) {
    M5.Lcd.print("Attempting to connect to WPA SSID: ");
    M5.Lcd.println(ssid);
    // Connect to WPA/WPA2 network:
    status = WiFi.begin(ssid, pass);

    // wait 10 seconds for connection:
    delay(10000);
  }

  // you're connected now, so print out the data:
  M5.Lcd.print("You're connected to the network");
 
  printWifiData();

  
}
  
  void printWifiData() {
  // print your WiFi shield's IP address:
  IPAddress ip = WiFi.localIP();
  M5.Lcd.print("IP Address: ");
  M5.Lcd.println(ip);
  M5.Lcd.println(ip);

  // print your MAC address:
  byte mac[6];
  WiFi.macAddress(mac);
  M5.Lcd.print("MAC address: ");
  M5.Lcd.print(mac[5], HEX);
  M5.Lcd.print(":");
  M5.Lcd.print(mac[4], HEX);
  M5.Lcd.print(":");
  M5.Lcd.print(mac[3], HEX);
  M5.Lcd.print(":");
  M5.Lcd.print(mac[2], HEX);
  M5.Lcd.print(":");
  M5.Lcd.print(mac[1], HEX);
  M5.Lcd.print(":");
  M5.Lcd.println(mac[0], HEX);

}

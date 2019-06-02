#include <M5StickC.h>
#include <SPI.h>
#include <WiFi.h>

char ssid[] = "Keewin";     //  your network SSID (name)
char pass[] = "12345678";  // your network password
int status = WL_IDLE_STATUS;     // the Wifi radio's status



void setup() {
  //Initialize serial and wait for port to open:
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

void loop() {
  // check the network connection once every 10 seconds:
  delay(10000);
 
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

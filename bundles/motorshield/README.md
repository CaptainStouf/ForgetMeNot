
https://learn.adafruit.com/adafruit-16-channel-servo-driver-with-raspberry-pi/using-the-adafruit-library

sudo apt-get install python-smbus


https://learn.adafruit.com/adafruit-16-channel-servo-driver-with-raspberry-pi/configuring-your-pi-for-i2c

sudo apt-get install python-smbus
sudo apt-get install i2c-tools

#If you have Raspbian, not Occidentalis check /etc/modprobe.d/raspi-blacklist.conf and comment "blacklist i2c-bcm2708" by running sudo nano /etc/modprobe.d/raspi-blacklist.conf and adding a # (if its not there). 
#If you're running Wheezy or something-other-than-Occidentalis, you will need to 
#add the following lines to /etc/modules 
# i2c-dev 
#i2c-bcm2708
#and then reboot.

sudo sed -i 's/blacklist i2c-bcm2708/#blacklist i2c-bcm2708/g' /etc/modprobe.d/raspi-blacklist.conf

sudo sed -i '$ a\i2c-dev' /etc/modules  
sudo sed -i '$ a\i2c-bcm2708' /etc/modules 

sudo reboot
# Curtain/Motor Shield Controler

This bundle containt doc and source for the Pi with Adafruit motorshield

## Pi Installation

### Step 1

Prepare Micro SD card:
 * Download RASPBIAN [raspberrypi] (http://www.raspberrypi.org/downloads/)
 * Format SD Card with [SDFormatter.exe] (https://www.sdcard.org/downloads/formatter_4/eula_windows/)
 * Write Raspbian with [win32diskimager-v0.9-binary] (http://sourceforge.net/projects/win32diskimager/)

### Step 2

Pi configuration 
 * Boot Pi with PiTFT on it, extend file system and configure password, timezone and keyboard reboot
 * Configure wifi using [WiFi Config utility] (https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/setting-up-wifi-with-raspbian)

 * Update raspberrypi
```sh
sudo apt-get update
sudo apt-get upgrade
sudo reboot
```
### Step 3

Change Pi hostname for easily identification on your wifi router [Details] (http://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/)
```sh
sudo sed -i 's/raspberrypi/RPi-MotorShield1/g' /etc/hostname
sudo sed -i 's/raspberrypi/RPi-MotorShield1/g' /etc/hosts
sudo /etc/init.d/hostname.sh
sudo reboot
```

```sh
sudo sed -i 's/raspberrypi/RPi-MotorShield2/g' /etc/hostname
sudo sed -i 's/raspberrypi/RPi-MotorShield2/g' /etc/hosts
sudo /etc/init.d/hostname.sh
sudo reboot
```

### Step 4 

Configuring Pi for i2c to communicate with MotorShield
 * https://learn.adafruit.com/adafruit-16-channel-servo-driver-with-raspberry-pi/configuring-your-pi-for-i2c

```sh
sudo apt-get install python-smbus
sudo apt-get install i2c-tools

sudo sed -i 's/blacklist i2c-bcm2708/#blacklist i2c-bcm2708/g' /etc/modprobe.d/raspi-blacklist.conf
sudo sed -i '$ a\i2c-dev' /etc/modules  
sudo sed -i '$ a\i2c-bcm2708' /etc/modules
```

### Step 5 

Install nodejs (http://joshondesign.com/2013/10/23/noderpi)

```sh
cd ~
wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz
tar -xvzf node-v0.10.28-linux-arm-pi.tar.gz
echo NODE_JS_HOME=/home/pi/node-v0.10.28-linux-arm-pi >> /home/pi/.bash_profile
sudo sed -i '$ a\PATH=$PATH:$NODE_JS_HOME/bin' /home/pi/.bash_profile
# reboot or logout login user for bash_profile reload
sudo reboot
# Test
# node --version
```

### Step 6 

Install python MotorShield lib

```sh
cd ~
git clone https://github.com/pascalmartin/Adafruit-Raspberry-Pi-Python-Code.git

# Remplace Adafruit_I2C.py with symlink
cd /home/pi/Adafruit-Raspberry-Pi-Python-Code/Adafruit_MotorShield
rm Adafruit_I2C.py
ln -s ../Adafruit_I2C/Adafruit_I2C.py Adafruit_I2C.py
```

### Step 7

Install MotorShieldControler node app

Copie code from https://github.com/pascalmartin/ForgetMeNot/tree/master/bundles/rpisoc/MotorShieldControler and upload to ~/MotorShieldControler

```sh
cd ~/MotorShieldControler
npm install

# try execute with 
#sudo ../node-v0.10.28-linux-arm-pi/bin/node main.js
```

Configure deamon
 * https://gist.github.com/nariyu/1211413
 * http://stackoverflow.com/questions/11275870/how-can-i-automatically-start-a-node-js-application-in-amazon-linux-ami-on-aws

```sh
chmod 755 /home/pi/MotorShieldControler/MotorShieldControler.sh
sudo cp /home/pi/MotorShieldControler/MotorShieldControler.sh /etc/init.d

# Make sure the script is executable (chmod again). 
sudo chmod 755 /etc/init.d/MotorShieldControler.sh

#At this point you should be able to start your Python script using the command 
#   sudo /etc/init.d/MotorShieldControler.sh start
#   sudo sh -x /etc/init.d/MotorShieldControler.sh start
#check its status with the status argument
#   /etc/init.d/MotorShieldControler.sh status 
#and stop it with 
#   sudo /etc/init.d/MotorShieldControler.sh stop
# restart
#   sudo /etc/init.d/MotorShieldControler.sh restart

# To make the Raspberry Pi use your init script at the right time, one more step is required: running the command 
sudo update-rc.d MotorShieldControler.sh defaults

# This command adds in symbolic links to the /etc/rc.x directories so that the init script is run at the default times. you can see these links if you do 
#ls -l /etc/rc?.d/*MotorShieldControler.sh
```


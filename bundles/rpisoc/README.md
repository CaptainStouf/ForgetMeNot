# RPiSoC Ventilation Control

This bundle containt doc and source for the Pi with RPiSoc Board proto board
Install  

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
sudo sed -i 's/raspberrypi/RPi-RPiSoC/g' /etc/hosts
sudo sed -i 's/raspberrypi/RPi-RPiSoC/g' /etc/hostname
sudo /etc/init.d/hostname.sh
sudo reboot
```

### Step 4 

Setup SPI for RPiSoC communication

Detail
 * http://embeditelectronics.github.io/psoc_2_pi/getting_started.html#using-the-rpisoc
 * http://embeditelectronics.github.io/psoc_2_pi/getting_started.html#configure-spi-and-download-spidev
 * http://innovelectronique.fr/2013/03/02/utilisation-du-bus-i2c-sur-raspberrypi/


```sh
sudo sed -i 's/blacklist spi-bcm2708/#blacklist spi-bcm2708/g' /etc/modprobe.d/raspi-blacklist.conf

sudo apt-get install python-dev

sudo reboot
```

```sh
cd ~
mkdir python-spi
cd python-spi
wget https://raw.github.com/doceme/py-spidev/master/setup.py
wget https://raw.github.com/doceme/py-spidev/master/spidev_module.c
sudo python setup.py install
```

```sh
cd ~
sudo apt-get install git-core
git clone git://github.com/EmbeditElectronics/psoc_2_pi.git
cd API_Python_v_1_1
```

### Step 4 

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

### Step 5 

Install VentilationControler node app
Copie code from https://github.com/pascalmartin/ForgetMeNot/tree/master/bundles/rpisoc/VentilationControler and upload to ~/VentilationControler

# PiTFT Control

This bundle containt doc and source for the Pi with PiTFT Display Screen using for build home constrol panel.
Install  

## Pi Installation

More complete documentation on [Adafruit] (https://learn.adafruit.com/adafruit-pitft-28-inch-resistive-touchscreen-display-raspberry-pi/overview)

Summary :

### Step 1

Prepare Micro SD card:
 * Download RASPBIAN Ready to go image with PiTFT ready from [Adafruit] (https://learn.adafruit.com/adafruit-pitft-28-inch-resistive-touchscreen-display-raspberry-pi/easy-install)
 * Format SD Card with [SDFormatter.exe] (https://www.sdcard.org/downloads/formatter_4/eula_windows/)
 * Write Raspbian with [win32diskimager-v0.9-binary] (http://sourceforge.net/projects/win32diskimager/)

### Step 2

Pi configuration 
 * Boot Pi extend file system and configure password, timezone and keyboard
 * Configure wifi using [WiFi Config utility] (https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/setting-up-wifi-with-raspbian)

**Use this command to startx using the hdmi display (Very more usefull for configure WIFI)**
```sh
FRAMEBUFFER=/dev/fb0 startx
```
 The normal startx command use PiTFT display

 * Reboot
```sh
sudo reboot
```

 * Update raspberrypi
```sh
sudo apt-get update
sudo apt-get upgrade
sudo reboot
```
	
### Step 3 

Auto run browser on startup

Some resource :
 * http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
 * (Not tested) http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/auto-run-browser-on-startup

Summary:
 * Install dependency package
```sh
sudo apt-get install matchbox chromium ttf-mscorefonts-installer xwit libnss3
sudo reboot
```
 * Adding the following to /etc/rc.local:
```sh
if [ -f /boot/xinitrc ]; then
	ln -fs /boot/xinitrc /home/pi/.xinitrc;
	su - pi -c 'startx' &
fi
```
 * créer et ajouter /boot/xinitrc

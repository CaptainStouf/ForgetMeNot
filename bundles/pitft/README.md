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
 * Boot Pi with PiTFT on it, extend file system and configure password, timezone and keyboard reboot
 * Configure wifi using [WiFi Config utility] (https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/setting-up-wifi-with-raspbian)

**Use this command to startx using the hdmi display (Very more usefull for configure WIFI)**
```sh
FRAMEBUFFER=/dev/fb0 startx
```
 The normal startx command use PiTFT display

 * Logout and Reboot
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

Change Pi hostname for easily identification on your wifi router [Details] (http://www.howtogeek.com/167195/how-to-change-your-raspberry-pi-or-other-linux-devices-hostname/)
```sh
sudo sed -i 's/raspberrypi/RPi-PiTFT/g' /etc/hosts
sudo sed -i 's/raspberrypi/RPi-PiTFT/g' /etc/hostname
sudo /etc/init.d/hostname.sh
sudo reboot
```

### Step 4 

Auto run browser on startup

Some resource :
 * http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
 * (Not tested) http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/auto-run-browser-on-startup

Summary:
 * Install dependency package
```sh
sudo apt-get install matchbox chromium x11-xserver-utils ttf-mscorefonts-installer xwit sqlite3 libnss3
sudo reboot
```
 * Adding the following to /etc/rc.local:
```sh
if [ -f /boot/xinitrc ]; then
	ln -fs /boot/xinitrc /home/pi/.xinitrc;
	su - pi -c 'startx' &
fi
```
 * Create xinitrc file /boot/xinitrc
```sh
#!/bin/sh
while true; do

	# Clean up previously running apps, gracefully at first then harshly
	killall -TERM chromium 2>/dev/null;
	killall -TERM matchbox-window-manager 2>/dev/null;
	sleep 2;
	killall -9 chromium 2>/dev/null;
	killall -9 matchbox-window-manager 2>/dev/null;

	# Clean out existing profile information
	#rm -rf /home/pi/.cache;
	#rm -rf /home/pi/.config;
	#rm -rf /home/pi/.pki;

	# Generate the bare minimum to keep Chromium happy!
	#mkdir -p /home/pi/.config/chromium/Default
	#sqlite3 /home/pi/.config/chromium/Default/Web\ Data "CREATE TABLE meta(key LONGVARCHAR NOT NULL UNIQUE PRIMARY KEY, value LONGVARCHAR); INSERT INTO meta VALUES('version','46'); CREATE TABLE keywords (foo INTEGER);";

	# Disable DPMS / Screen blanking
	#xset -dpms  # disable DPMS (Energy Star) features.
	#xset s off  # don't activate screensaver

	# Reset the framebuffer's colour-depth
	#fbset -depth $( cat /sys/module/*fb*/parameters/fbdepth );

	# Hide the cursor (move it to the bottom-right, comment out if you want mouse interaction)
	#xwit -root -warp $( cat /sys/module/*fb*/parameters/fbwidth ) $( cat /sys/module/*fb*/parameters/fbheight )

	# Start the window manager (remove "-use_cursor no" if you actually want mouse interaction)
	#matchbox-window-manager -use_titlebar no -use_cursor no &
	matchbox-window-manager -use_titlebar no &

	# Start the browser (See http://peter.sh/experiments/chromium-command-line-switches/)
	chromium  --app=http://192.168.0.150:8080/openhab.app

done;
```
 * Reboot
```sh
sudo reboot
```

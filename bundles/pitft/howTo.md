# Installation PiTFT Display for control station


# Complete doc on adafruit
# https://learn.adafruit.com/adafruit-pitft-28-inch-resistive-touchscreen-display-raspberry-pi/overview

# Summary
# Step 1
- Download RASPBIAN Ready to go image with PiTFT ready
	https://learn.adafruit.com/adafruit-pitft-28-inch-resistive-touchscreen-display-raspberry-pi/easy-install
- Format SD Card with SDFormatter.exe
	https://www.sdcard.org/downloads/formatter_4/eula_windows/
- Write Raspbian with win32diskimager-v0.9-binary
	http://sourceforge.net/projects/win32diskimager/
- Boot raspberrypi and configure setting
	- Configure timezone, password, keyboard and internet	
	- ****** Use this command to startx using the hdmi display (Very more usefull for configure WIFI) ******
	FRAMEBUFFER=/dev/fb0 startx
	- Use normal startx command use PiTFT display
	startx
	
	sudo reboot
- Update raspberrypi
	sudo apt-get update
	sudo apt-get upgrade
	sudo reboot
	
# Step 2 (Auto run browser on startup)
#  Some resource :
# 	 http://blogs.wcode.org/2013/09/howto-boot-your-raspberry-pi-into-a-fullscreen-browser-kiosk/
#  	 (Not tested) http://www.raspberry-projects.com/pi/pi-operating-systems/raspbian/gui/auto-run-browser-on-startup

	sudo apt-get install matchbox chromium ttf-mscorefonts-installer xwit libnss3
	sudo reboot

	adding the following to /etc/rc.local:

	if [ -f /boot/xinitrc ]; then
		ln -fs /boot/xinitrc /home/pi/.xinitrc;
		su - pi -c 'startx' &
	fi


	créer et ajouter /boot/xinitrc
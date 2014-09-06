# Installation OWFS

# Step 1 Prepare
- Download RASPBIAN Debian Wheezy 
	http://www.raspberrypi.org/downloads/
- Format SD Card with SDFormatter.exe
	https://www.sdcard.org/downloads/formatter_4/eula_windows/
- Write Raspbian with win32diskimager-v0.9-binary
	http://sourceforge.net/projects/win32diskimager/
- Boot raspberrypi and configure setting
	timezone, password, keyboard and internet
- Update raspberrypi
	sudo apt-get update
	sudo apt-get upgrade
	sudo reboot
- Activation de l’I2C (http://innovelectronique.fr/2013/03/02/utilisation-du-bus-i2c-sur-raspberrypi/)
	# Replace 'blacklist i2c-bcm2708' with '#blacklist i2c-bcm2708' in /etc/modprobe.d/raspi-blacklist.conf 	
	sudo sed -i 's/blacklist i2c-bcm2708/#blacklist i2c-bcm2708/g' /etc/modprobe.d/raspi-blacklist.conf 	
	# Add 'i2c-dev' in /etc/modules 
	sudo sed -i '$ a\i2c-dev' /etc/modules 
	sudo reboot
	# Test i2c
	# dmesg | grep i2c
	# ls /dev/i2c*

# Step 2 Install OWFS (http://www.gaggl.com/2013/01/accessing-1-wire-devices-on-raspberry-pi-using-owfs/)
	sudo apt-get install owfs ow-shell
	# Change config
	# Remove fake device
	sudo sed -i 's/server: FAKE/#server: FAKE/g' /etc/owfs.conf 	
	# Add i2c device
	sudo sed -i '$ a\--i2c=ALL:ALL' /etc/owfs.conf	
	# Allow access from a remote device
	sudo sed -i 's/server: port = localhost:4304/server: port = 4304/g' /etc/owfs.conf 
	# Restart service
	sudo /etc/init.d/owserver restart
	sudo /etc/init.d/owhttpd restart
	sudo /etc/init.d/owftpd restart
	
# Step 3 Install nodejs (http://joshondesign.com/2013/10/23/noderpi)
	cd ~
	wget http://nodejs.org/dist/v0.10.28/node-v0.10.28-linux-arm-pi.tar.gz
	tar -xvzf node-v0.10.28-linux-arm-pi.tar.gz
	echo NODE_JS_HOME=/home/pi/node-v0.10.28-linux-arm-pi >> /home/pi/.bash_profile
	sudo sed -i '$ a\PATH=$PATH:$NODE_JS_HOME/bin' /home/pi/.bash_profile
	# reboot or logout login user for bash_profile reload
	sudo reboot
	# Test
	# node --version
	
# Step 4 Install small web app for led control usint http call from openhab
	# Copier le zip pascalhome_ledcontrol.zip dans /home/pi/pascalhome_ledcontrol.zip
	cd ~
	sudo /home/pi/pascalhome_ledcontrol.zip
	cd /home/pi/ledcontrol
	npm install
	sudo /home/pi/node-v0.10.28-linux-arm-pi/bin/node app.js	
	# Test led
	# http://192.168.0.194:3000/ledcontrol?status=ON
	# http://192.168.0.194:3000/ledcontrol?status=OFF
	





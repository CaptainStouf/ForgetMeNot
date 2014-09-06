# Installation OpenHab

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
- Make EnOceanPi Ready
	#Download and extract rpi-serial-console script
	sudo wget https://raw.github.com/lurch/rpi-serial-console/master/rpi-serial-console -O /usr/bin/rpi-serial-console && sudo chmod +x /usr/bin/rpi-serial-console  
	sudo rpi-serial-console disable 
	sudo reboot
- For gpio addon work ()
	sudo apt-get install libjna-java
	
# Step 2 Install OpenHab and my demo app
- Install openHAB Core
	sudo wget https://github.com/openhab/openhab/releases/download/v1.5.0/distribution-1.5.0-runtime.zip -O /home/pi/distribution-1.5.0-runtime.zip
	sudo mkdir /opt/openhab 
	cd /opt/openhab/ 
	sudo unzip /home/pi/distribution-1.5.0-runtime.zip
- Installing my demo openHab config
	# Transferer le zip pascalhome_openhab_proto1.zip dans /home/pi/pascalhome_openhab_proto1.zip
	sudo unzip /home/pi/pascalhome_openhab_proto1.zip
	
- Change openHAB start.sh
	# for encoean append -Dgnu.io.rxtx.SerialPorts=/dev/ttyAMA0  right after java
	sudo sed -i 's/java /java -Dgnu.io.rxtx.SerialPorts=\/dev\/ttyAMA0 /g' /opt/openhab/start.sh 		
	# for gpio addon "start.sh" and append -Djna.boot.library.path=/usr/lib/jni right after java
	sudo sed -i 's/java /java -Djna.boot.library.path=\/usr\/lib\/jni /g' /opt/openhab/start.sh 		
	
- Start openHAB
	sudo chmod +x start.sh  
	sudo ./start.sh  
	
	# Test openhab
	# http://192.168.0.192:8080/openhab.app?sitemap=demo
	
	#Troubleshooting with gpio after restart openhab
	#If the message Device or resource busy is printed unexport your gpio with next command
	echo 21 > /sys/class/gpio/unexport
	echo 20 > /sys/class/gpio/unexport
	#https://sites.google.com/site/semilleroadt/raspberry-pi-tutorials/gpio
	
- Setup auto start
	
	#Transfert the openhab.sh script into /opt/openhab/openhab.sh or directly in /etc/init.d/openhab.sh
	sudo cp /opt/openhab/openhab.sh /etc/init.d
	#sudo rm /etc/init.d/openhab.sh

	# Make sure the script is executable (chmod again). 
	sudo chmod 777 /etc/init.d/openhab.sh

	#At this point you should be able to start/stop/restart using the command 
	#   sudo /etc/init.d/openhab.sh start
	#check its status with the status argument
	#   /etc/init.d/openhab.sh status 
	#and stop it with 
	#   sudo /etc/init.d/openhab.sh stop
	#and restart it with 
	#   sudo /etc/init.d/openhab.sh restart

	# To make the Raspberry Pi use your init script at the right time, one more step is required: running the command 
	sudo update-rc.d openhab.sh defaults
	#sudo update-rc.d -f openhab.sh remove

	# This command adds in symbolic links to the /etc/rc.x directories so that the init script is run at the default times. you can see these links if you do 
	# ls -l /etc/rc?.d/*openhab.sh
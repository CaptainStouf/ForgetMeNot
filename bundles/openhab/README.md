# OpenHab 

This bundle containt doc and source for the Pi with OpenHab and EnOcean Pi device plug on it

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
sudo sed -i 's/raspberrypi/RPi-EnOceanPi/g' /etc/hosts
sudo sed -i 's/raspberrypi/RPi-EnOceanPi/g' /etc/hostname
sudo /etc/init.d/hostname.sh
sudo reboot
```

### Step 4

Make EnOceanPi Ready
```sh
#Download and extract rpi-serial-console script
sudo wget https://raw.github.com/lurch/rpi-serial-console/master/rpi-serial-console -O /usr/bin/rpi-serial-console && sudo chmod +x /usr/bin/rpi-serial-console  
sudo rpi-serial-console disable 
sudo reboot
```

### Step 5

Install OpenHab and my demo app

Install openHAB Core
```sh
sudo wget https://github.com/openhab/openhab/releases/download/v1.5.1/distribution-1.5.1-runtime.zip -O /home/pi/distribution-1.5.1-runtime.zip
sudo mkdir /opt/openhab 
cd /opt/openhab/ 
sudo unzip /home/pi/distribution-1.5.1-runtime.zip
```

Installing my demo openHab config
Transferer le zip pascalhome_openhab_proto1.zip dans /home/pi/pascalhome_openhab_proto1.zip
```sh
sudo unzip /home/pi/pascalhome_openhab_proto1.zip
```

Change openHAB start.sh
```sh
# for encoean append -Dgnu.io.rxtx.SerialPorts=/dev/ttyAMA0  right after java
sudo sed -i 's/java /java -Dgnu.io.rxtx.SerialPorts=\/dev\/ttyAMA0 /g' /opt/openhab/start.sh 		
```
	
Start openHAB
```sh
sudo chmod +x start.sh  
sudo ./start.sh  
```

Test openhab http://192.168.0.150:8080/openhab.app
	
	
### Step 5

Setup auto start
	
```sh
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
```

### Step 6

Install persistence database PostgreSQL 9.1
 * http://c-mobberley.com/wordpress/2013/10/18/raspberry-pi-installation-of-postgresql-its-simple/
 * http://www.rpimicrocomputing.com/2/post/2012/10/postgresql-on-raspberry-pi.html

```sh
sudo apt-get install postgresql

#Once installed, create the password (Element14) for the postgresql user  (Press CTRL-D to exit)
sudo -u postgres psql postgres
\password postgres

sudo sed -i '$ a\host    all        all             192.168.0.0/24         md5' /etc/postgresql/9.1/main/pg_hba.conf
sudo sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" /etc/postgresql/9.1/main/postgresql.conf
sudo /etc/init.d/postgresql start

#sudo /etc/init.d/postgresql start
#/etc/init.d/postgresql status
#sudo /etc/init.d/postgresql stop
#sudo /etc/init.d/postgresql restart

# PostSQL prompt (Press CTRL-D to exit)
#	sudo -u postgres psql postgres
# Create database
#	sudo -u postgres createdb openhab
```

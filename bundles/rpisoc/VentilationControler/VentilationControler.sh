#!/bin/sh  
### BEGIN INIT INFO  
# Provides:          VentilationControler  
# Required-Start:    $remote_fs $syslog  
# Required-Stop:     $remote_fs $syslog  
# Default-Start:     2 3 4 5  
# Default-Stop:      0 1 6  
# Short-Description: Ventilation Controler Daemon  
# Description: Pi with RPiSoC node Ventilation controler 
### END INIT INFO  

# This next line determines what user the script runs as.
# Root generally not recommended but necessary if you are using the Raspberry Pi GPIO from Python.
#USER=root
DAEMON_USER=root
DAEMON_NAME=VentilationControler

ROOT_DIR=/home/pi/VentilationControler
SERVER=$ROOT_DIR/main.js
LOG_FILE=$ROOT_DIR/main.js.log

DAEMON="/home/pi/node-v0.10.28-linux-arm-pi/bin/node $SERVER"

PIDFILE=/var/run/$DAEMON_NAME.pid

. /lib/lsb/init-functions
 
do_start() {        
	log_daemon_msg "Starting system $DAEMON_NAME daemon"
	start-stop-daemon --start --background --pidfile $PIDFILE --make-pidfile --user $DAEMON_USER --chuid $DAEMON_USER --startas $DAEMON    
	log_end_msg $?
}
do_stop() {
	log_daemon_msg "Stopping system $DAEMON_NAME daemon"
	start-stop-daemon --stop --pidfile $PIDFILE --retry 10
	log_end_msg $?
}
 
case "$1" in
 
    start|stop)
        do_${1}
        ;;
 
    restart|reload|force-reload)
        do_stop
        do_start
        ;;
 
    status)
        status_of_proc "$DAEMON_NAME" "$DAEMON" && exit 0 || exit $?
        ;;
    *)
        echo "Usage: /etc/init.d/$DAEMON_NAME {start|stop|restart|status}"
        exit 1
        ;;
 
esac
exit 0
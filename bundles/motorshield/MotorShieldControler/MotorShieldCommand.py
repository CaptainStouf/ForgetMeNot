#!/usr/bin/python

import sys
sys.path.append('/home/pi/Adafruit-Raspberry-Pi-Python-Code/Adafruit_MotorShield')

from Adafruit_MotorShield import Adafruit_MotorShield
from Adafruit_StepperMotor import Adafruit_StepperMotor
import time

STEP_MODE = {'SINGLE': Adafruit_StepperMotor.SINGLE, 'DOUBLE': Adafruit_StepperMotor.DOUBLE, 'INTERLEAVE': Adafruit_StepperMotor.INTERLEAVE, 'MICROSTEP': Adafruit_StepperMotor.MICROSTEP}
STEP_DIRECTION = {'FORWARD': Adafruit_StepperMotor.FORWARD, 'BACKWARD': Adafruit_StepperMotor.BACKWARD}

if (len(sys.argv) != 7):
	print 'Invalide command missing param'
	exit(1)

	
shieldID = int(sys.argv[1], 16)
motorID = int(sys.argv[2])
stepMode = sys.argv[3]
direction = sys.argv[4]
speed = int(sys.argv[5])
step = int(sys.argv[6])

# Create the motor shield object with the I2C address
AFMS = Adafruit_MotorShield(shieldID)

# Connect a stepper motor with 200 steps per revolution (1.8 degree)
# to motor port #2 (M3 and M4)
myMotor = AFMS.getStepper(200, motorID)

AFMS.begin() # create with the default frequency 1.6KHz
#AFMS.begin(1000);  // OR with a different frequency, say 1KHz

myMotor.setSpeed(speed);  # 10 rpm

try:
	myMotor.step(step, STEP_DIRECTION[direction], STEP_MODE[stepMode])
	myMotor.release()
	print "OK"
except KeyboardInterrupt:
	myMotor.release()
	print "Clean "
except:
	print "Unexpected error:", sys.exc_info()[0]

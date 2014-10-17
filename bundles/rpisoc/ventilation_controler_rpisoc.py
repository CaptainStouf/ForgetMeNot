# Import lib
import signal
import sys
import time
from rpisoc import *

# Constante
STATUS_LEVEL = [0,4,6,10]

# Init + varible declare
RPiSoC('SPI')  

My_DELSIG  = ADC('DELSIG')

led1 = DigitalOutput (12,4)
led2 = DigitalOutput (12,5)
led3 = DigitalOutput (12,6)

switch = DigitalOutput (12,7)

# Function to read voltage from pin P15[5]
def readVolts():
	My_DELSIG.Start()
	ADC_counts = My_DELSIG.Read()
	voltage = My_DELSIG.CountsTo_Volts(ADC_counts)
	My_DELSIG.Stop()
	return voltage

def applyVoltageDividers(voltage):
	R1 = 10000.0 # 10k
	R2 = 4700.0  # 4.7k
	return voltage / (R2/(R1+R2));

def getRunLevel(voltage):
	#STATUS_LEVEL
	result = 0
	distance = voltage
	for i in range(1, 4):
		tmpDistance = abs(voltage - STATUS_LEVEL[i])
		if (tmpDistance < distance):
			result = i
			distance = tmpDistance	
	return result
	
def openLedToTheLevel(level):
	# Force reset status to off
	led1.Write(0);
	led2.Write(0);
	led3.Write(0);
	led1.Write(1);
	led2.Write(1);
	led3.Write(1);
	led1.Write(0);
	led2.Write(0);
	led3.Write(0);
	if (level >= 1):
		led1.Write(1)
	if (level >= 2):
		led2.Write(1)
	if (level >= 3):
		led3.Write(1)

def updateGetStatus():
	voltage = readVolts()
	voltage = applyVoltageDividers(voltage)
	level = getRunLevel(voltage)
	openLedToTheLevel(level)
	return level
	
def transitorActivate():
	switch.Write(0)
	switch.Write(1)
	time.sleep(0.2)
	switch.Write(0)	
	return updateGetStatus()
		

try:
		
	if (len(sys.argv) == 1 or sys.argv[1] == "status" ):
		level = updateGetStatus()
		print level
	elif (sys.argv[1] == "switch"):
		if (len(sys.argv) == 2):
			level = transitorActivate()
			print level
		else:
			target = int(sys.argv[2])
			if (target < 0 or target > 3):
				print 'Invalide switch level 0-3 only'
				exit(1)
				
			current = updateGetStatus()
			while (current != target):
				current = transitorActivate()				
				if (current != target):
					time.sleep(0.2)			
			print current
	else:
		print 'Invalide command only [status|switch|btn] are valide'

except KeyboardInterrupt:
	#Restore GPIO to default state
	print ("KeyboardInterrupt close detected")
except:
	print "Unexpected error:", sys.exc_info()[0]
	
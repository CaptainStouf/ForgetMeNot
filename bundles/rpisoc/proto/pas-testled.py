import time
from rpisoc import *  

RPiSoC('SPI')
led = DigitalOutput(12,7)
led.Write(1)
time.sleep(100)
led.Write(0)
time.sleep(100)
led.Write(1)
time.sleep(100)
led.Write(0)
time.sleep(100)
led.Write(1)
time.sleep(100)
led.Write(0)
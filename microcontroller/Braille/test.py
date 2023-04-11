import serial
import random


ser = serial.Serial()
ser.baudrate = 115200
ser.port = 'COM7'

code_table = {
    'a': 0b100000,
    'b': 0b110000,
    'c': 0b100100,
    'd': 0b100110,
    'e': 0b100010,
    'f': 0b110100,
    'g': 0b110110,
    'h': 0b110010,
    'i': 0b010100,
    'j': 0b010110,
    'k': 0b101000,
    'l': 0b111000,
    'm': 0b101100,
    'n': 0b101110,
    'o': 0b101010,
    'p': 0b111100,
    'q': 0b111110,
    'r': 0b111010,
    's': 0b011100,
    't': 0b011110,
    'u': 0b101001,
    'v': 0b111001,
    'w': 0b010111,
    'x': 0b101101,
    'y': 0b101111,
    'z': 0b101011,
    '#': 0b001111,
    '1': 0b100000,
    '2': 0b110000,
    '3': 0b100100,
    '4': 0b100110,
    '5': 0b100010,
    '6': 0b110100,
    '7': 0b110110,
    '8': 0b110010,
    '9': 0b010100,
    '0': 0b010110,
    ' ': 0b000000}

while True:
    # Take binary input from user and convert it to integer
    ch = input("Enter a character or binary number: ")

    ser.open()

    if len(ch) == 6:
        ch = int(ch, 2)
        print(ch)
        ser.write(str(ch).encode('utf-8'))

    elif len(ch) == 0:
        ch = random.choice(list(code_table.keys()))
        print(str(code_table[ch]))
        ser.write(str(code_table[ch]).encode('utf-8'))

    else:
        ch = ch.lower()[0]
        print(str(code_table[ch]))
        ser.write(str(code_table[ch]).encode('utf-8'))
    
    ser.close()
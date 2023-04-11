# Nail Braille

## A novel approach to braille education

### About

Nail Braille is an innovative project aimed at revolutionizing the way people learn and interact with Braille. This project uses affordable components and 3D-printed parts to create a unique and effective learning tool.

### Requirements

#### Hardware

- 2 Breadboards
- 1 ESP32 Dev board
- 2 Buttons
- 1 Relay
- 2 28BYJ-48 Stepper motors and their controllers (ULN2003)
- Male to male jumper wires
- Male to female jumper wires
- 12v DC power supply
- DC female plug
- USB-A to micro-USB cable

#### Software

- Node.js
- npm

### Setup

1. 3D print the Braille disks and base found in the `/models` directory.
2. Wire the components according to the diagram (image path to be added later).
3. Place the disks on the motors and the motors in the base.
4. Connect the motors to their respective motor controllers.

### Installation

```bash
# Clone the repository
git clone <repo-url>
```

In different terminal instances:

```bash
# Install and run the client
cd Nail-Braille/client
npm install
npm run dev
```

```bash
# Install and run the server
cd Nail-Braille/server
npm install
npm start
```

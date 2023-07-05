// Include the AccelStepper Library
#include <AccelStepper.h>

// Define step constant
#define MotorInterfaceType 4
#define ResetButton 32
// #define Relay 15
#define STEPS 2048
#define INVERT true
#define SafetyButton 34
#define SafetyLight 26

// Creates an instance
// Pins entered in sequence IN1-IN3-IN2-IN4 for proper step sequence
// RIGHT MOTOR
AccelStepper myStepper1(MotorInterfaceType, 23, 21, 22, 19);  //

// LEFT MOTOR
AccelStepper myStepper2(MotorInterfaceType, 18, 16, 17, 4);

bool isMotorRunning = false;
bool isResetPressed = false;
bool isSafetyPressed = false;

int braille = 0b111111;
int rightTargetPosition = 0;
int leftTargetPosition = 0;

int* fromBits(unsigned int n) {
    // Split 6 bit number into 2 3 bit numbers
    static int bits[2];
    int mask = 0b111;
    bits[0] = n & mask;
    bits[1] = (n >> 3) & mask;

    if (INVERT) {
        bits[0] = 8 - bits[0];
        bits[1] = 8 - bits[1];
    }

    return bits;
}

int closestPosition(int currentPosition, int targetPosition) {
    // Target position will always be between -STEPS and STEPS
    // Return the target position that is closest to the current position
    // The new target position should be within 1/2 STEPS of the current
    // position
    int newTargetPosition = targetPosition;
    if (currentPosition > targetPosition) {
        if (currentPosition - targetPosition > STEPS / 2) {
            newTargetPosition = targetPosition + STEPS;
        }
    } else if (targetPosition - currentPosition > STEPS / 2) {
        newTargetPosition = targetPosition - STEPS;
    }

    return newTargetPosition;
}

void setupStepper(AccelStepper& stepper) {
    // set the maximum speed, acceleration factor,
    // initial speed and the target position
    stepper.setMaxSpeed(500.0);
    stepper.setAcceleration(1000.0);
    stepper.setSpeed(0);
}

void handleInput() {
    if (Serial.available()) {
        int inByte = Serial.parseInt();
        Serial.print(inByte, DEC);
        rightTargetPosition = closestPosition(myStepper1.currentPosition(),
                                              fromBits(inByte)[0] * -STEPS / 8);
        leftTargetPosition = closestPosition(myStepper2.currentPosition(),
                                             fromBits(inByte)[1] * STEPS / 8);

        // If there is no motion needed, send S to serial
        if (myStepper1.currentPosition() == rightTargetPosition &&
            myStepper2.currentPosition() == leftTargetPosition) {
            Serial.println("S");
        }
    }
}

void handleResetButton() {
    // Serial.println(digitalRead(ResetButton));
    // Detect rising edge of button press
    if (digitalRead(ResetButton) == HIGH && !isResetPressed) {
        isResetPressed = true;
        myStepper1.setCurrentPosition(0);
        myStepper2.setCurrentPosition(0);
        rightTargetPosition = 0;
        leftTargetPosition = 0;
        Serial.println("R");
    }

    // Detect falling edge of button press
    if (digitalRead(ResetButton) == LOW && isResetPressed) {
        isResetPressed = false;
    }
}

void handleSafetyButton() {
    if (digitalRead(SafetyButton) == HIGH) {
        isSafetyPressed = true;
        myStepper1.setCurrentPosition(0);
        myStepper2.setCurrentPosition(0);
        rightTargetPosition = 0;
        leftTargetPosition = 0;
        Serial.println("S");

        digitalWrite(SafetyLight, HIGH);
    }
}

void setTargetPosition(AccelStepper& stepper, int targetPosition) {
    if (stepper.distanceToGo() == 0 ||
        targetPosition != stepper.currentPosition()) {
        stepper.moveTo(targetPosition);
    }
}

void setup() {
    setupStepper(myStepper1);
    setupStepper(myStepper2);

    pinMode(ResetButton, INPUT);
    // pinMode(Relay, OUTPUT);
    pinMode(SafetyButton, INPUT);
    pinMode(SafetyLight, OUTPUT);

    Serial.begin(115200);
}

void loop() {
    handleInput();

    handleResetButton();
    // handleSafetyButton();

    setTargetPosition(myStepper1, rightTargetPosition);
    setTargetPosition(myStepper2, leftTargetPosition);

    // If both motors are at target position, stop motors, turn off relay, else
    // if motors are not at target position, turn on relay
    if (myStepper1.distanceToGo() == 0 && myStepper2.distanceToGo() == 0) {
        if (isMotorRunning) {
            Serial.println("S");
        }
        isMotorRunning = false;
        // digitalWrite(Relay, isMotorRunning);

        myStepper1.disableOutputs();
        myStepper2.disableOutputs();

    } else if (myStepper1.currentPosition() != rightTargetPosition ||
               myStepper2.currentPosition() != leftTargetPosition) {
        isMotorRunning = true;

        if (isSafetyPressed) {
            isMotorRunning = false;

            myStepper1.disableOutputs();
            myStepper2.disableOutputs();
        } else {
            myStepper1.enableOutputs();
            myStepper2.enableOutputs();
        }
    }

    if (isMotorRunning && !isSafetyPressed) {  // Move the motor one step
        myStepper1.run();
        myStepper2.run();
    }
}

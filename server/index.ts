const { SerialPort } = require("serialport");

const port = new SerialPort({
  path: "COM7",
  baudRate: 115200,
});

const letterToBrailleMap: any = {
  a: 0b100000,
  b: 0b110000,
  c: 0b100100,
  d: 0b100110,
  e: 0b100010,
  f: 0b110100,
  g: 0b110110,
  h: 0b110010,
  i: 0b010100,
  j: 0b010110,
  k: 0b101000,
  l: 0b111000,
  m: 0b101100,
  n: 0b101110,
  o: 0b101010,
  p: 0b111100,
  q: 0b111110,
  r: 0b111010,
  s: 0b011100,
  t: 0b011110,
  u: 0b101001,
  v: 0b111001,
  w: 0b010111,
  x: 0b101101,
  y: 0b101111,
  z: 0b101011,
  "#": 0b001111,
  "1": 0b100000,
  "2": 0b110000,
  "3": 0b100100,
  "4": 0b100110,
  "5": 0b100010,
  "6": 0b110100,
  "7": 0b110110,
  "8": 0b110010,
  "9": 0b010100,
  "0": 0b010110,
  " ": 0b000000,
};

// Make express server with cors

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const serverPort = 3000;

let currentInterval: any = null;

let currentPosition = 0;
let moving = false;
let stopCallback: any = null;

function setPosition(position: number) {
  currentPosition = position;

  moving = true;

  port.write(position.toString(), (err: any) => {
    if (err) {
      return console.log("Error on write: ", err.message);
    }
  });
}

port.on("data", (data: any) => {
  const stringData: string = data.toString().trim();

  if (stringData.includes("S")) {
    moving = false;
    console.log("STOPPED");

    if (stopCallback) {
      stopCallback();
    }
  }

  if (stringData.includes("R")) {
    currentPosition = 0;
    moving = false;
    console.log("RESET");
  }
});

app.use(
  cors({
    origin: "http://127.0.0.1:5173",
    credentials: true,
  })
);

app.use(bodyParser.json());

app.get("/", (req: any, res: any) => {
  res.send("Hello World!");
});

app.post("/api/set-position", (req: any, res: any) => {
  // Write the number provided in the request body to the serial port
  console.log(req.body);

  setPosition(req.body.position);

  stopCallback = () => {
    res.send("Position set");
  };
});

app.post("/api/set-bin-position", (req: any, res: any) => {
  // Write the binary number provided in the request body to the serial port
  console.log(req.body);

  // Parse string into number, the string contains a binary number
  const bin = parseInt(req.body.position, 2);

  setPosition(bin);

  stopCallback = () => {
    res.send("Position set");
  };
});

app.post("/api/set-letter", (req: any, res: any) => {
  // Write the binary number provided in the request body to the serial port
  console.log(req.body);

  // Parse string into number, the string contains a binary number
  const bin = letterToBrailleMap[req.body.position[0]];

  setPosition(bin);

  stopCallback = () => {
    res.send("Position set");
  };
});

app.post("/api/set-word", (req: any, res: any) => {
  // Write each letter in the word to the serial port, wait req.body.speed ms between each letter
  console.log(req.body);

  const word = req.body.word;
  const speed = req.body.speed;

  if (currentInterval) {
    clearInterval(currentInterval);
  }

  let i = 0;
  currentInterval = setInterval(() => {
    if (i >= word.length) {
      clearInterval(currentInterval);

      return;
    }

    const bin = letterToBrailleMap[word[i]];

    port.write(bin.toString(), (err: any) => {
      if (err) {
        return console.log("Error on write: ", err.message);
      }
    });

    i++;
  }, speed);

  res.send("Word set");
});

app.get("/api/current-position", (req: any, res: any) => {
  res.send({
    position: currentPosition,
  });
});

app.listen(serverPort, () => {
  console.log(`Server listening at http://127.0.0.1:${serverPort}`);
});

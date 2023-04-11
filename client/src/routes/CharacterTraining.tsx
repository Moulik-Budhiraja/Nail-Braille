import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Input from "react-bootstrap/FormControl";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useState, useEffect } from "react";
import { homophones } from "../data/homophones";
import { LetterSkillMap, LetterSkill } from "../components/LetterSkillMap";

const alphabet = "abcdefghijklmnopqrstuvwxyz";

let letters = "abcdef";
let remaining = [
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];
let currentLetter = " ";
let attempts = 0;

let letterSkill: LetterSkill = {};

if (localStorage.getItem("letterSkill") === null) {
  for (let i = 0; i < letters.length; i++) {
    letterSkill[letters[i]] = 0.5;
  }
} else {
  letterSkill = JSON.parse(localStorage.getItem("letterSkill")!);
}

export function CharacterTraining() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [transcriptHistory, setTranscriptHistory] = useState("");

  const msg = new SpeechSynthesisUtterance();

  const pickLetter = () => {
    // if all letters have skill >= 0.6 then add a new letter
    let allLetters = true;
    for (let i = 0; i < letters.length; i++) {
      if (letterSkill[letters[i]] < 0.6) {
        allLetters = false;
        break;
      }
    }

    if (allLetters) {
      letters += remaining[0];
      remaining = remaining.slice(1);

      letterSkill[letters[letters.length - 1]] = 0.5;
      // Update letterSkill in localStorage
      localStorage.setItem("letterSkill", JSON.stringify(letterSkill));
    }

    // Set current letter randomly but weighted by letterSkill values
    let total = 0;
    for (let i = 0; i < letters.length; i++) {
      if (letters[i] === currentLetter) continue;

      total += Math.abs(0.9 - letterSkill[letters[i]]);
    }

    let rand = Math.random() * total;
    for (let i = 0; i < letters.length; i++) {
      if (letters[i] === currentLetter) continue;

      rand -= Math.abs(0.9 - letterSkill[letters[i]]);
      if (rand <= 0) {
        currentLetter = letters[i];
        break;
      }
    }
  };

  const sendLetter = () => {
    fetch("http://127.0.0.1:3000/api/set-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: currentLetter,
      }),
    });
  };

  const checkLetter = (transcript: string) => {
    attempts++;
    if (
      transcript.trim().toLowerCase() === currentLetter ||
      homophones[transcript.trim().toLowerCase()] === currentLetter
    ) {
      if (attempts <= 2) {
        letterSkill[currentLetter] += 0.05 / attempts;
      } else {
        letterSkill[currentLetter] -= 0.05 / (1 / attempts);
      }

      attempts = 0;

      pickLetter();
      sendLetter();
    } else if (attempts < 2) {
      msg.text = `Incorrect`;
      window.speechSynthesis.speak(msg);
    }

    if (attempts >= 2) {
      letterSkill[currentLetter] -= 0.05 / (1 / attempts);
      attempts = 0;

      msg.text = `The letter was ${currentLetter}`;
      window.speechSynthesis.speak(msg);

      pickLetter();
      sendLetter();
    }

    localStorage.setItem("letterSkill", JSON.stringify(letterSkill));

    setTranscriptHistory((prev) => prev + transcript + " ");
    resetTranscript();

    // reduce all letter skill to 1 if letter skill is > 1
    for (let i = 0; i < letters.length; i++) {
      if (letterSkill[letters[i]] > 1) {
        letterSkill[letters[i]] = 1;
      }
    }
  };

  const manualInput = () => {
    const input = document.getElementById("man-input") as HTMLInputElement;
    input.value = input.value.toLowerCase();

    checkLetter(input.value);
    input.value = "";
  };

  useEffect(() => {
    if (transcript.length > 0) {
      checkLetter(transcript);
    }
  }, [transcript]);

  return (
    <div className="content">
      <h1>Character Recognition</h1>
      <p
        style={{
          width: "clamp(20rem, 30vw, 30rem)",
        }}
      >
        Read out the character presented on the braille display. Once the
        correct character has been heard, a new character will be presented.
      </p>
      {!listening ? (
        <Button
          variant="success"
          onClick={() => {
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-US",
            });
            pickLetter();
            sendLetter();
          }}
        >
          Start Training
        </Button>
      ) : (
        <Button
          variant="danger"
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Stop Training
        </Button>
      )}

      {listening && (
        <Button
          variant="danger"
          onClick={() => {
            SpeechRecognition.stopListening();
          }}
        >
          Disable Mic
        </Button>
      )}

      <div>
        <h4
          style={{
            textAlign: "center",
          }}
        >
          Manual Input
        </h4>
        <ButtonGroup>
          <Input id="man-input" type="text"></Input>
          <Button variant="primary" onClick={manualInput}>
            Submit
          </Button>
        </ButtonGroup>
      </div>

      <div className="skill-chart">
        <LetterSkillMap letterSkill={letterSkill} />
      </div>
    </div>
  );
}

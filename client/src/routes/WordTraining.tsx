import { useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { words } from "../data/words";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

export function WordTraining() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [currentWord, setCurrentWord] = useState(" ");
  const [speed, setSpeed] = useState(3000);

  const [transcriptHistory, setTranscriptHistory] = useState("");

  const pickWord = () => {
    // Set current word randomly
    setCurrentWord(words[Math.floor(Math.random() * words.length)]);
  };

  return (
    <div className="content">
      <h1>Word Training</h1>
      <p>Current word: {currentWord}</p>
      <Button onClick={pickWord}>Pick word</Button>
    </div>
  );
}

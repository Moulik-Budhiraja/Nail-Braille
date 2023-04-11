import { useState, useEffect } from "react";

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

export function CharacterIntroduction() {
  const msg = new SpeechSynthesisUtterance();

  const readout = (letterPos: number) => {
    fetch("http://127.0.0.1:3000/api/set-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: letters[letterPos],
      }),
    }).then(() => {
      msg.text = `This is ${letters[letterPos]}`;
      window.speechSynthesis.speak(msg);

      if (letterPos < letters.length - 1) {
        setTimeout(() => {
          readout(letterPos + 1);
        }, 2500);
      } else {
        (document.getElementById("readout-btn") as any).disabled = false;
      }
    });
  };
  return (
    <div className="content">
      <h1>Character Introduction</h1>
      <p>
        You will be presented with the letters from A to Z and they will be read
        out to you.
      </p>

      <button
        id="readout-btn"
        className="btn btn-success"
        disabled={false}
        onClick={() => {
          (document.getElementById("readout-btn") as any).disabled = true;
          readout(0);
        }}
      >
        Start Readout
      </button>
    </div>
  );
}

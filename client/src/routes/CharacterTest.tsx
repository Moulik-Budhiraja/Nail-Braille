import { useEffect, useState } from "react";

let characters = "abcdefghijklmnopqrstuvwxyz";
let characterCorrect = {} as any;
let position = 0;

for (let i = 0; i < characters.length; i++) {
  characterCorrect[characters[i]] = null;
}

export function CharacterTest() {
  const [character, setCharacter] = useState("None");

  const scrambleCharacters = () => {
    let shuffledCharacters = characters
      .split("")
      .sort(() => 0.5 - Math.random());
    characters = shuffledCharacters.join("");
  };

  const evaluateCharacter = (pos: number) => {
    if (pos === 0) {
      scrambleCharacters();
      (document.getElementById("start-test-btn") as any).disabled = true;
      console.log(characters);
    }

    setCharacter(characters[pos]);

    fetch("http://127.0.0.1:3000/api/set-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: characters[pos],
      }),
    }).then(() => {
      document.querySelectorAll(".marking-btn").forEach((btn: any) => {
        btn.disabled = false;
      });

      if (pos > characters.length - 1) {
        (document.getElementById("start-test-btn") as any).disabled = false;
      }
    });
  };

  const markCharacter = (correct: boolean) => {
    characterCorrect[characters[position]] = correct;
    console.log(characterCorrect);

    document.querySelectorAll(".marking-btn").forEach((btn: any) => {
      btn.disabled = true;
    });

    position += 1;

    if (position > characters.length - 1) {
      (document.getElementById("start-test-btn") as any).disabled = false;
      setCharacter("None");
      console.log("Finished");
      console.log(characterCorrect);
      console.log(localStorage.getItem("letterSkill"));
    } else {
      console.log(characters[position]);

      evaluateCharacter(position);
    }
  };

  const getCorrect = () => {
    let correct = 0;
    for (let i = 0; i < characters.length; i++) {
      if (characterCorrect[characters[i]]) {
        correct += 1;
      }
    }

    return correct;
  };

  const markCorrect = () => {
    console.log("Correct");
    markCharacter(true);
  };

  const markIncorrect = () => {
    console.log("Incorrect");
    markCharacter(false);
  };

  useEffect(() => {
    document
      .querySelector(".btn-success.marking-btn")
      ?.removeEventListener("click", markCorrect);

    document
      .querySelector(".btn-danger.marking-btn")
      ?.removeEventListener("click", markIncorrect);

    document
      .querySelector(".btn-success.marking-btn")
      ?.addEventListener("click", markCorrect);

    document
      .querySelector(".btn-danger.marking-btn")
      ?.addEventListener("click", markIncorrect);
  }, []);

  return (
    <div className="content">
      <h1>Character Test</h1>
      <p>This is the character testing mode.</p>

      <p>Current Letter: {character}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <button className="btn btn-danger marking-btn" disabled={true}>
          Incorrect
        </button>
        <button className="btn btn-success marking-btn" disabled={true}>
          Correct
        </button>
      </div>

      <button
        id="start-test-btn"
        className="btn btn-primary"
        onClick={() => {
          evaluateCharacter(0);
        }}
      >
        Start Evaluation
      </button>

      <p>
        Correct: {getCorrect()} / {position}
      </p>
    </div>
  );
}

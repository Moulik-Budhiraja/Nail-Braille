import "./styles/Home.css";
import { useEffect } from "react";

export function Home() {
  useEffect(() => {
    fetch("http://127.0.0.1:3000/api/set-letter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: " ",
      }),
    });
  }, []);

  return (
    <div className="content">
      <h1>Choose a training mode:</h1>
      <ul>
        <a href="/character-introduction">
          <li>Character Introduction</li>
        </a>
        <a href="/character-training">
          <li>Character Training</li>
        </a>
        {/* <a href="/word-training">
          <li>Word Training</li>
        </a>
        <a href="/speech-to-braille">
          <li>Speech to Braille</li>
        </a> */}
        <a href="/set-position">
          <li>Set Position</li>
        </a>
      </ul>
      <p
        style={{
          maxWidth: "30rem",
          textAlign: "center",
        }}
      >
        It is recommended to use tab and enter to navigate the page. If you are
        a new user it is recommended that you start with the character
        introduction.
      </p>
    </div>
  );
}

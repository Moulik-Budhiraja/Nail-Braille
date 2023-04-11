import { useState, useEffect } from "react";
import { Home } from "./routes/Home";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import { CharacterTraining } from "./routes/CharacterTraining";
import { WordTraining } from "./routes/WordTraining";
import { SetPosition } from "./routes/SetPosition";
import { CharacterIntroduction } from "./routes/CharacterIntroduction";
import { CharacterTest } from "./routes/CharacterTest";

function App() {
  useEffect(() => {
    document.title = "Nail Braille Web Interface";
  });

  return (
    <div className="App">
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
        integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
        crossOrigin="anonymous"
      />
      <nav>
        <a href="/">
          <h2>Nail Braille</h2>
        </a>
        {/* <ul>
          <a href="/character-training">
            <li>Character Training</li>
          </a>
          <a href="/word-training">
            <li>Word Training</li>
          </a>
          <a href="speech-to-braille">
            <li>Speech to Braille</li>
          </a>
        </ul> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/character-introduction"
          element={<CharacterIntroduction />}
        />
        <Route path="/character-training" element={<CharacterTraining />} />
        <Route path="/word-training" element={<WordTraining />} />
        <Route path="/set-position" element={<SetPosition />} />
        <Route path="/character-test" element={<CharacterTest />}></Route>
      </Routes>
    </div>
  );
}

export default App;

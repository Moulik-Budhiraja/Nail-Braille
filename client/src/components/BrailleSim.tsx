import { useEffect, useState } from "react";

export function BrailleSim() {
  const [lastPosition, setLastPosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [moving, setMoving] = useState(false);

  const fetchPosition = () => {
    fetch("http://127.0.0.1:3000/api/current-position")
      .then((res) => res.json())
      .then((data) => {
        setPosition(data.position);
        setLastPosition(data.position);
      });
  };

  const setPos = (pos: number) => {
    // log position in binary
    console.log(position.toString(2).padStart(6, "0"));

    // log pos in binary
    console.log(pos.toString(2).padStart(6, "0"));

    // log position ^ pos in binary
    console.log((position ^ pos).toString(2).padStart(6, "0"));

    setPosition(position ^ pos);

    setMoving(true);
    fetch("http://127.0.0.1:3000/api/set-position", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        position: position ^ pos,
      }),
    }).then(() => {
      fetchPosition();
      setMoving(false);
    });
  };

  useEffect(() => {
    fetchPosition();
  });

  return (
    <>
      <div
        className="pins"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gridTemplateRows: "repeat(3, 1fr)",
          gridGap: "10px",
        }}
      >
        {[32, 4, 16, 2, 8, 1].map((i) => {
          return (
            <div
              className="pin"
              style={{
                backgroundColor: position & i ? "black" : "grey",
                width: "50px",
                height: "50px",
              }}
              onClick={() => setPos(i)}
            ></div>
          );
        })}
      </div>
      {moving && <p>Setting Position...</p>}
    </>
  );
}

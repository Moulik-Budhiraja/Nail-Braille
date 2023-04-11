export interface LetterSkill {
  [key: string]: number;
}

export function LetterSkillMap(props: { letterSkill: LetterSkill }) {
  return (
    <div>
      <h3>Skill</h3>
      <ol
        style={{
          listStyleType: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {Object.keys(props.letterSkill).map((letter) => (
          <li key={letter}>
            {/* Div for each letter with bar showing skill */}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "20px",
                  textAlign: "right",
                  marginRight: "10px",
                }}
              >
                {letter}
              </div>
              <div
                style={{
                  width: "100px",
                  height: "20px",
                  backgroundColor: "lightgray",
                  borderRadius: "5px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${props.letterSkill[letter] * 100}%`,
                    height: "100%",
                    backgroundColor: `rgb(${
                      255 * (1 - props.letterSkill[letter])
                    }, ${255 * props.letterSkill[letter]}, 0)`,
                  }}
                ></div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

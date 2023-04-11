import { useState } from "react";
import { BrailleSim } from "../components/BrailleSim";

export function SetPosition() {
  return (
    <div className="content">
      <h1>Set Position</h1>

      <BrailleSim></BrailleSim>
    </div>
  );
}

import React from "react";
import { useContext } from "react";
import { MyContext } from "./ContextApi";

export default function IOput() {
  const counterstate = useContext(MyContext);

  return (
    <div style={{ border: "1px solid black" }}>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            border: ".2px solid black",

            background: counterstate.tab === "input" ? "white" : "grey",
          }}
          onClick={() => {
            counterstate.set_tab("input");
          }}
        >
          Input
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            border: ".2px solid black",

            background: counterstate.tab === "output" ? "white" : "grey",
          }}
          onClick={() => {
            counterstate.set_tab("output");
          }}
        >
          Output
        </div>
      </div>
      <div className="input-group">
        <textarea
          className="form-control"
          value={
            counterstate.tab === "output"
              ? counterstate.output
              : counterstate.input
          }
          onChange={(e) => {
            if (counterstate.tab === "input") {
              counterstate.setinput(e.target.value);
            }
          }}
        ></textarea>
      </div>
    </div>
  );
}

import React, { createContext, useState } from "react";
export const MyContext = createContext(null);

export const ContextApi = (props) => {
  const [input, setinput] = useState("");
  const [tab, set_tab] = useState("input");
  const [output, setoutput] = useState("");
  const contextValue = {
    input,
    setinput,
    output,
    setoutput,
    tab,
    set_tab,
  };
  return (
    <MyContext.Provider value={contextValue}>
      {props.children}
    </MyContext.Provider>
  );
};

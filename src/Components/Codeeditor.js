import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import IOput from "./IOput";
import { useContext } from "react";
import { MyContext } from "./ContextApi";

const socket = io.connect("http://localhost:3001");

const Codeeditor = () => {
  const [messageReceived, setMessageReceived] = useState("");
  const [selected_lang, set_selected_lang] = useState("cpp");
  const counterstate = useContext(MyContext);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageReceived(data);
    };

    socket.on("receive_message", handleReceiveMessage);

    socket.on("receive_tab", (data) => {
      counterstate.set_tab(data);
    });

    socket.on("recieve_code", (code) => {
      counterstate.setoutput(code);
    });

    socket.on("recieve_lang", (lang) => {
      set_selected_lang(lang);
    });

    socket.on("recieve_input", (rec_input) => {
      counterstate.setinput(rec_input);
    });

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [counterstate]);

  useEffect(() => {
    socket.emit("tab_change", counterstate.tab);
    socket.emit("code_change", counterstate.output);
    socket.emit("input_change", counterstate.input);
  }, [counterstate]);

  useEffect(() => {
    socket.emit("lang_change", selected_lang);
  }, [selected_lang]);

  const handleCompile = async () => {
    counterstate.setoutput("Executing....");
    try {
      counterstate.set_tab("output");
      const response = await fetch("http://localhost:3001/RunCompile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: counterstate.input,
          code: messageReceived,
          language: selected_lang,
        }),
      });

      const data = await response.json();
      console.log("Server response:", data);
      counterstate.setoutput(data.stderr != null ? data.stderr : data.stdout);
    } catch (error) {
      console.error("Error during POST request:", error.message);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <select
          value={selected_lang}
          onChange={(event) => {
            set_selected_lang(event.target.value);
          }}
        >
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="python">Python</option>
        </select>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCompile}
          style={{ borderRadius: "0px", padding: "9px 26px" }}
        >
          Run
        </button>
      </div>

      <CodeMirror
        value={messageReceived}
        height="425px"
        theme={okaidia}
        onChange={React.useCallback((value, viewUpdate) => {
          socket.emit("send_message", value);
        }, [])}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
        ]}
      />
      <IOput />
    </>
  );
};

export default Codeeditor;

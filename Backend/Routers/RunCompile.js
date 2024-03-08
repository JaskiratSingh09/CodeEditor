const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/RunCompile", async (req, res) => {
  const data = req.body.data;
  const code = req.body.code;
  const lang = req.body.language;
  const name = "index." + lang;
  const options = {
    method: "POST",
    url: "https://onecompiler-apis.p.rapidapi.com/api/v1/run",
    headers: {
      "content-type": "application/json",
      "X-RapidAPI-Key": "1e63cb528bmsh4d72fcb5d72aa91p1b5f9djsn12b4ec0d98e1",
      "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com",
    },
    data: {
      language: lang,
      stdin: data,
      files: [
        {
          name: name,
          content: code,
        },
      ],
    },
  };

  try {
    const response = await axios.request(options);
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;

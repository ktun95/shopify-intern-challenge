const path = require("path");
const express = require("express");
const app = express();
const PORT = 8080;
const API_TOKEN = require("../secrets") || process.env.OPENAI_API_TOKEN;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.get("/api/token", (req, res) => {
  res.json({ API_TOKEN });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

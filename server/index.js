const path = require('path')
const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, "..", "public")));

app.get('/', (req, res) =>{
    res.sendFile('index.html');
}); 

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

const express = require("express");
const app = express();
const fs = require("fs");
const bodyParser = require("body-parser");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routa na domovskou stránku
app.get("/", (req, res) => {
  res.render("index");
});

// Routa na stránku /about
app.get("/about", (req, res) => {
  res.render("about");
});

app.post("/submit", (req, res) => {
  let newMessage = {
    author: req.body.author,
    message: req.body.message,
    date: new Date().toISOString(),
    ipAddress: req.ip.split(":").pop()
  }

fs.readFile("data.json", (err, data) => {
  if (err) throw err;
  if(data){
    let messages = JSON.parse(data);
    messages.push(newMessage);
    fs.writeFile("data.json", JSON.stringify(messages), (err) => {
      if (err) throw err;
      res.send("Data saved to file");
    });
  }
});
});

app.get("/messages/json", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) throw err;
    if(data){
      let messages = JSON.parse(data);
      //res.send(messages);
      res.json(messages);
    }
  });
});

app.get("/messages", (req, res) => {
  fs.readFile("data.json", (err, data) => {
    if (err) throw err;
    if(data){
      let messages = JSON.parse(data);
      res.render("messages", { zpravy: messages, autor: 'Ondrej Honus' });
    }
  });
});

app.listen(3000);
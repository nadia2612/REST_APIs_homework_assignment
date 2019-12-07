const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const port = 3000;

const requestLimit = () => {
  let count = 0;
  return (req, res, next) => {
    if (count >= 5) {
      res.status(429).send("Too Many Requests");
    } else {
      count = count + 1;
      next();
    }
  };
};

app.post("/messages", requestLimit(), (req, res, next) => {
  if (!req.body.text || req.body.text === "") {
    res.status(400).send("Bad Request");
  } else {
    console.log(req.body.text);
    res.json({
      message: "Message received loud and clear"
    });
  }
  next();
});

app.listen(port, () => console.log(`listening ${port}`));

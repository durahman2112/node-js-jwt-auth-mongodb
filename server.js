const express = require("express");
const cors = require("cors");

const app = express();

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse request of content-type-application/json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Durahman Application" })
})

// set port listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on pot ${PORT}`);
})
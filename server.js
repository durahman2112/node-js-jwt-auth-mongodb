const express = require("express");
const cors = require("cors");

const app = express();
const db = require("./app/models");
const dbConfig = require("./app/config/db.config");

var corsOptions = {
  origin: "http://localhost:3001"
};

app.use(cors(corsOptions));

// parse request of content-type-application/json
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const Role = db.role;

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Succesfully connect to MongoDB");
    initial();
  }).catch(err => {
    console.error("Connection Error", err);
    process.exit();
  })

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Durahman Application" })
})

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);

// set port listen for request
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on pot ${PORT}`);
})

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: 'user'
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      })

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      })
    }
  })
}
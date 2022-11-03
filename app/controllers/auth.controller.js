const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bycrypt = require("bcryptjs");

exports.signup = (req, res) => {
  console.log("masuk signup");
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bycrypt.hashSync(req.body.password, 8)
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err })
      console.log("error 1");
      return
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            console.log("error 2");
            return;
          }

          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              console.log("error 3");
              return;
            }

            res.send({ message: "User was registered successfully!" })
          })
        }
      )
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          console.log("error disini 1");
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            console.log("error disini 2");
            return;
          }

          res.send({ message: "User was registered successfully!" })
        })
      })
    }
  })
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User not found." })
      }

      var passwordIsValid = bycrypt.compareSync(
        req.body.password,
        user.password
      )

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        })
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 //24 hours
      })

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        const element = user.roles[i];
        authorities.push("ROLE_" + element.name.toUpperCase())
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      })
    })
}
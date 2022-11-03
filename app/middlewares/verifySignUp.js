const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findOne({
    username: req.body.username
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user) {
      res.status(400).send({ message: "Failed! Username is already is use!" })
      return;
    }

    // Email
    User.findOne({
      email: req.body.email
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res.status(400).send({ message: "Failed! Email is already is use!" })
        return;
      }

      next()
    })
  })
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      const element = req.body.roles[i];
      if (!ROLES.includes(element)) {
        res.status(400).send({
          message: `Failed! Role ${element} does not exist!`
        });

        return;
      }
    }
  }

  next();
}

const verifiSignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted
}

module.exports = verifiSignUp;
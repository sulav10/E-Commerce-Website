const express = require("express");
const router = express.Router();
const User = require("../model/user.model");
const passwordHash = require("password-hash");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = require("../middlewares/authentication.js");

const mapUser = (user, reqBody) => {
  if (reqBody.username) {
    user.username = reqBody.username;
  }
  if (reqBody.name) {
    user.name = reqBody.name;
  }
  if (reqBody.email) {
    user.email = reqBody.email;
  }
  if (reqBody.phoneNumber) {
    user.phoneNumber = reqBody.phoneNumber;
  }
  if (reqBody.role) {
    user.role = reqBody.role;
  }
  return user;
};

const generateToken = (data) => {
  const token = jwt.sign(
    { username: data.username, id: data._id },
    process.env.SECRET_KEY
  );
  return token;
};

router.post("/login", (req, res, next) => {
  User.findOne({
    username: req.body.username,
  })
    .then((user) => {
      if (user) {
        const matchedPassword = passwordHash.verify(
          req.body.password,
          user.password
        );

        if (matchedPassword) {
          res.status(200).json({
            user,
            token: generateToken(user),
          });
        } else {
          res.status(400).json("Incorrect password!!!");
        }
      } else {
        res.status(400).json("User not found");
      }
    })
    .catch((err) => console.log(err));
});

router.post("/register", (req, res, next) => {
  const newUser = new User({});
  const newMappedUser = mapUser(newUser, req.body);
  const hashedPassword = passwordHash.generate(req.body.password);

  newMappedUser.password = hashedPassword;
  newMappedUser
    .save({})
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err.response);
    });
});

router.get("/find", authenticate, (req, res, next) => {
  User.findById(req.loggedInUser._id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;

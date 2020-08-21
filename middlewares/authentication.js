const jwt = require("jsonwebtoken");
const User = require("../model/user.model");

const authenticate = (req, res, next) => {
  let token;

  if (req.headers["token"]) {
    token = req.headers["token"];
  }
  if (req.headers["authorize"]) {
    token = req.headers["authorize"];
  }
  if (req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
      if (err) {
        return next(err);
      }
      User.findById(decoded.id)
        .then((user) => {
          if (user) {
            req.loggedInUser = user;
            next();
          } else {
            next({
              msg: "User removed from system",
              status: 400,
            });
          }
        })
        .catch((err) => {
          return next(err);
        });
    });
  } else {
    next({
      msg: "Token Not Provided",
      status: 400,
    });
  }
};

module.exports = authenticate;

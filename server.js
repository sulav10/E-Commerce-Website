const express = require("express");
const app = express();
const cors = require("cors");
require("./db.js");
const auth = require("./controller/auth.route");
var bodyParser = require("body-parser");
const product = require("./controller/product.route");

app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.static("uploads"));

app.listen(5000, (err, done) => {
  if (err) {
    console.log("cannot connect to the server");
  } else {
    console.log("connected to the server");
  }
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/auth", auth);
app.use("/product", product);

app.use((req, res, next) => {
  next({
    msg: "Page Not Found",
    status: 404,
  });
});

app.use((err, req, res, next) => {
  res.status(err.status || 400).json({
    msg: err.msg || err,
    status: err.status || 400,
  });
});

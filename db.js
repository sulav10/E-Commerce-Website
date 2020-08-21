const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://localhost:27017/newOnlineShop",
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, done) => {
    if (err) {
      console.log("Cannot connect to the database");
    } else {
      console.log("connected to the database");
    }
  }
);

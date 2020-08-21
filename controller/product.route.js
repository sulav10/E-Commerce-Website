const express = require("express");
const router = express.Router();
const Product = require("../model/product.model");
const multer = require("multer");
const authenticate = require("../middlewares/authentication");
const User = require("../model/user.model");

const mapProduct = (product, reqBody) => {
  if (reqBody.name) {
    product.name = reqBody.name;
  }
  if (reqBody.description) {
    product.description = reqBody.description;
  }
  if (reqBody.category) {
    product.category = reqBody.category;
  }
  if (reqBody.brand) {
    product.brand = reqBody.brand;
  }
  if (reqBody.price) {
    product.price = reqBody.price;
  }
  if (reqBody.color) {
    product.color = reqBody.color;
  }
  if (reqBody.weight) {
    product.weight = reqBody.weight;
  }
  if (reqBody.manuDate) {
    product.manuDate = reqBody.manuDate;
  }
  if (reqBody.tags) {
    product.tags = reqBody.tags;
  }
  if (reqBody.image) {
    product.image = reqBody.image;
  }
  if (reqBody.user) {
    product.user = reqBody.user;
  }
  return product;
};

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.get("/product/:id", (req, res, next) => {
  Product.findById(req.params.id)
    .then((item) => {
      res.status(200).json({ item: item });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/view", authenticate, (req, res, next) => {
  let condition = {};
  if (req.loggedInUser.role != 1) {
    condition.user = req.loggedInUser._id;
  }

  Product.find(condition)
    .populate("user")
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/get-products", (req, res, next) => {
  let Skip = req.body.skip;
  let Limit = req.body.limit;
  Product.find()
    .skip(Skip)
    .limit(Limit)
    .populate("user")
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/image",
  authenticate,
  upload.single("image"),
  (req, res, next) => {
    res.status(200).json(req.file.filename);
  }
);

router.put("/edit/:id", authenticate, (req, res, next) => {
  Product.findById(req.params.id)
    .then((item) => {
      let updatedProduct = mapProduct(item, req.body);
      updatedProduct
        .save()
        .then((item) => {
          res.status(200).json(item);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      console.log(err.response);
    });
});

router.post("/add", authenticate, (req, res, next) => {
  const product = new Product();
  req.body.user = req.loggedInUser._id;
  const mappedProduct = mapProduct(product, req.body);
  mappedProduct
    .save()
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/delete/:id", authenticate, (req, res, next) => {
  Product.findById(req.params.id)
    .deleteOne()
    .then(() => {
      res.status(200).json("item deleted");
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/remove-from-cart/:id", authenticate, (req, res, next) => {
  User.findOneAndUpdate(
    {
      _id: req.loggedInUser._id,
    },
    { $pull: { cart: { id: req.params.id } } },
    { new: true }
  )
    .then((cartInfo) => {
      res.status(200).json(cartInfo);
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/add-to-cart/:id", authenticate, (req, res, next) => {
  let duplicate = false;

  User.findById(req.loggedInUser._id)
    .then((user) => {
      user.cart.forEach((item) => {
        if (item.id === req.params.id) {
          duplicate = true;
        }
      });

      if (duplicate) {
        User.findOneAndUpdate(
          {
            _id: req.loggedInUser._id,
            "cart.id": req.params.id,
          },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        )
          .then((cartInfo) => {
            res.status(200).json(cartInfo);
          })
          .catch((err) => {
            console.log("the err is", err);
            next(err);
          });
      } else {
        User.findOneAndUpdate(
          { _id: req.loggedInUser._id },
          {
            $push: {
              cart: { id: req.params.id, quantity: 1, date: Date.now() },
            },
          },
          {
            new: true,
          }
        )
          .then((cartInfo) => {
            res.status(200).json(cartInfo);
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      console.log("error occured", err);
    });
});

module.exports = router;

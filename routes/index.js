const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Cart = require("../models/cart");

router.get("/", async (req, res) => {
  try {
    const prods = await Product.find({});
    res.render("../views/shop/index.ejs", { products: prods });
  } catch {
    console.log("Error redering index");
  }
});

router.get("/add-to-cart/:id", (req, res) => {
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  Product.findById(productId, (err, product) => {
    if (err) {
      res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect("/");
  });
});

router.get("/shopping-cart", (req, res) => {
  if (req.session.cart == null) {
    res.render("../views/shop/shopping-cart.ejs", { products: null });
  } else {
    //console.log("hdahadh" + req.session.cart.items);
    var cart = new Cart(req.session.cart);
    res.render("../views/shop/shopping-cart.ejs", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty:cart.totalQty
    });
  }
});

module.exports = router;

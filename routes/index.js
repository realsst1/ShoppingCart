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
    //console.log(req.session.cart);
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
      totalQty: cart.totalQty
    });
  }
});

router.get("/checkout", (req, res) => {
  if (req.session.cart == null) {
    res.redirect("/shopping-cart");
  } else {
    var cart = new Cart(req.session.cart);
    var errMsg=req.flash("error")
    res.render("../views/shop/checkout.ejs", {
      products: cart.generateArray(),
      totalPrice: cart.totalPrice,
      totalQty: cart.totalQty,
      errors:errMsg
    });
  }
});

router.post("/checkout", (req, res) => {

  if(!req.session.cart){
    return res.redirect("/shopping-cart")
  }
  var cart=new Cart(req.session.cart)
  var stripe = require("stripe")("sk_test_2CADxtgRDQNVvJuDScqxwggN00GWwYP5id");

  // `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
  stripe.charges.create(
    {
      amount: cart.totalPrice,
      currency: "inr",
      source: 'tok_mastercard',
      description: "My First Test Charge (created for API docs)"
    },
    function(err, charge) {
      // asynchronously called
      if(err){
        console.log(err.message)
        req.flash("error",err.message)
      }
      else{
        req.session.cart=null
        req.flash("success_msg","Order Placed Successfully")
        console.log("success")
        res.redirect("/")
      }
    }
  );
});

module.exports = router;

const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const User = require("../../models/user");
const {ensureAuthenticated}=require('../../config/auth')
const Order=require('../../models/order')
const Cart=require('../../models/cart')

router.get("/signin", (req, res) => {
  res.render("users/signin.ejs");
});

router.get("/register", (req, res) => {
  res.render("users/register.ejs");
});

router.post("/register", async (req, res) => {
  try {
    let errors = [];
    let hPassword;
    const { name, email, password, password2, contact, address } = req.body;
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.password ||
      !req.body.password2 ||
      !req.body.contact ||
      !req.body.address
    ) {
      errors.push({
        msg: "Please fill all fields\n"
      });
    }
    if (req.body.password !== req.body.password2) {
      errors.push({
        msg: "Passwords donot match\n"
      });
    }
    if (req.body.password.length < 6) {
      errors.push({
        msg: "Password should be atleast 6 characters\n"
      });
    }
    const emailRegEx= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if(!emailRegEx.test(email)){
      errors.push({
        msg:'Invalid Email'
      })
    }

    if (errors.length > 0) {
      console.log("eee");
      res.render("users/register", {
        errors: errors,
        name: name,
        email: email,
        password: password,
        password2: password2,
        contact: contact,
        address: address
      });
    } else {
      const checkUser = await User.findOne({ email: email }).exec();
      //console.log(checkUser);
      //console.log("check for useer");
      //hash password
      hPassword =bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
      //console.log(hPassword);
      if (checkUser) {
        errors.push({
          msg: "User already exists with this email"
        });
        console.log("ajndajnda");
        res.render("users/register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const user = new User({
          name,
          email,
          password:hPassword,
          contact,
          address
        });
        //console.log(user)
        await user.save();
        req.flash("success_msg", "You are now registered and can log in");
        res.redirect("/users/signin");
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/profile",ensureAuthenticated, (req, res) => {
  Order.find({user:req.user},(err,orders)=>{
    if(err){
      return res.write("Error retrieving orders")
    }
    var cart;
    orders.forEach((order)=>{
      cart=new Cart(order.cart)
      order.items=cart.generateArray()
    })
    res.render("users/profile",{orders:orders})
  })
  //res.render("users/profile.ejs");
});

router.post("/login", (req, res, next) => {
  let errors=[]
  const {email,password}=req.body
  if(!email || !password){
    errors.push({
      msg:'Please fill all fields'
    })
  }
  if(password.length<6){
    errors.push({
      msg:'Password must be atleast 6 characters'
    })
  }
  const emailRegEx= /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if(!emailRegEx.test(email)){
    errors.push({
      msg:'Invalid Email'
    })
  }

  if(errors.length>0){
    res.render("users/signin",{errors:errors,email:email})
  }
  else{
    passport.authenticate("local", {
      successRedirect: "/users/profile",
      failureRedirect: "/users/signin",
      failureFlash: true
    })(req, res, next);
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/signin");
});

module.exports = router;

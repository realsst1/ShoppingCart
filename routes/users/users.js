const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcrypt-nodejs");
const User = require("../../models/user");

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
      console.log(hPassword);
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
        console.log(user)
        await user.save();
        req.flash("success_msg", "You are now registered and can log in");
        res.redirect("/users/signin");
      }
    }
  } catch (e) {
    console.log(e);
  }
});

router.get("/profile", (req, res) => {
  console.log("profiff");
  res.render("users/profile.ejs");
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/users/profile",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;

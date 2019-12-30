const express=require('express')
const router=express.Router()

router.get("/signin",(req,res)=>{
    res.render("users/signin.ejs")
})

router.get("/register",(req,res)=>{
    res.render("users/register")
})

module.exports=router
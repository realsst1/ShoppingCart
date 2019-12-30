const express=require('express')
const router=express.Router()
const Product=require('../models/product')

router.get("/",async(req,res)=>{
    try{
        const prods=await Product.find({})
        res.render("../views/shop/index.ejs",{products:prods})
    }
    catch{
        console.log("Error redering index")
    }
})

module.exports=router
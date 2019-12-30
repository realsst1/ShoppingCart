const mongoose=require('mongoose')

const productSchema=mongoose.Schema({
    imagePath:{
        type:String,
        required:true
    },
    productTitle:{
        type:String,
        required:true
    },
    productDesc:{
        type:String,
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    }
})

module.exports=mongoose.model("Product",productSchema)
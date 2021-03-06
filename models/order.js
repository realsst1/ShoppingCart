const mongoose=require('mongoose')
const moment=require('moment')

const OrderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    cart:{
        type:Object,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    paymentId:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    pincode:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    orderDate:{
        type:String,
        default:moment(Date.now()).format('MMMM Do YYYY, h:mm a'),
        required:true
    }
})

module.exports=mongoose.model("Order",OrderSchema)
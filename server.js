if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express=require("express")
const app=express()
const expressLayouts=require("express-ejs-layouts")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const indexRouter=require('./routes/index')

app.use(expressLayouts)
app.set("view engine","ejs")
app.set("views",__dirname+"/views")
app.set("layout","layouts/layout")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:false}))


app.use("/",indexRouter)


mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on("error",(error)=>console.log(error))
db.once("open",()=>console.log("Connected to database"))

const port=process.env.PORT || 3000

app.listen(port)
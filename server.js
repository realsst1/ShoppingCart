if(process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}

const express=require("express")
const app=express()
const expressLayouts=require("express-ejs-layouts")
const bodyParser=require("body-parser")
const mongoose=require("mongoose")
const indexRouter=require('./routes/index')
const userRouter=require('./routes/users/users')
const expressSession=require('express-session')
const passport=require('passport')
const flash=require('connect-flash')
const validator=require('express-validator')
const {ensureAuthenticated}=require('./config/auth')
const path=require('path')
const mongoStore=require('connect-mongo')(expressSession)

app.use(expressLayouts)
app.set("view engine","ejs")
app.set("views",__dirname+"/views")
app.set("layout","layouts/layout")
// app.use(express.static("public"))
app.use('/public',express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended:false}))
//app.use(validator())
app.use(expressSession({
    secret:"mysecret",
    resave:false,
    saveUninitialized:false,
    store:new mongoStore({
        mongooseConnection:mongoose.connection
    }),
    cookie:{
        maxAge:180*60*1000
    }
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg")
    res.locals.error_msg=req.flash("error_msg")
    res.locals.error=req.flash("error")
    res.locals.login=req.isAuthenticated()
    res.locals.session=req.session
    next()
})


app.use("/",indexRouter)
app.use("/users",userRouter)


mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology:true})
const db=mongoose.connection
db.on("error",(error)=>console.log(error))
db.once("open",()=>console.log("Connected to database"))
require('./config/passport')

const port=process.env.PORT || 3000

app.listen(port)
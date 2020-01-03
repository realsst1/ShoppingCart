const LocalStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')
const User=require('../models/user')
const bcrypt=require('bcrypt-nodejs')

module.exports=function(passport){
    passport.use(
        new LocalStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:'Email not registered'})
                }
                else{
                    if(bcrypt.compareSync(password,user.password)){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message:'Incorrect Password'})
                    }
                }
            })
            .catch(err=>console.log(err))
        })
    )

    passport.serializeUser(function(user,done){
        done(null,user.id)
    })

    passport.deserializeUser(function(id,done){
        User.findById(id,function(err,user){
            done(err,user)
        })
    })
}
 
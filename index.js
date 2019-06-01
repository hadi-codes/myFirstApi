const express = require('express');
const Joi = require('@hapi/joi');
const crypto=require('crypto')
const app = express();
const info = require('./routes/user/info')
const newUser = require('./routes/user/signup').newUser;
const emailVerification = require('./routes/user/emailVerification')
const argon2 = require('argon2');
const resetPass=require('./routes/resetPass/resetPass1')
const newPass=require('./routes/resetPass/resetPass2')
const reSendVerificatinToken=require('./routes/user/verificationTokenResender')
var ExpressBrute = require('express-brute')
const   MongoStore = require('express-brute-mongo');
var MongoClient = require('mongodb').MongoClient;
const multer=require('multer')
const GridFsStorage=require('multer-gridfs-storage')
const GridFsStream=require('gridfs-stream')
const path=require('path')
const loginv2=require('./routes/user/login')
const signup=require('./routes/user/signup')
const logout=require('./routes/user/logout')
const changePass=require('./routes/user/changePass')






app.use(express.json());

app.use('/api/login/',loginv2) //login 
app.use('/api/signup/',signup)// signup
app.use('/api/logout/:token',logout)
app.use('/api/user/info/:token',info)//user info
app.use('/api/resendToken',reSendVerificatinToken)
app.use('/api/emailVerification/:token',emailVerification)
app.use('/api/user/changePass',changePass)//change password
app.use('/api/resetpass/',resetPass)//resetpass1
app.use('/api/newPass/',newPass)//resetPass2 new pass


app.get('/', (req, res) => {
    res.send('Hello fam');
});




// sending token link to change password
app.post('/api/user/resetpass/',(req,res)=>{
    const schema={email:Joi.string().email({minDomainAtoms:2}).required()}
    Joi.validate(req.body,schema,(err,result)=>{
        
        if(!err){
            resetPassToken(req.body,function(resMsg){
                res.send(resMsg)
            })


        }else{
            res.send(err)
        }
    })
})

// Reset password with token 
app.post('/api/user/newpass/:token',(req,res)=>{
    const schema={newPass: Joi.string().min(8).max(21).required()}
    Joi.validate(req.body,schema,(err,result)=>{
        if(!err){
            newPass(req.params.token,req.body.newPass,function(msg){
                res.send(msg)
            })
        }else{
            res.send(err)
        }
    })
})


const port = process.env.PORT || 3001;

app.listen(port);


console.log(`listing on port .... ${port}`);

module.exports=app;

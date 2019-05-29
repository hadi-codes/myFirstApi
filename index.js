const express = require('express');
const Joi = require('joi');
const crypto=require('crypto')
const app = express();
const info = require('./info').getInfo
const newUser = require('./routes/user/signup').newUser;

const emailVerification = require('./routes/user/emailVerification')

const argon2 = require('argon2');
const resetPassToken=require('./resetPass1').resetPassToken
const newPass=require('./resetPass2').newPass
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
var storage = new GridFsStorage({
    url: 'mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/file?retryWrites=true',
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  const upload = multer({ storage });









/*
var store = new MongoStore(function (ready) {
    MongoClient.connect('mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/store?retryWrites=true',{useNewUrlParser:true}).then((db)=>{

    
    
      ready(db.db('store').collection('bruteforce-store'));
    });
  });
  
  var bruteforce = new ExpressBrute(store);
*/
var store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
var bruteforce = new ExpressBrute(store);
app.use(express.json());
app.use('/api/login/',loginv2) //login 
app.use('/api/signup/',signup)// signup
app.use('/api/logout/:token',logout)
app.use('/api/resendToken',reSendVerificatinToken)
app.use('/api/emailVerification/:token',emailVerification)
app.use('/api/user/changePass',changePass)//change password

app.post('/profile', upload.single('avatar'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log(res.file)
  })


app.get('/', (req, res) => {
    res.send('Hello fam');
});

app.get('/auth',
  bruteforce.prevent, // error 403 if we hit this route too often
  function (req, res, next) {
      
    res.send('Success!');
    console.log(req.ip)
    }
  
);


// Getting user info 
app.get('/api/user/info/:token', (req, res) => {
    const token = req.params.token;
    module.exports.token = token;

    info(token).then(function (docs) {
        if (docs.length > 0) {
            res.status(200).send(JSON.stringify(docs))
        }
        else {
            res.status(400).send('Opps.. ')
        }


    })



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

app.post('/test/',upload.single('image'),(req,res)=>{
    console.log(req.file)
    res.send(req.file)
})

//app.post('/api/user/uploadProfilPic',)

const port = process.env.PORT || 3001;

app.listen(port);


console.log(`listing on port .... ${port}`);

module.exports=app;

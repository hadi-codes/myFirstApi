const express = require('express')
const router = express.Router({mergeParams:true});
const Joi =require('@hapi/joi')
// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;




router.get('/',(req,res)=>{
  MongoClient.connect(url,{useNewUrlParser:true}).then((db)=>{
    
    db.db('myuserdb').collection('user').findOne({'token':`${req.params.token}`}).then((doc)=>{
      console.log(doc)
      delete doc.password
      res.send(doc)
    })
    


    //err handler for query
    .catch((err)=>{console.log(err)})
  })
  //err handler for MC
  .catch((err)=>{console.log(err)})
})
module.exports=router
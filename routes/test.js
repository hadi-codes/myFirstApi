const express = require('express')
const router = express.Router();

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

/*

router.get('/',(req,res)=>{
    MongoClient.connect(url,{useNewUrlParser: true }).then((db)=>{
        db.db('myuserdb').collection('user').find().toArray().then((doc)=>{
            console.log(doc)
            res.send(doc)
        })
    }).catch((err)=>{
        console.log(err)
    })
})*/




module.exports=router
const express=require('express')
const router =express.Router();
const Joi=require('@hapi/joi')
const argon2 = require('argon2');

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

router.post('/',(req,res)=>{
    const schema = {
        token: Joi.string().required(),
        currentPass: Joi.string().min(8).max(21).required(),
        newPass: Joi.string().min(8).max(21).required()
    }
    Joi.validate(req.body, schema, (err, result) => {
        var reqBody=req.body
        if (!err) {
            console.log('1- runnin the function')
            MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
                console.log('2 - mongo client')
              
                db.db('myuserdb').collection('user').findOne({ 'token': `${req.body.token}` }).then((docs) => {
                    console.log('3- query for email an getting docs ')
                    console.log(docs)
                    if (docs != null) {
                        console.log('4- there is docs and will cheak the current pass ')
    
                        argon2.verify(docs.password, req.body.currentPass).then((isHashOk) => {
                            console.log('5 the current pass hash result ' + isHashOk)
    
                            let checkPassPromise = new Promise((resolve, reject) => {
                                if (isHashOk == true) {
                                    resolve(true)
                                } else { reject(false) }
                            })
                            checkPassPromise.then(() => {
                                argon2.hash(req.body.newPass).then((hash) => {
                                    console.log('6-upadating the pass')
    
                                    db.db('myuserdb').collection('user').updateOne({ 'token': `${req.body.token}` }, { $set: { password: hash } }).then(() => { res.send({code:200,msg:'password changed successfully'});cloesDB=true ;db.close()})
    
    
                                    // err handler for argon hasher
                                }).catch((err) => { console.log(err) })
    
    
                                // return false if current pass is wrong
                            }).catch((err) => {
                                console.log('current pass is '+ err)
                                res.send({msg:'current password is wrong'})
                                console.log(err)
                            })
    
                            // err handler for argon
                        }).catch((err) => { console.log(err) })
                    } else {
                        db.close()
                        res.send({code:401,msg:' error'})
                        console.log('4..no docs')
    
                    }
                  
                    // err handler for the query
                }).catch((err) => {
    
                    console.log(err)
                })
    
    
    
    
    
                // err handler for MC 
            }).catch((err) => {
                console.log(err)
            })
    
        } else {
            res.send(JSON.stringify({msg:err.details[0].message}))
        }
    })
       

    })
    module.exports=router
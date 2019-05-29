
const express=require('express')
const router =express.Router();
const argon2 = require('argon2');

const crypto = require('crypto')
const emailer = require('./signupMailer').emailer
const moment = require('moment')


// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

router.post('/',(req,res)=>{

    //conncet to db
    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
        // query for email to chech if already signed up
        db.db('myuserdb').collection('user').findOne({ email: `${req.body.email}` }).then((docs) => {
          
            if (docs == null) {
                // hashing the password
                argon2.hash(req.body.password).then((hash) => {
                    req.body.password = hash
                    console.log(hash)

                    const randomToken = async () => {
                        const buffer = await crypto.randomBytes(48);
                        return buffer.toString("hex");
                    };
                    // creating account token 
                    randomToken().then((token) => {
                        console.log(token)
                        req.body.token = token
                        req.body.isEmailVerified=false
                        // inserting the new User
                        db.db('myuserdb').collection('user').insertOne(req.body).then(() => {
                            // sending email with verifiction token 
                            emailer(req.body)
                            res.send([{res:{code:200,msg:'you signed up succsefully'}},{accInfo:{firstname:req.body.firstname,lastname:req.body.lastname,token:req.body.token}}])
                            db.close();
                            //err handler for db insert
                        }).catch((err) => { console.log(err) })

                        //err handler for random TOken
                    }).catch((err) => { console.log(err) })

                })
                    //err handelr for argon
                    .catch((err) => { })
            } else {
                res.send([{res:{code:200,msg:'email already exists'}}])
                db.close()
                console.log('account found already in db')
            }

            //err handler for query
        }).catch((err) => { console.log(err) })


        //error handler for MC
    }).catch((err) => { console.log(err) })
})
module.exports=router
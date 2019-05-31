
const express = require('express')
const router = express.Router();
const argon2 = require('argon2');
const Joi=require('@hapi/joi')
const crypto = require('crypto')
const emailer = require('./signupMailer').emailer
const moment = require('moment')
var bodyParser = require('body-parser')
router.use(bodyParser.json({ type: 'application/*+json' }))


// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

router.post('/',(req, res) => {
    // Signup Schema
    const schema = {
        firstname: Joi.string().trim().alphanum().min(2).max(30).required(),
        lastname: Joi.string().trim().alphanum().min(2).max(30).required(),
        midname: Joi.string().trim().alphanum().allow('').min(1).max(30).optional(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(8).max(21).required()

    }
   
    const joiRes = Joi.validate(req.body, schema, (err) => {

        if (!err) {
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
                                req.body.isEmailVerified = false
                                // inserting the new User
                                db.db('myuserdb').collection('user').insertOne(req.body).then(() => {
                                    // sending email with verifiction token 
                                    emailer(req.body)
                                    res.send([{ res: { code: 200, msg: 'you signed up succsefully' } }, { accInfo: { firstname: req.body.firstname, lastname: req.body.lastname, token: req.body.token } }])
                                    db.close();
                                    //err handler for db insert
                                }).catch((err) => { console.log(err) })
        
                                //err handler for random TOken
                            }).catch((err) => { console.log(err) })
        
                        })
                            //err handelr for argon
                            .catch((err) => { })
                    } else {
                        res.send([{ res: { code: 200, msg: 'email already exists' } }])
                        db.close()
                        console.log('account found already in db')
                    }
        
                    //err handler for query
                }).catch((err) => { console.log(err) })
        
        
                //error handler for MC
            }).catch((err) => { console.log(err) })
      
            
        }

        else {


            res.status(400).send(JSON.stringify(err.details[0].message));
        }



    })

});

    //conncet to db
    

module.exports = router
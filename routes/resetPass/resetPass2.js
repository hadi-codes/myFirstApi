const express = require('express')
const router = express.Router();
const index = require('../../index')
const argon2 = require('argon2')
const crypto = require('crypto')
const Joi = require('@hapi/joi')

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;




router.post('/', (req, res) => {

    const schema = {
        token: Joi.string().required(),
        password: Joi.string().min(8).max(21).required()
    }

    const joiRes = Joi.validate(req.body, schema, (err) => {
        if (!err) {
            console.log('1- runnin the function')
            console.log('token ' + req.body.token)
            console.log('newPass ' + req.body.password)
            MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
                db.db('resetPassToken').collection('token').findOne({ 'token': `${req.body.token}` }).then((docs) => {
                    if (docs != null) {
                        argon2.hash(req.body.password).then((hash) => {
                            db.db('myuserdb').collection('user').updateOne({ 'email': `${docs.email}` }, { $set: { password: hash } })
                            console.log(hash)
                            res.send({ msg: 'u got new a password' })
                        })
                            //argon error hndler
                            .catch((err) => {
                                console.log(err)
                            })
                    } else {
                        res.send({ msg: 'no token found' })//change it later
                    }




                    //error handler for query
                }).catch((err) => {
                    console.log(err)
                })



                //error hnadler for MC
            }).catch((err) => {
                console.log(err)
            })




        } else {
            res.status(400).send(JSON.stringify(err.details[0].message));
        }
    })


})

module.exports = router
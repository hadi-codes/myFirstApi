
const express = require('express')
const router = express.Router();
const argon2 = require('argon2');
const Joi = require('@hapi/joi')
const crypto = require('crypto')
const moment = require('moment')
var bodyParser = require('body-parser')
router.use(bodyParser.json({ type: 'application/*+json' }))


// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

router.post('/', (req, res) => {
    // Signup Schema
    const schema = {
        firstname: Joi.string().trim().alphanum().min(2).max(30).required(),
        lastname: Joi.string().trim().alphanum().min(2).max(30).required(),
        midname: Joi.string().trim().alphanum().allow('').min(1).max(30).optional(),
        email: Joi.string().email({ minDomainSegments: 2 }).required(),
        password: Joi.string().min(8).max(21).required()

    }
    function sendEmail(mailTokenInfo) {
        var sg = require('sendgrid')('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');

        var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: {
                personalizations: [
                    {
                        to: [
                            {
                                email: `${mailTokenInfo.email}`
                            }
                        ],
                        subject: 'Activeion token'
                    }
                ],
                from: {
                    email: 'mail@xln.me'
                },
                content: [
                    {
                        type: 'text/plain',
                        value: `hi here is your token   ${mailTokenInfo.token}`
                    }
                ]
            }
        });


        // With promise
        sg.API(request)
            .then(function (response) {
                console.log(response.statusCode);
                console.log(response.body);
                console.log(response.headers);
            })
            .catch(function (error) {
                // error is an instance of SendGridError
                // The full response is attached to error.response
                console.log(error.response.statusCode);
            });
    }


    const randomToken = async () => {
        const buffer = await crypto.randomBytes(48);
        return buffer.toString("hex");
    };


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


                            // creating account token 
                            randomToken().then((token) => {
                                console.log(token)
                                req.body.token = token
                                req.body.isEmailVerified = false
                                // inserting the new User
                                db.db('myuserdb').collection('user').insertOne(req.body).then(() => {
                                    randomToken().then((token) => {
                                        db.db('accActivated').collection('user').insertOne({ email: req.body.email, token: token }).then(() => {

                                            sendEmail({ email: req.body.email, token: token })
                                            res.send([{ res: { code: 200, msg: 'you signed up succsefully' } }, { accInfo: { firstname: req.body.firstname, lastname: req.body.lastname, token: req.body.token } }])
                                            db.close();

                                        })



                                            .catch((err) => {
                                                console.log(err)
                                                db.close();
                                            })

                                    })
                                        .catch((err) => {
                                            db.close();
                                            console.log(err)
                                        })
                                    // sending email with verifiction token 

                                    //err handler for db insert
                                }).catch((err) => {
                                    console.log(err)
                                    db.close();
                                })

                                //err handler for random TOken
                            }).catch((err) => {
                                console.log(err)
                                db.close();
                            })

                        })
                            //err handelr for argon
                            .catch((err) => {
                                console.log(err)
                                db.close();
                            })
                    } else {
                        res.send([{ res: { code: 200, msg: 'email already exists' } }])
                        db.close()
                        console.log('account found already in db')
                    }

                    //err handler for query
                }).catch((err) => {
                    console.log(err)
                    db.close();
                })


                //error handler for MC
            }).catch((err) => {
                console.log(err)
                db.close();
            })


        }

        else {


            res.status(400).send(JSON.stringify(err.details[0].message));
        }



    })

});

//conncet to db


module.exports = router
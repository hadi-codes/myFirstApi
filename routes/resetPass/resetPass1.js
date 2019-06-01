
const express = require('express')
const router = express.Router({ mergeParams: true });
const argon2 = require('argon2')
const crypto = require('crypto')
const Joi = require('@hapi/joi')
// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;



router.post('/', (req, res) => {
    const randomToken = async () => {
        const buffer = await crypto.randomBytes(48);
        return buffer.toString("hex");
    };
    const schema = { email: Joi.string().email({ minDomainSegments: 2 }).required() }
    const JoiRes = Joi.validate(req.body, schema, (err) => {
        if (!err) {
            console.log('1- runnin the function')
            MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {

                db.db('myuserdb').collection('user').findOne({ 'email': `${req.body.email}` }).then((docs) => {


                    if (docs != null) {
                        db.db('resetPassToken').collection('token').findOne({ email: req.body.email }).then((doc) => {
                            console.log(doc)
                            if (doc == null) {
                                
                                // creating account token 
                                randomToken().then((token) => {
                                    console.log(token)
        
                                    db.db('resetPassToken').collection('token').insertOne({ email: req.body.email, token: token }).then(() => {
                                        console.log('FINSHIED')
                                        res.send({ msg: 'sent an email with reset password link ' })
                                        sendEmail({ email: req.body.email, token: token })
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                })
                                    //errhandler for token gen
                                    .catch((err) => {
                                        console.log(err)
                                    })
        
                            }
                            else{
                                console.log('email already in reset pass db')
                                // creating account token 
                                randomToken().then((token) => {
                                    console.log(token)
                                db.db('resetPassToken').collection('token').updateOne({email:req.body.email},{$set:{token:token}}).then(()=>{
                                    sendEmail({email:req.body.email,token:token})
                                    // err handler
                                    res.send({msg:'resent an email with reset password link'})
                                }).catch((err)=>{
                                    console.log(err)
                                })
                                
                                
                                })
                                    
                                    //err handler                                     
                                    .catch((err)=>{console.log(err)})
                            }
                        })

                            //err handler
                            .catch((err) => { console.log(err) })
                        

                    } else {
                        db.close();
                        console.log('no email found')//change this shit later
                        res.send({ msg: 'no email found' })
                    }






                    //error handler for query

                }).catch((err) => {

                    console.log(err)
                })





                //error handler for MC
            }).catch((err) => {
                console.log(err)
            })

            function sendEmail(mailTokenInfo) {
                console.log("ss" + mailTokenInfo)
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
                                subject: 'reset password link'
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
        } else {
            res.status(400).send(JSON.stringify(err.details[0].message));
        }
    })


})
module.exports = router
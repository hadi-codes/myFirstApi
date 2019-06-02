//const index = require('./index');
const argon2 = require('argon2');
const Joi = require('@hapi/joi')
const crypto = require('crypto')
const express = require('express')
const router = express.Router();

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;





router.post('/', (req, res) => {

  const schema = {
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().min(8).max(21).required()
  }


  const joiRes = Joi.validate(req.body, schema, (err) => {

    if (!err) {
      MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {

        db.db('myuserdb').collection('user').findOne({ 'email': `${req.body.email}` }).then((docs) => {

          console.log(docs)
          // checking if the email exitst
          if (docs != null) {

            argon2.verify(docs.password, req.body.password).then((hash) => {
              console.log(hash)

              //checking if the password correct
              if (hash == true) {
                const randomToken = async () => {
                  const buffer = await crypto.randomBytes(48);
                  return buffer.toString("hex");
                };
                // creating account token 
                randomToken().then((token) => {
                  console.log(token)

                  //updating the token when user login
                  db.db('myuserdb').collection('user').updateOne({ 'email': `${req.body.email}` }, { $set: { 'token': `${token}` } }).then(() => {
                    console.log("t20" + req.body.email)
                    res.send([{ res: { code: 200, msg: 'logged in successfully' } }, { accInfo: { firstname: docs.firstname, lastname: docs.lastname, email: docs.email, token: token } }])
                    db.close();
                  })
                    //err handler for updadting token 
                    .catch((err) => { console.log(err) })
                })
                  //err handelr for recreat token for login
                  .catch((err) => { console.log(err) })



                //password is wrong
              } else {


                res.send([{ res: { code: 200, msg: 'email or password is wrong' } }])
                db.close();

              }

            })
              .catch((err) => {
                console.log(err)
              })


            //email not found
          } else {
            db.close();
            res.send([{ res: { code: 200, msg: 'email or password is wrong' } }])
          }

        })


      })
        .catch((err) => {
          console.log(err)
        })

    } else {
      res.status(400).send(JSON.stringify(err.details[0].message));
    }

  })





})







module.exports = router






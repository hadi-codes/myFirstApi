const express = require('express');
const Joi = require('joi');
const app = express();
const login = require('./login');
const newUsers = require('./signup').user;
var reqBody;
const argon2 = require('argon2');


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello fam');
});


// Signup
app.post('/api/signup/', (req, res) => {

    // Signup Schema
    const schema = {
        firstname: Joi.string().trim().alphanum().min(2).max(30).required(),
        lastname: Joi.string().trim().alphanum().min(2).max(30).required(),
        midname: Joi.string().trim().alphanum().allow('').min(1).max(30).optional(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(8).max(21).required()

    }


    Joi.validate(req.body, schema, (err, result) => {
        var joiRes = (Joi.validate(req.body, schema));

        if (!err) {

            reqBody = req.body;

            module.exports.reqBody = reqBody;

            newUsers(reqBody, function (ok) {
                
                if (ok == false) { res.status(200).send(JSON.stringify({code:200,msg:'New user signed up '})) }
                else { res.status(200).send(JSON.stringify({code:200,msg:'Error This E-mail already registered'})) }
            });

        }

        else {
          
            
            res.status(400).send(JSON.stringify(joiRes.error.details[0].message));
        }



    })

});

// login
app.post('/api/login/', (req, res) => {

    reqBody = req.body
    const loginSchema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        password: Joi.string().min(8).max(21).required()
    };
    module.exports.reqBody = reqBody;
    var joiLogin = Joi.validate(req.body, loginSchema, (err, result) => {
        Joi.validate(req.body, loginSchema)
        if (!err) {
            login.userLogin(reqBody, function (ok) {
                if (ok == true) { res.status(200).send(JSON.stringify({code:200,msg:'logged in successfully'})) }
                else { res.status(200).send(JSON.stringify({code:200,msg:'email or password is wrong'})) }

            });
        }
        else {
            joiLogin = Joi.validate(req.body, loginSchema)
            res.status(400).send(JSON.stringify({code:400,msg:joiLogin.error.details[0].message}))
        }
    })


});


const port = process.env.PORT || 3001;

app.listen(port);


console.log(`listing on port .... ${port}`);


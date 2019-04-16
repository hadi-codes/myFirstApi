const express = require('express');
const Joi = require('joi');
const app = express();
const login = require('./login');
const info = require('./info').getInfo
const newUsers = require('./signup').user;
const logout = require('./logout').logout;
const resInfo = require('./login').resInfo
const verifiy = require('./emailVerification').verifiy
var reqBody;
const argon2 = require('argon2');


app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello fam');
});

// Getting user info 
app.get('/api/user/info/:token', (req, res) => {
    const token = req.params.token;
    module.exports.token = token;

    info(token).then(function (docs) {
        if (docs.length > 0) {
            res.status(200).send(JSON.stringify(docs))
        }
        else {
            res.status(400).send('Opps.. ')
        }


    })



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


    var joiRes = Joi.validate(req.body, schema, (err, result) => {

        if (!err) {

            reqBody = req.body;

            module.exports.reqBody = reqBody;

            newUsers(reqBody, function (ok) {

                if (ok == false) { res.status(200).send(JSON.stringify({ code: 200, msg: 'New user signed up ' })) }
                else { res.status(200).send(JSON.stringify({ code: 200, msg: 'Error This E-mail already registered' })) }
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

                if (ok == true) {
                    res.status(200).send(JSON.stringify([{ resInfo: { code: 200, msg: 'logged in successfully' } }, { userInfo: login.resInfo }]))
                }
                else { res.status(200).send(JSON.stringify({ code: 200, msg: 'email or password is wrong' })) }

            });


        }
        else {
            joiLogin = Joi.validate(req.body, loginSchema)
            res.status(400).send(JSON.stringify({ code: 400, msg: joiLogin.error.details[0].message }))
        }
    })


});


// Logout
app.get('/api/user/logout/:token', (req, res) => {
    const token = req.params.token;
    module.exports.token = token;

    logout(token).then(res.status(200).send())




})


// Email verification

app.get('/api/user/verifiy/:token', (req, res) => {
    const token = req.params.token;
    module.exports.token = token
    verifiy(token, function (ok) {
        if (ok == true) {
            res.status(200).send(JSON.stringify({ code: 200, msg: 'email is verified' }))
        }
        else { res.status(401).send(JSON.stringify({ code: 401, msg: 'something gone wrong' })) }
    })


})



const port = process.env.PORT || 3001;

app.listen(port);


console.log(`listing on port .... ${port}`);


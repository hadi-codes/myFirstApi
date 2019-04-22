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
const changePass=require('./changePass').changePass
const argon2 = require('argon2');
const resetPassToken=require('./resetPass1').resetPassToken
const newPass=require('./resetPass2').newPass

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

// Changing password
app.post('/api/user/changepass/', (req, res) => {
    
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(),
        currentPass: Joi.string().min(8).max(21).required(),
        newPass: Joi.string().min(8).max(21).required()
    }
    Joi.validate(req.body, schema, (err, result) => {
        var reqBody=req.body
        if (!err) {
            changePass(req.body,function(ok){
                res.send(ok)
            })
        } else {
            res.send(err)
        }
    })

})

// sending token link to change password
app.post('/api/user/resetpass/',(req,res)=>{
    const schema={email:Joi.string().email({minDomainAtoms:2}).required()}
    Joi.validate(req.body,schema,(err,result)=>{
        
        if(!err){
            resetPassToken(req.body,function(resMsg){
                res.send(resMsg)
            })


        }else{
            res.send(err)
        }
    })
})

// Reset password with token 
app.post('/api/user/newpass/:token',(req,res)=>{
    const schema={newPass: Joi.string().min(8).max(21).required()}
    Joi.validate(req.body,schema,(err,result)=>{
        if(!err){
            newPass(req.params.token,newPass,function(msg){
                res.send(msg)
            })
        }else{
            res.send(err)
        }
    })
})

const port = process.env.PORT || 3001;

app.listen(port);


console.log(`listing on port .... ${port}`);


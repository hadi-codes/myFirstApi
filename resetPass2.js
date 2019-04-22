


const index = require('./index')
const argon2=require('argon2')
const crypto = require('crypto')
var mailTokenInfo = {
    email: '', token: ''

};

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;






module.exports = {
    newPass: (token, newPass, callback) => {
        console.log('1- runnin the function')
        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            db.db('resetPassToken').collection('token').findOne({ 'token': `${token}` }).then((docs) => {
                if (docs != null) {
                   argon2.hash(newPass).then((hash)=>{
                    db.db('myuserdb').collection('user').updateOne({'email':`${docs.email}`},{$set:{password:hash}})
                    console.log(hash)
                    callback({msg:'u got new a password'})
                   })
                   //argon error hndler
                   .catch((err)=>{
                       console.log(err)
                   })
                }else{
                    callback({msg:'no email found'})
                }




                //error handler for query
            }).catch((err) => {
                console.log(err)
            })



            //error hnadler for MC
        }).catch((err) => {
            console.log(err)
        })


    }
}
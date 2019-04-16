const index = require('./index');
const argon2 = require('argon2');

const crypto = require('crypto')



// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;



var resInfo;
var token=1;

  
userLogin=function  (reqBody, callback)  {


   


    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
      
      db.db('myuserdb').collection('user').find({ 'email': `${reqBody.email}` }).toArray().then((docs) => {
        

       
        if (docs.length > 0) {

          argon2.verify(docs[0].password, reqBody.password).then((hash) => {
            


            if (hash == true) {
             
              resInfo = docs
              delete resInfo[0].password
              delete resInfo[0]._id
              module.exports.resInfo=resInfo
              

              callback(true)
            } else {
              
              callback(false)
            }

          })
            .catch((err) => {
              console.log(err)
            })



        }else{
          callback(false)
        }
        db.close();
      })


    })
      .catch((err) => {
        console.log(err)
      })

    


  }
  

module.exports.userLogin=userLogin;

module.exports.token=token
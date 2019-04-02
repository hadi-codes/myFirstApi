const index = require('./index');
const argon2=require('argon2');
function userLogin(reqBody, callback) {


  const MongoClient = require('mongodb').MongoClient;
  const assert = require('assert');

  // Mongodb URL
  const url = 'mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true';

  // Database Name
  const dbName = 'myuserdb';

  // Create a new MongoClient
  const client = new MongoClient(url);

  // Use connect method to connect to the Server
  client.connect(function (err) {
    assert.equal(null, err);
    const db = client.db(dbName);
    queryUser(db, function (ok) {
      callback(ok)
      client.close();
    });
  });



  const queryUser = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('user');
    // Find the user info throw email
    collection.find({ 'email': `${reqBody.email}`}).toArray(function (err, docs) {
      assert.equal(err, null);
    
      // Verifing the password 
      argon2.verify(docs[0].password,reqBody.password).then(hash=>{
        callback(hash);
      })
     

    });
  }
}

module.exports.userLogin = userLogin;
const argon2 = require('argon2');
const index = require('./index');

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

// Create a new MongoClient

const dbName = 'myuserdb';


const user = function (reqBody, callback) {



    const client = new MongoClient(url);

    client.connect(function (err) {
        assert.equal(null, err);
        const db = client.db(dbName);
        findUser(db, function (ok) {
            if (ok == false) { callback(ok); InsertNewUser(reqBody); }
            else { callback(ok); }

            client.close();
        });
    });


    // Checking if the user already in the db
    const findUser = function (db, callback) {
        const collection = db.collection('user');

        collection.find({ 'email': `${reqBody.email}` }).toArray(function (err, docs) {
            assert.equal(err, null);
            callback(docs.length > 0);
        });
    }
}


// inserting function 
function InsertNewUser(reqBody) {

    // encrypting the password with argon2 algorithm
    argon2.hash(reqBody.password).then(hash => {
        reqBody.password = hash;
    })
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.db('myuserdb').collection("user").insertOne(reqBody, function (err, res) {
            if (err) throw err;
            db.close();
        });
    });
}


module.exports.user = user;
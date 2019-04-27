

const index = require('./index');
const argon2 = require('argon2');

const crypto = require('crypto')
const emailer = require('./emailer').emailer
const moment = require('moment')


// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;


module.exports={
newUser:(reqbody,callback)=> {
    //conncet to db
    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
        // query for email to chech if already signed up
        db.db('myuserdb').collection('user').findOne({ email: `${reqbody.email}` }).then((docs) => {
          
            if (docs == null) {
                // hashing the password
                argon2.hash(reqbody.password).then((hash) => {
                    reqbody.password = hash
                    console.log(hash)

                    const randomToken = async () => {
                        const buffer = await crypto.randomBytes(48);
                        return buffer.toString("hex");
                    };
                    // creating account token 
                    randomToken().then((token) => {
                        console.log(token)
                        reqbody.token = token
                        reqbody.isEmailVerified=false
                        // inserting the new User
                        db.db('myuserdb').collection('user').insertOne(reqbody).then(() => {
                            // sending email with verifiction token 
                            emailer(reqbody)
                            callback([{res:{code:200,msg:'you signed up succsefully'}},{accInfo:{firstname:reqbody.firstname,lastname:reqbody.lastname,token:reqbody.token}}])
                            db.close();
                            //err handler for db insert
                        }).catch((err) => { console.log(err) })

                        //err handler for random TOken
                    }).catch((err) => { console.log(err) })

                })
                    //err handelr for argon
                    .catch((err) => { })
            } else {
                callback([{res:{code:200,msg:'email already exists'}}])
                db.close()
                console.log('account found already in db')
            }

            //err handler for query
        }).catch((err) => { console.log(err) })


        //error handler for MC
    }).catch((err) => { console.log(err) })

}

}
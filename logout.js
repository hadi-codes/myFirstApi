const index = require('./index');
var userInfo = [];

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;





module.exports = {
    logout: async (token) => {
        let db, client,newToken;
        try {
            client = await MongoClient.connect(url, { useNewUrlParser: true });
            db = client.db('myuserdb');
            newToken= await require('crypto').randomBytes(48).toString('hex')
            await db.collection('user').updateOne({ 'token': `${token}` }, { $set: { 'token': `${newToken}` } });


        } finally {
            client.close();
        }
    }
}



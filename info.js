const index = require('./index');
var userInfo = [];

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;





module.exports = {
  getInfo: async (token) => {
    let db, client;
    try {
      client = await MongoClient.connect(url, { useNewUrlParser: true });
      db = client.db('myuserdb');

      docs = await db.collection('user').find({ 'token': `${token}` }).toArray();
      if (docs.length > 0) { delete docs[0].password; delete docs[0]._id }
      console.log(docs)
      return docs;

    } finally {
      client.close();
    }
  }
}
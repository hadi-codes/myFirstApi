const index = require('./index');
var userInfo=[];

// Mongodb db
const url = "";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;





module.exports = {
    getInfo: async (token) => {
      let db, client;
      try {
        client = await MongoClient.connect(url, { useNewUrlParser: true });
        db = client.db('myuserdb');
        
        docs =await db.collection('user').find({ 'token': `${token}` }).toArray();
         if(docs.length>0){delete docs[0].password;delete docs[0]._id}
         console.log(docs)
        return docs;
        
    } finally {
        client.close();
      }
    }
  }

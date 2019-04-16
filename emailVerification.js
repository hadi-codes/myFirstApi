const index = require('./index');
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/accActivated?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;


module.exports = {
    verifiy: (token, callback) => {

        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            console.log('1')
            db.db('accActivated').collection('user').findOne({ 'token': `${token}` }).then((docs) => {
                console.log('2')

                if (docs != null) {
                    callback(true)
                    console.log('3')
                    db.db('myuserdb').collection('user').updateOne({ 'email': `${docs.email}` }, { $set: { 'isActiveted': true } })
                } else {
                    callback(false)
                    console.log('no logs')
                    
                }
            }).then(() => {
                db.close()
            })


        }).catch((err) => {
            console.log(err)
        })


    }


}
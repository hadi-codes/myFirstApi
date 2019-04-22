const index = require('./index');
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/accActivated?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;
var doc
var isDoc;
module.exports = {
    verifiy: (token, callback) => {

        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            console.log('1')
            db.db('accActivated').collection('user').findOne({ 'token': `${token}` }).then((docs) => {
                console.log('2')
                
                if (docs != null) {
                    isDoc=true
                    doc=docs
                    callback(true)
                    console.log('3')
                    db.db('myuserdb').collection('user').updateOne({ 'email': `${docs.email}` }, { $set: { 'isActiveted': true } }).then(() => {
                        console.log('4')
                        db.db('accActivated').collection('user').deleteMany({email:docs.email,token:docs.token}).then(()=>{
                            console.log('5')
                            db.close();
                        })
                       })
                    .catch((err)=>{console.log})
                } else {
                    isDoc=false
                    callback(false)
                   
                    
                }
            }).then(()=>{
                console.log('5')
                db.close();
            }).catch((err)=>{console.log(err)})


        }).catch((err) => {
            console.log(err)
        })


    }


}
const express=require('express')
const router =express.Router({mergeParams:true});
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/accActivated?retryWrites=true";
const MongoClient = require('mongodb').MongoClient;

router.get('/',(req,res)=>{

        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            console.log('1')
            db.db('accActivated').collection('user').findOne({ 'token': `${req.params.token}` }).then((docs) => {
                console.log('2')
                
                if (docs != null) {
                  
                    
                    console.log('3')
                    db.db('myuserdb').collection('user').updateOne({ 'email': `${docs.email}` }, { $set: { 'isEmailVerified': true } }).then(() => {
                        console.log('4')
                        res.send(JSON.stringify({msg:'email is verified'}))
                        db.db('accActivated').collection('user').deleteMany({email:docs.email,token:docs.token}).then(()=>{
                            console.log('5')
                            db.close();
                        })
                       })
                    .catch((err)=>{console.log})
                } else {
                   res.send(JSON.stringify({msg:'error'}))
                   
                    db.close();
                }
            })


        }).catch((err) => {
            console.log(err)
            db.close();
        })


    })
    module.exports=router
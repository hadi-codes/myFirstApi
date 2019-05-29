const express=require('express')
const router =express.Router({mergeParams: true});
const crypto=require('crypto')

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/test?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;





router.get('/',(req,res)=>{

    const randomToken = async () => {
        const buffer = await crypto.randomBytes(48);
        return buffer.toString("hex");
    };

MongoClient.connect(url,{useNewUrlParser:true}).then((db)=>{

    db.db('myuserdb').collection('user').findOne({token:`${req.params.token}`}).then((doc)=>{
if(doc!=null){

randomToken().then((token)=>{
    console.log('new token '+ token)
    db.db('myuserdb').collection('user').updateOne({token:req.params.token},{$set:{token:token}}).catch((err)=>{console.log(err)})
    res.send(JSON.stringify({isOk:true}))
})

//err handler for randomToken
.catch((err)=>{console.log(err)})

}
//no token found
else{
res.send(JSON.stringify({isOk:false}))
}

    })
    //err handler for query
    .catch((err)=>{

    })



})




//err handler for MC
.catch((err)=>{
    console.log(err)
})


})
module.exports=router
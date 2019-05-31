const express=require('express')
const router =express.Router();
const Joi=require('@hapi/joi')
// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;


router.post('/',(req,res)=>{
const schema={email:Joi.string().email({minDomainAtoms:2}).required()}
    Joi.validate(req.body,schema,(err,result)=>{
        
        if(!err){
           
    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
        console.log(db)
        db.db('myuserdb').collection('user').findOne({ 'email': `${req.body.email}` }).then((docs) => {
            console.log(docs)
            if (docs != null) {
                // user did sign up


                //check if email verified
                if (docs.isEmailVerified == false) {
                    //get the token form accActivat DB
                    db.db('accActivated').collection('user').findOne({ 'email': `${req.body.email}` }).then((docs) => {
                        console.log(docs)

                        if(docs!=null){
                        sendEmail(docs)
                   }else{
                    res.send(JSON.stringify({msg:"pleaase contact support"}))
                   }
                        function sendEmail(mailTokenInfo) {
                            var sg = require('sendgrid')('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');

                            var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: {
                                    personalizations: [
                                        {
                                            to: [
                                                {
                                                    email: `${mailTokenInfo.email}`
                                                }
                                            ],
                                            subject: 'Activeion token'
                                        }
                                    ],
                                    from: {
                                        email: 'mail@xln.me'
                                    },
                                    content: [
                                        {
                                            type: 'text/plain',
                                            value: `hi here is your token   ${mailTokenInfo.token}`
                                                               }
                                    ]
                                }
                            });


                            // With promise
                            sg.API(request)
                                .then(function (response) {
                                    res.send({ code: 200, msg: 'Verification token sent to your email' })
                                    console.log(response.statusCode);
                                    console.log(response.body);
                                    console.log(response.headers);
                                })
                                .catch(function (error) {
                                    // error is an instance of SendGridError
                                    // The full response is attached to error.response
                                    console.log(error.response.statusCode);
                                });
                        }
                    })


                        //err handler for query 2 
                        .catch((err) => { console.log(err) })
                }

                //email is verified
                else {
                    res.send({ code: 200, msg: 'email is verified' })
                }


            }



            //email not found in db => didnnt sign up 
            else {
                res.send({ code: 200, msg: 'email not found' })


            }


        })



            //err handler for query
            .catch((err) => { console.log(err) })





    })








        // err handler for MC
        .catch((err) => { console.log(err) })


        }else{
            res.send(err)
        }
    })
})

        
      



module.exports=router



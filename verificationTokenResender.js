const index = require('./index')
// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;

module.exports = {
    reSendToken: (reqbody, callback) => {
        console.log(reqbody)
        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {
            console.log(db)
            db.db('myuserdb').collection('user').findOne({ 'email': `${reqbody.email}` }).then((docs) => {
                console.log(docs)
                if (docs != null) {
                    // user did sign up


                    //check if email verified
                    if (docs.isEmailVerified == false) {
                        //get the token form accActivat DB
                        db.db('accActivated').collection('user').findOne({ 'email': `${reqbody.email}` }).then((docs) => {
                            console.log(docs)


                            sendEmail(docs)
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
                                        callback({ code: 200, msg: 'Verification token sent to your email' })
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
                        callback({ code: 200, msg: 'email is verified' })
                    }


                }



                //email not found in db => didnnt sign up 
                else {
                    callback({ code: 200, msg: 'email not found' })


                }


            })



                //err handler for query
                .catch((err) => { console.log(err) })





        })








            // err handler for MC
            .catch((err) => { console.log(err) })


    }

    //check if email signed up
    //check if email already verified 
    //send token
}
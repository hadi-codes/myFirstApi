

const index = require('./index')
const argon2=require('argon2')
const crypto = require('crypto')
var mailTokenInfo = {
    email: '', token: ''

};

// Mongodb db
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/myuserdb?retryWrites=true";

// Create a new MongoClient
const MongoClient = require('mongodb').MongoClient;



module.exports = {

    resetPassToken: (reqBody, callback) => {
        function creatToken() {
            mailTokenInfo.email = reqBody.email

            mailTokenInfo.token = crypto.randomBytes(48).toString('hex')

        } creatToken()
        console.log(mailTokenInfo)
        console.log('1- runnin the function')
        MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {

            db.db('myuserdb').collection('user').findOne({ 'email': `${reqBody.email}` }).then((docs) => {


                if (docs != null) {
                    db.db('resetPassToken').collection('token').insertOne(mailTokenInfo).then(() => {
                        console.log('FINSHIED')
                        callback({ msg: 'sent an email with reset password link ' })
                        sendEmail(mailTokenInfo)
                    }).catch((err) => {
                        console.log(err)
                    })



                } else {
                    db.close();
                    console.log('no email found')
                    callback({ msg: 'no email found' })
                }






                //error handler for query

            }).catch((err) => {

                console.log(err)
            })





            //error handler for MC
        }).catch((err) => {
            console.log(err)
        })

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
                            subject: 'reset password link'
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


    }



}
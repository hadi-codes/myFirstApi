



const crypto = require('crypto')
var mailTokenInfo = {
  email: '', token: ''

};


var token;
const url = "mongodb+srv://boi:boiboi123@cluster0-5rtck.mongodb.net/accActivated?retryWrites=true";


const MongoClient = require('mongodb').MongoClient;



module.exports = {

  emailer: (reqBody) => {

    function creatToken() {
      mailTokenInfo.email = reqBody.email

      mailTokenInfo.token = crypto.randomBytes(48).toString('hex')

    } creatToken()

    MongoClient.connect(url, { useNewUrlParser: true }).then((db) => {

      // Add the token and the email to accActivation db
      db.db('accActivated').collection('user').insertOne(mailTokenInfo).then(() => {

        // Send email with activition token
        sendEmail(mailTokenInfo)
      }).then(() => {
        db.close();



      }).catch((err) => { console.log(err) })
    })

      .catch((err) => {
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



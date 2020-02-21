'use strict';

module.exports = function(Mail) {

    Mail.sendEmail = function(data,cb) {
        Mail.app.models.Email.send({
          to: data.to,
          subject: data.subject,
          text: data.text
          //html: 'my <em>html</em>'
        }, function(err, mail) {
          if(err){
            console.log("hay error :(")
            return cb(err);
          }
          else{
            console.log('email sent!');
            return cb(null,mail)
          }     
        });
      }

};

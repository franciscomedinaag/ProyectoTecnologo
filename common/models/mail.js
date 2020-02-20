'use strict';

module.exports = function(Mail) {

    Mail.sendEmail = function(cb) {
        Mail.app.models.Email.send({
          to: 'franciscomedinaag@gmail.com',
          from: 'franciscomedinaag@gmail.com',
          subject: 'sended via loopback 3.x',
          text: 'testing ISSUES'
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

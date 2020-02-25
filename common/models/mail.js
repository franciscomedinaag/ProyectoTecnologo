'use strict';

module.exports = function(Mail) {

    Mail.sendEmail = function(data,cb) {
      if(data.attachment==" "){
        var info={
        to: data.to,
        subject: data.subject,
        text: data.text
        }
      }
      else{
          var info={
          to: data.to,
          subject: data.subject,
          text: data.text,
          attachments:[
            {
              filename:`archivo${data.ext}`,
              content:data.attachment,
              encoding:'base64'
              //,contentType:''
            }
          ]
          //html: 'my <em>html</em>'
          }
      }
        Mail.app.models.Email.send(info , function(err, mail) {
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

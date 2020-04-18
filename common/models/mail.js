'use strict';

module.exports = function(Mail) {

    Mail.sendEmail = function(data,cb) {
      console.log("DATA", data)
      if(data.attachment==" "){
        var info={
        to: data.to,
        subject: data.subject,
        text: data.text
        }
      }
      else{
        if(data.ext==" "){
          var info={
            to: data.to,
            subject: data.subject,
            text: data.text,
            attachments:[
              {
                path:data.attachment
              }
            ]
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


      Mail.sendPoll = function(data,cb) {
        
          var info={
          to: data.to,
          subject: data.subject,
          html: data.html
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

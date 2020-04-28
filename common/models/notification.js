'use strict';
var pubsub = require('../helpers/pubsub.js');
var hostURL = "http://client.franciscomedinaag.now.sh/"

module.exports = function (Notification) {
   Notification.setSeen = function (ctx, id, callback) {
       var usuarioId = ctx.accessToken.userId;
       Notification.upsert({id,seen:new Date()},(err,res)=>{
           if(err) return callback(err,"hubo error al dejar en visto");
           return callback(null,res);
       });

   }
   Notification.setCero = function(num){
       if(num<10)
         return "0"+num;
       return num;
     }
   Notification.getById = function (ctx, id, callback) {
       var user_id = ctx.accessToken.userId;
       let where
       if (id) {
           where = {
               usuarioId: user_id,
               id: {
                   "lt": id
               }

           }
       } else {
           where = {
               usuarioId: user_id
           }
       }
       let limit = (id) ? 5 : 15
       Notification.find({
               where,
               limit: limit,
               order: "id DESC",
               // offset:offset
           },
           function (err, notifications) {
               if (err) {

                   return callback(err, "Error on notifications")
               }

               callback(null, notifications);
           })
   };



   Notification.setSingleNotification = function (id, notification) {
       notification["usuarioId"] = id;
       notification.link = hostURL + notification.link;
       Notification.create(notification,
           function (err, notification) {
               if (err) {

                   return "Error on notifications";
               }
               var socket = Notification.app.io;
               pubsub.publish(socket, {
                   model: 'notifications',
                   id: id,
                   data: notification,
                   method: 'getNew'
               });
               var user = Notification.app.models.Usuario;
               notification.link = hostURL + notification.link;
               user.findOne({where:{id},include:["pushTokens"]},(err,u)=>{
                   console.log("mis tockenstillos",u.id,"  ---",u.toJSON().pushTokens);
                   var PushTokens = Notification.app.models.PushTokens;
                   PushTokens.sendPushNotification(u.toJSON().pushTokens, notification, function (err, res) {
                       if (err) return err;                    
                    })
                })

           })
   };

   Notification.setByRoleNotification = function (Role, notification) {
       var user = Notification.app.models.Usuario;
       user.findByRole(Role, ["pushTokens"], function (err, users) {
           if (err) return err;
           console.log("cuantos usuarios?",users.length)

           users.forEach(u => {
               Notification.setSingleNotification(u.id, notification);
           });
        
           return users;
       })

   }
};
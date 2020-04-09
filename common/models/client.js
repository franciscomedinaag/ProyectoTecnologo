'use strict';

module.exports = function(Client) {

    Client.prototype.getClient = function(callback) {
        var id=this.id
        Client.findById(id,{include:['notas','tratos','mensajes']
        }, function(err,client){
            return callback(null,client);
        })
    };

    Client.checkIfExist = function(data, callback) {     
        var info={
            to:'xdookielol@gmail.com',
            subject:data.asunto,
            text:data.mensaje+'. Mandado por: '+data.nombre+", "+data.correo
        }
        Client.find({where:{email:data.correo,telefono:data.telefono}}, function(err, clients){
            if(err) return err

            if(clients[0]==null){
                console.log("registrar nuevo cliente y guardar registro de mensaje")
                var client={
                    telefono:data.telefono,
                    puesto:" ",
                    empresa:" ",
                    giro:" ",
                    estado:" ", 
                    email:data.correo,
                    frecuente:false,
                    negociacion:"Residencial",
                    nombre:data.nombre,
                    registro:data.fecha,
                    cantTratos:0,
                    real:0
                }
                Client.create(client,(err, newClient)=>{
                    if(err) return callback(null, err)
                    
                    var mensaje={
                        clientId:newClient.id,
                        mensaje:data.mensaje,
                        fecha:data.fecha
                    }
                    Client.app.models.Mensaje.create(mensaje,(err,created)=>{
                        if(err) return callback(null, err)

                        return callback(null, created)
                    })
                })
            }
            else{
                console.log("solo guardar registro de mensaje")
                var mensaje={
                    clientId:clients[0].id,
                    mensaje:data.mensaje,
                    fecha:data.fecha
                }
                Client.app.models.Mensaje.create(mensaje,(err,created)=>{
                    if(err) return callback(null, err)

                    return callback(null, created)
                })
            }
        })

        Client.app.models.Email.send(info , function(err, mail) {
            if(err){
              console.log("hay error :(")
              return cb(err);
            }
            else{
              console.log('email sent!');
              return cb(null,mail)
            }     
        });
    };

    Client.sendWhats=function(data, callback){

        const ACCOUNT_SID='AC0343095a980cf5658b7db6a8dd9e38f3'
        const AUTH_TOKEN='e7964159b032399f9ee3a78e96f149af'

        // const ACCOUNT_SID= process.env.TWILIO_ACCOUNT_SID
        // const AUTH_TOKEN=process.env.TWILIO_AUTH_TOKEN

        const client=require('twilio')(ACCOUNT_SID,AUTH_TOKEN);
        client.messages.create({
            to:data.to,
            from:'whatsapp:+14155238886',
            body:data.body
        }).then(message=>{
            return callback (null, message)
        }).catch( fail => {
            return callback(null,"Telefono no registrado")
        })    
    }

    Client.getFullClients = function(callback) {
        Client.find({include:['notas','tratos']}, 
        function(err,client){
            return callback(null,client);
        })
    };

};
'use strict';

module.exports = function(Client) {

    Client.prototype.getClient = function(callback) {
        var id=this.id
        Client.findById(id,{include:['notas','tratos']
        }, function(err,client){
            return callback(null,client);
        })
    };


    Client.sendWhats=function(data, callback){
        const client=require('twilio')('AC0343095a980cf5658b7db6a8dd9e38f3','0ed85b71010462689f3834d12b7354ce');
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
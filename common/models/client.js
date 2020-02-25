'use strict';

module.exports = function(Client) {

    Client.prototype.getClient = function(callback) {
        var id=this.id
        Client.findById(id,{include:['notas']
        }, function(err,client){
            return callback(null,client);
        })

    };

};
'use strict';

module.exports = function(Client) {

    Client.prototype.getClient = function(callback) {
        var id=this.id
        Client.findById(id,{include:['notas','tratos']
        }, function(err,client){
            return callback(null,client);
        })
    };

};
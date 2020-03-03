'use strict';

module.exports = function(Trato) {
    Trato.getTratos = function(callback) {
        Trato.find({include:['vendedor','cliente']}, function(err,tratos){
            return callback(null,tratos);
        })
    };

    Trato.getTratosUsuario = function(data,callback) {
        Trato.find({include:['vendedor','cliente'],where:{vendedorId:data.id}}, function(err,tratos){
            if(err) return callback(err)

            callback(null,tratos);
        })
    };

    Trato.prototype.getTrato = function(callback) {
        var id=this.id
        Trato.findById(id,{include:['vendedor','cliente']}, function(err,client){
            return callback(null,client);
        })
    };

};
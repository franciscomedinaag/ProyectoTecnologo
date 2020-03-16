'use strict';

module.exports = function(Trato) {
    Trato.getTratos = function(callback) {
        Trato.find({include:['vendedor','cliente','subtareas']}, function(err,tratos){
            return callback(null,tratos);
        })
    };


    Trato.getTratosUsuario = function(data,callback) {
        Trato.find({include:['vendedor','cliente','subtareas'],where:{vendedorId:data.id}}, function(err,tratos){
            if(err) return callback(err)

            callback(null,tratos);
        })
    };


    Trato.prototype.getTrato = function(callback) {
        var id=this.id
        Trato.findById(id,{include:['vendedor','cliente','archivos','subtareas']}, function(err,client){
            return callback(null,client);
        })
    };


    Trato.prototype.setFile=function(data, callback){
 
        Trato.app.models.Upload.newBase64File(data.file, function (err, newFile) {
            if (err) return callback(err,"error in newBase");
            else{ 
                data.file=newFile.URL         
                Trato.app.models.Archivo.create(data, (err, insertedFile)=> {
                    if(err) return callback (err);
                    else{
                        return callback(null, insertedFile);
                    }
                })
            }
            });

    };


};
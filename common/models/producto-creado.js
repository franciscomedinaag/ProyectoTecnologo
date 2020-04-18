'use strict';

module.exports = function(ProductoCreado) {

    ProductoCreado.getCreados = function(data,callback) {
        ProductoCreado.find({where:{cotizacionId:data.cotizacionId},
            include:['tablon','productoFijo','cotizacion']}, function(err,client){
            return callback(null,client);
        })
    };

};
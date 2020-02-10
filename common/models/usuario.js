'use strict';

module.exports = function(Usuario) {

    /**
    * asignar una nueva contraseña
    * @param {object} sendPass la nueva contraseña
    * @param {Function(Error, object)} callback
    */

    Usuario.setPass = function(sendPass, callback) {
         Usuario.setPassword(sendPass.id,sendPass.newPassword,function(err){
             if(err) return callback(err)

             callback(null,"succes")
         })
  };

};

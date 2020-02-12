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


  /**
   * changes the user's prifile image for a new one
   * @param {object} newImage new image in base 64
   * @param {Function(Error, object)} callback
   */
  
  Usuario.prototype.changeProfileImage = function (newImage, callback) {
    var Upload = app.models.Upload
    var actual = this;
    // TODO
    var newProfileImage = {
      encodedFileContainer: "profileImages",
      base64File: newImage.profileImage.base64ProfileImage,
      fileExtention: newImage.profileImage.base64ProfileImageExtention
    }
    Upload.replaceFileBase64File(actual.profileImageId, newProfileImage, function (err, res) {
      if (err) return callback(err);

      actual.profileImage(res);
      Usuario.upsert(actual, function (err, updatedUser) {
        if (err) return callback(err);
        Usuario.findOne({
          where: {
            id: updatedUser.id
          }
        }, function (err, userWR) {
          if (err) return callback(err);
          callback(null, userWR);
        });
      })
    })
  };

  
};

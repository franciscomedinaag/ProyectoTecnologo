'use strict';

module.exports = function(Mobiliario) {

    Mobiliario.prototype.setMobiliario=function(newImage, callback){
        let id=this.id
        Mobiliario.app.models.Upload.newBase64File(newImage, function (err, newImage) {
          if (err) return callback(err,"error in newBase");
          else{
           Mobiliario.findById(id, (err, mobiliario)=> {
            if(err) return callback (err);
            else{
              mobiliario.imagen=newImage.URL;
              Mobiliario.upsert(mobiliario, (err, newProductImage)=> {
                   if(err) return callback (err);
                   else{
                       return callback(null, newProductImage);
                   }
               })
                //return callback(null, user);
              }
           })       
          }
        });
    }


    Mobiliario.deleteFile=function(oldFile, callback){//recibe url
      var oldFileId=oldFile.id;
      var UploadedFiles = Mobiliario.app.models.UploadedFiles;
      // serach old file
      UploadedFiles.findOne({where:{URL:oldFileId}}, function(err, oldFile){
          if (err) return callback(err);

          // destroy old File
          UploadedFiles.destroyAll({where:{URL:oldFileId}},function(err){
              if (err) return callback(err);
              
              // destroy old file
              var container = oldFileId.split("/")[2];
              var oldFileName = oldFileId.split("/")[4];
              Mobiliario.app.models.Upload.removeFile(container, oldFileName, function(err, res){
                  if (err) return callback(err);
      
                  callback(null, res)
                  
              })
          });
      });
  }

};
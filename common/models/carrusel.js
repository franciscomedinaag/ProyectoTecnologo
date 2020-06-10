'use strict';

module.exports = function(Carrusel) {

    Carrusel.prototype.setCarrusel=function(newImage, callback){
        let id=this.id
        Carrusel.app.models.Upload.newBase64File(newImage, function (err, newImage) {
          if (err) return callback(err,"error in newBase");
          else{
           Carrusel.findById(id, (err, carrusel)=> {
            if(err) return callback (err);
            else{
              carrusel.imagen=newImage.URL;
              Carrusel.upsert(carrusel, (err, newProductImage)=> {
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


    Carrusel.deleteFile=function(oldFile, callback){//recibe url
      var oldFileId=oldFile.id;
      var UploadedFiles = Carrusel.app.models.UploadedFiles;
      // serach old file
      UploadedFiles.findOne({where:{URL:oldFileId}}, function(err, oldFile){
          if (err) return callback(err);

          // destroy old File
          UploadedFiles.destroyAll({where:{URL:oldFileId}},function(err){
              if (err) return callback(err);

              callback(null, res)
              
              // destroy old file
            //   var container = oldFileId.split("/")[2];
            //   var oldFileName = oldFileId.split("/")[4];
            //   Carrusel.app.models.Upload.removeFile(container, oldFileName, function(err, res){
            //       if (err) return callback(err);
      
                 
                  
            //   })
          });
      });
  }

};
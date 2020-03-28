'use strict';

module.exports = function(Sitio) {

    Sitio.prototype.setInicio=function(newImage, callback){
        let id=this.id
        Sitio.app.models.Upload.newBase64File(newImage, function (err, newImage) {
          if (err) return callback(err,"error in newBase");
          else{
           Sitio.findById(id, (err, sitio)=> {
            if(err) return callback (err);
            else{
              sitio.imagenInicio=newImage.URL;
              Sitio.upsert(sitio, (err, newProductImage)=> {
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

};
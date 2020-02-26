'use strict';

module.exports = function(Catalogo) {

    //funcion para subir la imagen  TODO copiarla de order profile

    Catalogo.setFile=function(data, callback){
 
        Catalogo.app.models.Upload.newBase64File(data.newFile, function (err, newFile) {
            if (err) return callback(err,"error in newBase");
            else{
                var newCat={
                    nombre:data.nombre,
                    file:newFile.URL
                }
                Catalogo.create(newCat, (err, insertedFile)=> {
                    if(err) return callback (err);
                    else{
                        return callback(null, insertedFile);
                    }
                })

            }
            });

    };


    Catalogo.deleteFile=function(oldFile, callback){
        var oldFileId=oldFile.id;
        var UploadedFiles = Catalogo.app.models.UploadedFiles;
        // serach old file
        UploadedFiles.findOne({where:{URL:oldFileId}}, function(err, oldFile){
            if (err) return callback(err);

            // destroy old File
            UploadedFiles.destroyAll({where:{URL:oldFileId}},function(err){
                if (err) return callback(err);
                
                // destroy old file
                var container = oldFileId.split("/")[2];
                var oldFileName = oldFileId.split("/")[4];
                Catalogo.app.models.Upload.removeFile(container, oldFileName, function(err, res){
                    if (err) return callback(err);
        
                    callback(null, res)
                    
                })
            });
        });
    }

}
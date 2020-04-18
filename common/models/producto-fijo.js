'use strict';

module.exports = function(ProductoFijo) {

    ProductoFijo.setProduct=function(data, callback){
        ProductoFijo.app.models.Upload.newBase64File(data.imagen, function (err, newFile) {
            if (err) return callback(err,"error in newBase");
            else{ 
                data.imagen=newFile.URL         
                ProductoFijo.create(data, (err, insertedFile)=> {
                    if(err) return callback (err);
                    else{
                        return callback(null, insertedFile);
                    }
                })
            }
            });

    };


    ProductoFijo.deleteFile=function(oldFile, callback){
        var oldFileId=oldFile.id;
        var UploadedFiles = ProductoFijo.app.models.UploadedFiles;
        // serach old file
        UploadedFiles.findOne({where:{URL:oldFileId}}, function(err, oldFile){
            if (err) return callback(err);

            // destroy old File
            UploadedFiles.destroyAll({where:{URL:oldFileId}},function(err){
                if (err) return callback(err);
                
                // destroy old file
                var container = oldFileId.split("/")[2];
                var oldFileName = oldFileId.split("/")[4];
                ProductoFijo.app.models.Upload.removeFile(container, oldFileName, function(err, res){
                    if (err) return callback(err);
        
                    callback(null, res)
                    
                })
            });
        });
    }

};
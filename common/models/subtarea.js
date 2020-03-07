'use strict';

module.exports = function(Subtarea) {

    Subtarea.getSubtareas= function(data,callback) {
        let vendedorId=data.vendedorId
        Subtarea.find({
            include:{
                relation:'trato',
                scope:{
                    include:{
                        relation:'cliente'
                    }
                }
            }
        }, function(err,Subtareas){
            if(err) return callback(err)

            let filtered=[]
            Subtareas.forEach(s => {         
                if(s.toJSON().trato.vendedorId==vendedorId){
                    filtered.push(s)
                }
            });  
             
            callback(null,filtered);
        })
    };

};
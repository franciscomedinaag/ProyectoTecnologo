'use strict';

module.exports = function(Subtarea) {

    Subtarea.getSubtareas= function(data,callback) {
        let vendedorId=data.vendedorId
        Subtarea.find({order: 'fechaFin ASC',
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
            Subtareas.forEach((s,index) => {      
                if(s.toJSON().trato!=undefined){  
                let v=s.toJSON().trato.vendedorId
                if(v==vendedorId){
                    filtered.push(s)
                }
                }
            });  
             
            callback(null,filtered);
        })
    };


    Subtarea.getSubtareasCoti= function(callback) {
        Subtarea.find({include:['subtarea','trato'],where:{categoriaId:5},order:'tratoId DESC'}, function(err,subtareas){
            if(err) console.log(err) 
             
            callback(null,subtareas);
        })
    };

};
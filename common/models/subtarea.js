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
                console.log("ola",index,": ",s.toJSON().trato.vendedorId) 
                let v=s.toJSON().trato.vendedorId
                if(v==vendedorId){
                    filtered.push(s)
                }
                }
            });  
             
            callback(null,filtered);
        })
    };

};
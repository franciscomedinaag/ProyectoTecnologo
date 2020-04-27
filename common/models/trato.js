'use strict';

module.exports = function(Trato) {
    Trato.getTratos = function(callback) {
        Trato.find({include:['vendedor','cliente','subtareas']}, function(err,tratos){
            return callback(null,tratos);
        })
    };


    Trato.getTratosUsuario = function(data,callback) {
        Trato.find({include:['vendedor','cliente','subtareas'],where:{vendedorId:data.id}}, function(err,tratos){
            if(err) return callback(err)

            callback(null,tratos);
        })
    };

    Trato.getTratosEstado = function(data,callback) {
        Trato.find({include:['vendedor','cliente','subtareas'],where:{estado:data.estado}}, function(err,tratos){
            if(err) return callback(err)

            callback(null,tratos);
        })
    };

    Trato.prototype.getTrato = function(callback) {
        Trato.findById(this.id,{include:['vendedor','cliente','subtareas']}, function(err,trato){
            if(err) return callback(err)

            callback(null,trato);
        })
    };

    Trato.prototype.getSold= function(callback) {
        Trato.findById(this.id,{include:{relation:'subtareas',
            scope:{
                include:{
                    relation:'subtarea'
                }
            }
        }
        }, function(err,trato){
            if(err) return callback(err)

            let data={
                vendido:0
            }
            trato.toJSON().subtareas.forEach(sub=>{      
                if(sub.categoriaId==5 && sub.estado==1){
                    if(sub.subtarea.definitivo){
                        data.vendido=sub.subtarea.total
                    }
                }   
            })
            callback(null,data);
        })
    };

    Trato.generateTotal = function(data,callback) {
            let vendido=0

                Trato.find(
                    {include:{relation:'subtareas',
                    scope:{
                        include:{
                            relation:'subtarea'
                        }
                    }},where:{vendedorId:data.vendedorId}}, function(err,allTratos){
                    
                    if(err) return callback(err)
    
                    let allArr=allTratos
                    allArr.forEach(trato => {
                        let stringInicio=trato.fechaInicio.toISOString()
                        let stringFin=trato.fechaFin.toISOString()
                        let mesInicio=stringInicio.split('T')[0].split('-')[1]
                        let mesFin=stringFin.split('T')[0].split('-')[1]
    
                        let añoInicio = stringInicio.split('T')[0].split('-')[0]
                        let añoFin = stringFin.split('T')[0].split('-')[0]
    
                        if((mesFin==data.mes1 || mesFin==data.mes2) && (añoFin==data.anio) ){
                            if(trato.estado==1){  
                                trato.toJSON().subtareas.forEach(sub=>{
                                  
                                    if(sub.categoriaId==5 && sub.estado==1){
                                        if(sub.subtarea.definitivo){
                                            vendido=vendido+sub.subtarea.total
                                        }
                                    }   
                                })
                            }
                        }
                    });
    
                    return callback(null, vendido)
                  
                })
    };

    Trato.countSubs = function(data,callback) {
        let subs={realizadas:0,treinta:false,cuarenta:false}
        let perd=0
        let totalSubs=[]
        let Etotal=0
        let Etratos=0
        let tratosPerdidos=0
            Trato.find(
                {include:{relation:'subtareas',
                scope:{
                    include:{
                        relation:'subtarea'
                    }
                }},where:{vendedorId:data.vendedorId}}, function(err,allTratos){
                
                if(err) return callback(err)

                let allArr=allTratos
                allArr.forEach(trato => {
                    let stringInicio=trato.fechaInicio.toISOString()
                    let stringFin=trato.fechaFin.toISOString()
                    let mesInicio=stringInicio.split('T')[0].split('-')[1]
                    let mesFin=stringFin.split('T')[0].split('-')[1]

                    let añoInicio = stringInicio.split('T')[0].split('-')[0]
                    let añoFin = stringFin.split('T')[0].split('-')[0]

                    if((mesFin==data.mes1 || mesFin==data.mes2) && (añoFin==data.anio) ){
                        Etratos+=1
                        if(trato.estado==2){
                            tratosPerdidos+=1
                        }
                        totalSubs.push(trato.toJSON().subtareas.length)
                        if(trato.estado==1){  
                            trato.toJSON().subtareas.forEach(sub=>{
                                if(sub.estado==1){
                                    subs.realizadas++
                                }   
                                if(sub.estado==2){
                                    perd+=1
                                }
                            })
                        }
                    }
                });

                totalSubs.forEach(t => {
                    Etotal+=t
                });
                if((perd*100/Etotal) >=30){
                    subs.treinta=true
                }
                if((tratosPerdidos*100/Etratos) >=30){
                    subs.cuarenta=true
                }
                return callback(null, subs)
              
            })
};

    Trato.prototype.getTrato = function(callback) {
        var id=this.id
        Trato.findById(id,{include:['vendedor','cliente','archivos','subtareas']}, function(err,client){
            return callback(null,client);
        })
    };


    Trato.prototype.setFile=function(data, callback){
 
        Trato.app.models.Upload.newBase64File(data.file, function (err, newFile) {
            if (err) return callback(err,"error in newBase");
            else{ 
                data.file=newFile.URL         
                Trato.app.models.Archivo.create(data, (err, insertedFile)=> {
                    if(err) return callback (err);
                    else{
                        return callback(null, insertedFile);
                    }
                })
            }
            });

    };


};
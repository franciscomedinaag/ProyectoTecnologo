module.exports = function(Report) {
    var http = require('http');
    var schedule = require('node-schedule');
    console.log("listening to create the report")
    
    // var j = schedule.scheduleJob('* * 29 * *', function(){ cada dia 29 del mes}
    var j = schedule.scheduleJob('*/1 * * * *', function(){ 
        var hoy=new Date().toLocaleDateString();
        hoy=hoy.split('-');
        if(hoy[0].length<2){
            hoy[0]='0'+hoy[0]
        }
        if(hoy[1].length<2){
            hoy[1]='0'+hoy[1]
        }
        let hoyString=hoy[0]+'-'+hoy[1]+'-'+hoy[2]
        console.log(hoy)
        var bimestre="NA"
        let mes1=" "
        let mes2=" "

        switch(hoy[1]){
            case '01':{
                bimestre="enero/febrero"
                mes1="01"
                mes2="02"
                break;
            }
            case '03':{
                bimestre="marzo/abril"
                mes1="03"
                mes2="04"
                break;
            }
            case '05':{
                bimestre="mayo/junio"
                mes1="05"
                mes2="06"
                break;
            }
            case '07':{
                bimestre="julio/agosto"
                mes1="07"
                mes2="08"
                break;
            }
            case '09':{
                bimestre="septiembre/octubre"
                mes1="09"
                mes2="10"
                break;
            }
            case '11':{
                bimestre="noviembre/diciembre"
                mes1="11"
                mes2="12"
                break;
            }
            default:{
                bimestre="NA"
                break;
            }
        }

            if(bimestre!="NA"){
                Report.models.Usuario.find({where:{active:true,realm:'user'}}, function(err,usuarios){
                    if(err) return callback(err)

                    let usuariosArr=usuarios
                    usuariosArr.forEach(user => {
                        let informe={
                            abiertos:0,
                            cerrados:0,
                            vencidos:0,
                            total:0,
                            intentos:0,
                            clientes:0,
                            tareas1:0,
                            tareas2:0,
                            vendedorId:user.id,
                            bimestre:bimestre,
                            anio:hoy[0]
                        }
                        let clientes=[]

                        Report.models.Trato.find(
                            {include:{relation:'subtareas',
                            scope:{
                                include:{
                                    relation:'subtarea'
                                }
                            }},where:{vendedorId:user.id}}, function(err,allTratos){
                            
                            if(err) return callback(err)

                            let allArr=allTratos
                            allArr.forEach(trato => {
                                let stringInicio=trato.fechaInicio.toISOString()
                                let stringFin=trato.fechaFin.toISOString()
                                let mesInicio=stringInicio.split('T')[0].split('-')[1]
                                let mesFin=stringFin.split('T')[0].split('-')[1]

                                let añoInicio = stringInicio.split('T')[0].split('-')[0]
                                let añoFin = stringFin.split('T')[0].split('-')[0]

                                if((mesInicio==mes1 || mesInicio==mes2) && (añoInicio==informe.anio) ){informe.abiertos++}

                                if((mesFin==mes1 || mesFin==mes2) && (añoFin==informe.anio) ){
                                    if(trato.estado==1){  
                                        informe.cerrados++
                                        trato.toJSON().subtareas.forEach(sub=>{
                                            if(sub.categoriaId==5){
                                                informe.intentos++
                                            }
                                            if(sub.categoriaId==5 && sub.estado==1){
                                                if(sub.subtarea.definitivo){
                                                    informe.total=informe.total+sub.subtarea.total
                                                }
                                            }
                                            if(sub.estado==1){informe.tareas1++}
                                            if(sub.estado==2){informe.tareas2++}
                                        })
                                        clientes.push(trato.clientId)
                                    }
                                    else if(trato.estado==2){
                                        trato.toJSON().subtareas.forEach(sub=>{
                                            if(sub.estado==1){informe.tareas1++}
                                            if(sub.estado==2){informe.tareas2++}
                                        })
                                        informe.vencidos++}
                                }
                            });

                            informe.clientes=removeDuplicate(clientes).length                   
                            informe.intentos=informe.intentos/informe.cerrados
                            console.log("el informe de ", user.username, "dice: ", informe)
                            // Report.models.Informe.create(informe, function(err,informe){
                            //     if(err) return err

                            //     console.log("created for: ", informe.vendedorId)
                            // })

                        })
                    });
                })
            }
        
   });


   function removeDuplicate(arr) {        
    var c;        
    var len = arr.length;        
    var result = [];        
    var obj = {};                
    for (c = 0; c<len; c++)  {            
       obj[arr[c]] = 0;        
    }  
    for (c in obj) {            
       result.push(c);        
    }            
    return result;      
 }              

};
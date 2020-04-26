module.exports = function(Report) {
    var http = require('http');
    var schedule = require('node-schedule');
    console.log("listening to create the report")
    var hoy=new Date().toLocaleDateString();
    var hoyString;
    let mes1=" "
    let mes2=" "
    // var j = schedule.scheduleJob('* * 29 * *', function(){ cada dia 29 del mes}
    var j = schedule.scheduleJob('*/1 * * * *', function(){ 
        hoy=new Date().toLocaleDateString();
        hoy=hoy.split('-');
        if(hoy[0].length<2){
            hoy[0]='0'+hoy[0]
        }
        if(hoy[1].length<2){
            hoy[1]='0'+hoy[1]
        }
        hoyString=hoy[0]+'-'+hoy[1]+'-'+hoy[2]
        // console.log(hoy)
        var bimestre="NA"

        switch(hoy[1]){
            case '01':{
                bimestre="enero/febrero"
                mes1="01"
                mes2="02"
                break;
            }
            case '04':{
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
                generateUserReport(bimestre)
                generateAdminReport(bimestre)
                // generateAdminNoti(bimestre)
            }
        
   });

   function generateAdminNoti(bimestre){
    Report.models.Usuario.find({where:{active:true,realm:'admin'}}, function(err,usuarios){
        if(err) return callback(err)

        let count=0
        let noti={
            title:"",
            content:"/usuarios",
            timestamp:new Date().toISOString(),
            seen:0,
            usuarioId:usuarios[0].id
        }
        let noti2={
            title:"",
            content:"/usuarios",
            timestamp:new Date().toISOString(),
            seen:0,
            usuarioId:usuarios[0].id
        }
        let noti3={
            title:"",
            content:"/usuarios",
            timestamp:new Date().toISOString(),
            seen:0,
            usuarioId:usuarios[0].id
        }
        let vens=[]
        let treintas=[]
        /*
            el que mas vendio
            el que menos vendio
            quien cotizo menos que la meta
        */
       Report.models.Usuario.find({where:{realm:'user',active:true}}, function(err, vendedores){
        if(err) return callback(err)

        vens=vendedores
        vens.forEach((v,index) => {
            let data={
                mes1:mes1,
                mes2:mes2,
                anio:hoy[0],
                vendedorId:v.id
              }
            
              Report.models.Trato.generateTotal(data, function(err,vendido){
                  if(err) return callback(err)

                  v.vendido=vendido
                  vens.sort((a, b) => (a.vendido < b.vendido) ? 1 : -1)
                  count++

                  if(count==vens.length){
                    noti.title+=`El usuario que vendio menos ${vens[vens.length-1].username} | El que vendió más fue ${vens[0].username} | Los que vendieron menos de la meta: `
                    
                    Report.models.Meta.find({},function(err,metas){
                        let meta=metas[0].cantidad
                        vens.forEach(v => {
                            if(v.vendido<meta){
                                noti.title+=v.username+" ,"
                            }
                        });
                        console.log("send noti", noti)
                        count=0
                        Report.models.Notification.create(noti, function(err,informe){
                             if(err) return err
                
                             console.log("noti1 created")
                             vens.forEach((v,index) => {
                                let data2={
                                    mes1:mes1,
                                    mes2:mes2,
                                    anio:hoy[0],
                                    vendedorId:v.id
                                  }
                            
                                 Report.models.Trato.countSubs(data2, function(err, subs){
                                     if(err) return callback(null,err)

                                     v.realizadas=subs.realizadas
                                     vens.sort((a, b) => (a.realizadas < b.realizadas) ? 1 : -1)
                                     count++
                                     if(subs.treinta){
                                         treintas.push(v.username)
                                     }
                                     if(count==vens.length){
                                        noti2.title+=`El usuario que realizo menos tareas fue ${vens[vens.length-1].username} | | El que realizó más fue ${vens[0].username}`
                                        Report.models.Notification.create(noti2, function(err, creada){
                                            if (err) return err

                                            console.log("noti2 created")
                                            if(treintas.length){
                                                noti3.title="Usuarios con indice de subtareas perdidas mayor al 30%: "
                                                treintas.forEach(t => {
                                                    noti3.title+=t+=" | "
                                                });
                                                Report.models.Notification.create(noti3, function(err, creada){
                                                    if(err) return err

                                                    console.log("noti3 created")
                                                })
                                            }
                                        })
                                    }
                                 })
                             });
                        })
                    })

                  }
              })
        });
        })     
    })
   }

   function generateAdminReport(bimestre){
    Report.models.Usuario.find({where:{active:true,realm:'admin'}}, function(err,usuarios){
        if(err) return callback(err)

        let informe={
            abiertos:0,
            cerrados:0,
            vencidos:0,
            finales:[],
            total:0,
            bimestre:bimestre,
            anio:hoy[0]
        }
        
        Report.models.Trato.find({include:{relation:'subtareas',
        scope:{
            include:{
                relation:'subtarea'
            }
        }
        }}, function(err,allTratos){
            if(err) return callback(err)

            var tratos=[]
            tratos=allTratos
            tratos.forEach(trato=>{
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
                            if(sub.categoriaId==5 && sub.estado==1){
                                if(sub.subtarea.definitivo){
                                    informe.total=informe.total+sub.subtarea.total
                                }
                            }
                        })
                    }
                    else if(trato.estado==2){
                        informe.vencidos++
                        if(trato.toJSON().subtareas[trato.toJSON().subtareas.length-1]){
                            informe.finales.push(trato.toJSON().subtareas[trato.toJSON().subtareas.length-1].categoriaId)                  
                        }
                    }
                }
            })
            // console.log("INFORME DEL ADMIN: ", informe)
            // Report.models.InformeAdmin.create(informe, function(err,informe){
            //         if(err) return err

            //         console.log("created for admin:  ", informe.total)
            //     })
        })
    })
   }

   function generateUserReport(bimestre){
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
                // console.log("el informe de ", user.username, "dice: ", informe)
                // Report.models.Informe.create(informe, function(err,informe){
                //     if(err) return err

                //     console.log("created for: ", informe.vendedorId)
                // })

            })
        });
    })
   }

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
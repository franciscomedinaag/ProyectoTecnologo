module.exports = function(Poll) {
    var http = require('http');
    var schedule = require('node-schedule');
    console.log("listening to send a poll")
    var hoy=new Date().toLocaleDateString();
    var hoyString;
  
    var j = schedule.scheduleJob('*/1 * * * *', function(){ 
        hoy=new Date().toLocaleDateString();
        hoy=hoy.split('/');
        if(hoy[0].length<2){
            hoy[0]='0'+hoy[0]
        }
        if(hoy[1].length<2){
            hoy[1]='0'+hoy[1]
        }
        //hoyString=hoy[2]+'-'+hoy[1]+'-'+hoy[0]
        hoyString=hoy[1]+'-'+hoy[0]+'-'+hoy[2]

        console.log("HOY", hoyString)

        // Poll.models.Cerrado.find({}, function(err,encuestas){
        //     if(err) return callback(null,err)

        //     let encuestasArr=encuestas
        //     if(encuestasArr.length>0){
        //         encuestasArr.forEach(e => {
        //             if(e.fechaEnvio==hoyString){
        //                 Poll.models.Trato.findById(e.tratoId,{include:['cliente']},function(err,trato){
        //                     if(err) return callback(null,err)
    
        //                     let data={
        //                         to: trato.toJSON().cliente.email,
        //                         subject: "Encuesta Satisfacción del Cliente",
        //                         html:`Buen día, por parte de COR muebles te invitamos a llenar esta <a href="client.franciscomedinaag.now.sh/cerrado/${trato.id}">encuesta</a> para mejorar nuestro servicio ¡Gracias!`
        //                     }
        //                     console.log("DATA", data)
    
        //                     Poll.models.Email.send(data , function(err, mail) {
        //                         if(err){
        //                           console.log("hay error :(")
        //                           return callback(null,err);
        //                         }
        //                         else{
        //                           console.log('email sent!');
        //                           return callback(null,mail)
        //                         }     
        //                       });
        //                 })
        //             }
        //         });

        //     }
        // })    
   });

};
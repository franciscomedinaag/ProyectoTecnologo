module.exports = function(Schedule) {
    var http = require('http');
    var schedule = require('node-schedule');
    console.log("listening to send the twilio message")
    
    var j = schedule.scheduleJob('*/1 * * * *', function(){ 
        var body="Tareas agendadas para hoy:"
  
        var hoy=new Date().toLocaleDateString();
        
        console.log("hoy en server", hoy)

        hoy=hoy.split('/');
        if(hoy[0].length<2){
            hoy[0]='0'+hoy[0]
        }
        if(hoy[1].length<2){
            hoy[1]='0'+hoy[1]
        }
        let hoyString=hoy[0]+'-'+hoy[1]+'-'+hoy[2]
        hoy=hoyString
        var hoyLocale= new Date(hoy).toISOString();
        hoyLocale=hoyLocale.split('T')

        //  Schedule.models.Usuario.findById('8',{},function(err,user){
        //      if(err) return callback(err)

        //      Schedule.models.Subtarea.find({where: {vendedorId:user.id}},function(err, subtareas){
        //          if(err) return callback(err)

        //          var subs=subtareas
        //          subs.forEach(s => {

        //              if(s.estado==0){
        //                  if(s.fechaFin.indexOf(hoyLocale[0]) != -1){
        //                  body=body+s.titulo+' / '
        //              }
        //          }
        //          });

        //          var data={
        //              to:'whatsapp:+5213315711601',
        //              body:body
        //          }

        //          Schedule.models.Client.sendWhats(data, function(err, res){
        //              if(err){
        //                  console.log("hay error loko")
        //                  return callback(err)
        //              }
        //              else{
        //                  console.log('whats sent!');
        //                  return cb(null,mail)
        //              }
        //          })
        //      })    
        // })
   });

};
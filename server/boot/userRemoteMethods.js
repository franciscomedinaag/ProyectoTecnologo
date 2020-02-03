// module.exports = function(app) {
//     const User = app.models.User;
//     /**
//  * get todos productos
//  * @param {Function(Error, object)} callback
//  */
  
//     User.getUsers = function(callback) {
//         console.log("estoy en la funcion")
//         User.find({},
//             (err,users)=>{
//                 console.log("hola", users) 
//              });
//     };
  
//     User.getUsers(
//       'getUsers', {
//         returns: {
//           arg: 'users',
//           type: 'object'
//         }
//       }
//     );
//   };
  
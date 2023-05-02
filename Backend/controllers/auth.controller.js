'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
// naming <method>_fileWhereItCameFrom.
import {
    getSingleUserByAuthID as getSingleUserAuthID_service,
} from '../services/user.service.js'

let verifyUserIsAdmin = function(request, response) {
    getSingleUserAuthID_service(request, function(error, user) {
        if (error){
            response(null, false);
        }else{
            if(user && user.hasOwnProperty('permissions') && user.permissions=="admin"){ // request.uid == user.uid
                response(null, true);
            }else{
                response(null, false);
            }
        }
    });
};

//Kad negaletum kaip kitas user order
let verifyUserIsUser = function(request, response) {
    console.log(request.authid)
    getSingleUserAuthID_service(request.authid, function(error, user) {
        if (error){
            response(null, false);
        }else{
            if(request.authid==user.authid && request.uid==user.uid && request.email==user.email){
                response(null, true);
            }else{
                response(null, false);
            }
        }
    });
};

export {verifyUserIsAdmin,verifyUserIsUser};
'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
//Thus its best when you are importing to say "as SomeUniqueName". I call it usually <method>_fileWhereItCameFrom.
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
    getSingleUserAuthID_service(request, function(error, user) {
        if (error){
            response(null, false);
        }else{
            if(request==user.uid){
                response(null, true);
            }else{
                response(null, false);
            }
        }
    });
};

export {verifyUserIsAdmin,verifyUserIsUser};
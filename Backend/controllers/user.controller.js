'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
//Thus its best when you are importing to say "as SomeUniqueName". I call it usually <method>_fileWhereItCameFrom.
import { getUsers as getUsers_service,
    getSingleUserByUID as getSingleUserUID_service,
    getSingleUserByAuthID as getSingleUserAuthID_service,
    addUser as addUser_service,
    editUser as editUser_service,
    deleteUser as deleteUser_service,
} from '../services/user.service.js'

let getUsers = function(request, response) {
    getUsers_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let getSingleUserUID = function(request, response) {
    getSingleUserUID_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let getSingleUserByAuthID = function(request, response) {
    getSingleUserAuthID_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let addUser = function(request, response) {
    addUser_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let editUser = function(request, response) {
    editUser_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let deleteUser = function(request, response) {
    deleteUser_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};

export {getUsers,getSingleUserUID, getSingleUserByAuthID, addUser, editUser, deleteUser};
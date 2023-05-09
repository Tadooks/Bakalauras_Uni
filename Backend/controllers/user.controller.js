'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
// naming <method>_fileWhereItCameFrom.
import { getUsers as getUsers_service,
    getSingleUserByUID as getSingleUserUID_service,
    getSingleUserByAuthID as getSingleUserAuthID_service,
    addUser as addUser_service,
    editUser as editUser_service,
    deleteUser as deleteUser_service,
} from '../services/user.service.js'

let getUsers = function(request, response) {
    getUsers_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};


let getSingleUserUID = function(request, response) {
    getSingleUserUID_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};


let getSingleUserByAuthID = function(request, response) {
    getSingleUserAuthID_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};


let addUser = function(request, response) {
    addUser_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};


let editUser = function(request, response) {
    editUser_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};


let deleteUser = function(request, response) {
    deleteUser_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};

export {getUsers,getSingleUserUID, getSingleUserByAuthID, addUser, editUser, deleteUser};
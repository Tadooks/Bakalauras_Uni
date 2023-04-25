'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
//Thus its best when you are importing to say "as SomeUniqueName". I call it usually <method>_fileWhereItCameFrom.
import { getRequests as getRequests_service,
    getSingleRequest as getSingleRequest_service,
    addRequest as addRequest_service,
    editRequest as editRequest_service,
    deleteRequest as deleteRequest_service,
} from '../services/request.service.js'

let getRequests = function(request, response) {
    getRequests_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let getSingleRequest = function(request, response) {
    getSingleRequest_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let addRequest = function(request, response) {
    addRequest_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let editRequest = function(request, response) {
    editRequest_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let deleteRequest = function(request, response) {
    deleteRequest_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};

export {getRequests,getSingleRequest, addRequest, editRequest, deleteRequest};
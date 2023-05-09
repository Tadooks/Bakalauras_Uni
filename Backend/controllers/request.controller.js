'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
// naming <method>_fileWhereItCameFrom.
import { getRequests as getRequests_service,
    addRequest as addRequest_service,
    deleteRequest as deleteRequest_service,
} from '../services/request.service.js'

let getRequests = function(request, response) {
    getRequests_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};



let addRequest = function(request, response) {
    addRequest_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};



let deleteRequest = function(request, response) {
    deleteRequest_service(request, function(error, data) {
        if (error){
            response(error, null);
        }else{
            response(null, data);
        }
    });
};

export {getRequests, addRequest, deleteRequest};




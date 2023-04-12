'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
//Thus its best when you are importing to say "as SomeUniqueName". I call it usually <method>_fileWhereItCameFrom.
import { getProducts as getProducts_service,
    getSingleProduct as getSingleProduct_service,
    addProduct as addProduct_service,
    editProduct as editProduct_service,
    deleteProduct as deleteProduct_service,
} from '../services/product.service.js'

let getProducts = function(request, response) {
    getProducts_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let getSingleProduct = function(request, response) {
    getSingleProduct_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let addProduct = function(request, response) {
    addProduct_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let editProduct = function(request, response) {
    editProduct_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let deleteProduct = function(request, response) {
    deleteProduct_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};

export {getProducts,getSingleProduct, addProduct, editProduct, deleteProduct};
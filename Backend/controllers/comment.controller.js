'use strict';
// import method but IT HAS TO BE UNIQUELY NAMED. Otherwise "export" does not know if you mean "let" or import.
//Thus its best when you are importing to say "as SomeUniqueName". I call it usually <method>_fileWhereItCameFrom.
import { add_comment as add_comment_service, get_all_comments as get_all_comments_service} from '../services/comment.service.js'

let addComment = function(request, response) {
    add_comment_service(request, function(error, comment) {
        if (error){
            response(error, null);
        }else{
            response(null, comment);
        }
    });
};


let getAllCommentsOnSong = function(request, response) {
    get_all_comments_service(request, function(error, allComments) {
        if (error){
            response(error, null);
        }else{
            response(null, allComments);
        }
    });
};


export {addComment, getAllCommentsOnSong};
'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

//This could be upgraded with quaries. Filter on username.
//Or use the excuse that this will be filtered on UID. Your choice.
let get_all_comments =  async function(songID, result) {
    //We get a database reference (is DB folder. FirebaseDB exportina reference to itself)
    const dbRef = ref(database);
    //We say "Get" to get data. And then we call "Child" to get a child from reference.
    //We will passs database reference into child. As well as the URL we will use to get data from.
    // Once we get the data we say "Then" to do something with said data.
    // We will then assign the name "Snapshot" to this data.
    get(child(dbRef, `/Comments/`+songID)).then((snapshot) => {
        //We call "exists" function on snapshot. This will check if we got any data at all.
        //If we got any data we move forward.
        if (snapshot.exists()) {
            
            const arrayOfComments = [];

            //We call "Snapshot.val" to get data.
            // Do note: Firebase has 2 types of data. If you name it {i , 2 , 3} it will
            // Automatically convert it to an array. So you can use for each.
            //However, if you do insertions or smth. It will give you an unique ID or if you skip 
            // A value. It will give you no longer an array. This means that For each suddenly doesnt work.
            //To counter this. We basically convert it to Object and then say "Entries".
            // Thus is best to Assume its all objects and NEVER arrays since the risk of crashing
            // Is too high if you make a very simple mistake.
            //(jeigu vidury istrintu value or smth kad nebutu eror)
            const objectArray = Object.entries( snapshot.val());

            objectArray.forEach(([key, value]) => {
                arrayOfComments.push({
                    id: key,
                    name: value.Name,
                    rating: value.Rating,
                    comment: value.Comment
                });
            });
            result(null, arrayOfComments);
        } else {
            //If we dont get any data. Thus, we can assume that an error accured (Misstypo or smth.)
            //Then we shall throw out an error message
            console.log("No data available");
            result("No data available", null);
        }
        //If database crashes. We throw out error.
        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let add_comment =  async function(comment, result) {
    const dbRef = ref(database);

    if(comment != null){
        
        //This will give you a unique ID that will be assigned when you will insert something.
        const newPostKey = push(child(dbRef, '/Comments/' + comment.songID)).key;

        const postData = {
            songID: comment.songID,
            uid: newPostKey,
            Name: comment.name,
            Rating: comment.rating,
            Comment: comment.comment
        };
        
        //We will create an object of updates
        const updates = {};
        //In this specific object. We will assign a URL inside [] and then attach the object we want to add.
        updates['/Comments/'+ comment.songID+ '/'+ newPostKey] = postData;
        //We call "Update" functions from firebase and pass database reference and an array of updates
        update(dbRef, updates);
        //Pass updated comment to frontend.
        result(null, {
            songID: comment.songID,
            id: newPostKey,
            name: comment.name,
            rating: comment.rating,
            comment: comment.comment
        });

    }else{
        result("Bad comment", null);
    }
};

export {get_all_comments, add_comment};
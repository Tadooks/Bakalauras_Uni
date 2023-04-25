'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

//https://firebase.google.com/docs

let getRequests =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Requests/`)).then((snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfRequests = [];

            const objectArray = Object.entries( snapshot.val());
            
            objectArray.forEach(([key, value]) => {
                arrayOfRequests.push({
                    uid: key,
                    id: value.id,
                    name: value.name,
                    desc: value.desc,
                    price: value.price,
                    image: value.image,
                    audio: value.audio,
                    download: value.download,
                    type: value.type
                });
            });
            result(null, arrayOfRequests);
        } else {

            console.log("No data available");
            result(null, []);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let getSingleRequest =  async function(uid, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Requests/`+uid)).then((snapshot) => {
 
        if (snapshot.exists()) {
            result(null, snapshot.val());
        } else {

            console.log("No data available");
            result(null, {error: "No data available"});
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let addRequest =  async function(request, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(request != null){
        
        //we create a new key
        const newPostKey = push(child(dbRef, '/Requests/' + request.uid)).key;

        const postData = {
            uid: newPostKey,
            id: request.id,
            name: request.name,
            desc: request.desc,
            price: request.price,
            image: request.image,
            audio: request.audio,
            download: request.download,
            type: request.type
        };
    
        const updates = {};

        updates['/Requests/'+ newPostKey] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Request", null);
    }
};

let editRequest =  async function(request, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(request.request != null){
        
        //we reuse key

        const postData = {
            uid: request.uid,
            id: request.request.id,
            name: request.request.name,
            desc: request.request.desc,
            price: request.request.price,
            image: request.request.image,
            audio: request.request.audio,
            download: request.request.download,
            type: request.request.type
        };
    
        const updates = {};

        updates['/Requests/'+ request.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Request", null);
    }
};

let deleteRequest =  async function(requestUID, result) {
    const dbRef = ref(database);

    if(requestUID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Requests/'+ requestUID] = postData;

        update(dbRef, updates);
 
        result(null, requestUID);

    }else{
        result("Bad comment", null);
    }
};




export {getRequests, getSingleRequest, addRequest, editRequest, deleteRequest};
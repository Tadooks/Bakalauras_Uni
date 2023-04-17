'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

let getUsers =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Users/`)).then((snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfUsers = [];

            const objectArray = Object.entries( snapshot.val());
            
            objectArray.forEach(([key, value]) => {
                arrayOfUsers.push({
                    uid: key,
                    authid: value.authid,
                    email: value.email
                });
            });
            result(null, arrayOfUsers);
        } else {

            console.log("No data available");
            result(null, []);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let getSingleUser =  async function(uid, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Users/`+uid)).then((snapshot) => {
 
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

let addUser =  async function(user, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(user != null){
        
        //we create a new key
        const newPostKey = push(child(dbRef, '/Users/' + user.uid)).key;

        const postData = {
            uid: newPostKey,
            authid: user.authid,
            email: user.email,
        };
    
        const updates = {};

        updates['/Users/'+ newPostKey] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad User", null);
    }
};

let editUser =  async function(user, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(user.user != null){
        
        //we reuse key

        const postData = {
            uid: user.uid,
            authid: user.user.authid,
            email: user.user.email,
        };
    
        const updates = {};

        updates['/Users/'+ user.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad User", null);
    }
};

let deleteUser =  async function(userUID, result) {
    const dbRef = ref(database);

    if(userUID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Users/'+ userUID] = postData;

        update(dbRef, updates);
 
        result(null, userUID);

    }else{
        result("Bad comment", null);
    }
};




export {getUsers, getSingleUser, addUser, editUser, deleteUser};
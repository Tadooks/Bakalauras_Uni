'use strict';

import { database } from "../db/firebaseDB.js";
import { auth } from "../db/firebaseDBAdmin.js";
import { ref, child, get, push, update} from "firebase/database";

let getUsers =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Users/`)).then(async (snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfUsers = [];

            const objectArray = Object.entries( snapshot.val());

            for (let index = 0; index < objectArray.length; index++) {
                const key = objectArray[index][0]; //([key, value])
                const value = objectArray[index][1]; //([key, value])
                arrayOfUsers.push({
                    uid: key,
                    authid: value.authid,
                    email: value.email,
                    verified: (await auth.getUser(value.authid)).emailVerified,
                    permissions: value.permissions
                });
            }
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
 
    get(child(dbRef, `/Users/`+uid)).then(async (snapshot) => {
 
        if (snapshot.exists()) {
            let obj= snapshot.val()
            obj["verified"]  = (await auth.getUser(obj.authid)).emailVerified
            result(null, obj);
            
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
            verified: user.verified,
            permissions: "None",
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
            verified: user.user.verified,
            permissions: user.user.permissions
        };
    
        const updates = {};

        updates['/Users/'+ user.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad User", null);
    }
};

let deleteUser =  async function(user, result) {
    const dbRef = ref(database);
    console.log(user);
    if(user.uid != null && user.change != null && user.uid == user.change.uid ){
        
        const postData = {};
    
        const updates = {};

        updates['/Users/'+ user.uid] = postData;

        update(dbRef, updates);
 
        auth.deleteUser(user.change.authid)
            .then(() => {
                console.log('Successfully deleted user');
            })
            .catch((error) => {
                console.log('Error deleting user:', error);
            });

        result(null, user);

    }else{
        result("Bad comment", null);
    }
};




export {getUsers, getSingleUser, addUser, editUser, deleteUser};
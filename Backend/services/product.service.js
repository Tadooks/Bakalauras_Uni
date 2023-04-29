'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

//https://firebase.google.com/docs

let getProducts =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Products/`)).then((snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfProducts = [];

            const objectArray = Object.entries( snapshot.val());
            
            objectArray.forEach(([key, value]) => {
                arrayOfProducts.push({
                    uid: key,

                    name: value.name,
                    desc: value.desc,
                    price: value.price,
                    image: value.image,
                    audio: value.audio,
                    type: value.type,
                });
            });
            result(null, arrayOfProducts);
        } else {

            console.log("No data available");
            result(null, []);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let getSingleProduct =  async function(uid, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Products/`+uid)).then((snapshot) => {
 
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

let addProduct =  async function(product, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(product != null){
        
        //we create a new key
        const newPostKey = push(child(dbRef, '/Products/' + product.uid)).key;

        const postData = {
            uid: newPostKey,
            name: product.name,
            desc: product.desc,
            price: product.price,
            image: product.image,
            audio: product.audio,
            type: product.type,
        };
    
        const updates = {};

        updates['/Products/'+ newPostKey] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Product", null);
    }
};

let editProduct =  async function(product, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(product.product != null){
        
        //we reuse key

        const postData = {
            uid: product.uid,
            name: product.product.name,
            desc: product.product.desc,
            price: product.product.price,
            image: product.product.image,
            audio: product.product.audio,
            type: product.product.type,
        };
    
        const updates = {};

        updates['/Products/'+ product.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Product", null);
    }
};

let deleteProduct =  async function(productUID, result) {
    const dbRef = ref(database);

    if(productUID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Products/'+ productUID] = postData;

        update(dbRef, updates);
 
        result(null, productUID);

    }else{
        result("Bad comment", null);
    }
};




export {getProducts, getSingleProduct, addProduct, editProduct, deleteProduct};
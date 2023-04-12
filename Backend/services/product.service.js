'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

let getProducts =  async function(songID, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Products/`)).then((snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfProducts = [];

            const objectArray = Object.entries( snapshot.val());

            objectArray.forEach(([key, value]) => {
                arrayOfProducts.push({
                    uid: key,
                    id: value.id,
                    name: value.name,
                    desc: value.desc,
                    price: value.price,
                    image: value.image,
                    mp3: value.mp3
                });
            });
            result(null, arrayOfProducts);
        } else {

            console.log("No data available");
            result("No data available", null);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let getSingleProduct =  async function(id, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Products/`+id)).then((snapshot) => {
 
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
        const newPostKey = push(child(dbRef, '/Products/' + product.id)).key;

        const postData = {
            uid: newPostKey,
            id: product.id,
            name: product.name,
            desc: product.desc,
            price: product.price,
            image: product.image,
            mp3: product.mp3
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
            id: product.product.id,
            name: product.product.name,
            desc: product.product.desc,
            price: product.product.price,
            image: product.product.image,
            mp3: product.product.mp3
        };
    
        const updates = {};

        updates['/Products/'+ product.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Product", null);
    }
};

let deleteProduct =  async function(productID, result) {
    const dbRef = ref(database);

    if(productID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Products/'+ productID] = postData;

        update(dbRef, updates);
 
        result(null, productID);

    }else{
        result("Bad comment", null);
    }
};




export {getProducts, getSingleProduct, addProduct, editProduct, deleteProduct};
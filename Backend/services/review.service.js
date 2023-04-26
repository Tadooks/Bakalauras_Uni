'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";

//This could be upgraded with quaries. Filter on username.
//Or use the excuse that this will be filtered on UID. Your choice.
let get_all_for_product_reviews =  async function(reviewData, result) {
    //We get a database reference (is DB folder. FirebaseDB exportina reference to itself)
    const dbRef = ref(database);
    //We say "Get" to get data. And then we call "Child" to get a child from reference.
    //We will passs database reference into child. As well as the URL we will use to get data from.
    // Once we get the data we say "Then" to do something with said data.
    // We will then assign the name "Snapshot" to this data.
    get(child(dbRef, `/Reviews/`+reviewData.productID)).then((snapshot) => {
        //We call "exists" function on snapshot. This will check if we got any data at all.
        //If we got any data we move forward.
        if (snapshot.exists()) {
            
            const arrayOfReviews = [];

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
                arrayOfReviews.push({
                    reviewID: key,
                    authid: value.authid,
                    name: value.name,
                    rating: value.rating,
                    review: value.review,
                    visable: value.visable,
                });
            });
            result(null, arrayOfReviews);
        } else {
            //If we dont get any data. Thus, we can assume that an error accured (Misstypo or smth.)
            //Then we shall throw out an error message
            console.log("No data available");
            result(null, []);
        }
        //If database crashes. We throw out error.
        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let add_review =  async function(review, result) {
    const dbRef = ref(database);

    if(review != null){
        
        //This will give you a unique ID that will be assigned when you will insert something.
        const newPostKey = push(child(dbRef, '/Reviews/' + review.productID)).key;

        const postData = {
            productID: review.productID,
            reviewID: newPostKey,
            authid: review.authid,
            name: review.name,
            rating: review.rating,
            review: review.review,
            visable: false
        };
        
        //We will create an object of updates
        const updates = {};
        //In this specific object. We will assign a URL inside [] and then attach the object we want to add.
        updates['/Reviews/'+ review.productID+ '/'+ newPostKey] = postData;
        //We call "Update" functions from firebase and pass database reference and an array of updates
        update(dbRef, updates);
        //Pass updated review to frontend.
        result(null, {
            productID: review.productID,
            reviewID: newPostKey,
            authid: review.authid,
            name: review.name,
            rating: review.rating,
            review: review.review,
            visable: false
        });

    }else{
        result("Bad review", null);
    }
};



let get_all_reviews =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Reviews/`)).then((snapshot) => {
 
        if (snapshot.exists()) {

            result(null,  snapshot.val());

        } else {

            console.log("No data available");
            result(null, []);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let delete_review =  async function(review, result) {
    const dbRef = ref(database);

    if(review.productID != null && review.reviewID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Reviews/' + review.productID+"/"+ review.reviewID] = postData;

        update(dbRef, updates);
 
        result(null, review.reviewID);

    }else{
        result("Bad comment", null);
    }
};

let edit_review =  async function(review, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(review.review != null){
        
        //we reuse key

        const postData = {
            productID: review.review.productID,
            reviewID: review.review.reviewID,
            authid: review.review.authid,
            name: review.review.name,
            rating: review.review.rating,
            review: review.review.review,
            visable: review.review.visable
        };
    
        const updates = {};

        updates['/Reviews/' + review.review.productID+"/"+ review.review.reviewID] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad Reviews", null);
    }
};


export {get_all_reviews, get_all_for_product_reviews, add_review, delete_review, edit_review};
'use strict';

import { database } from "../db/firebaseDB.js";
import { ref, child, get, push, update} from "firebase/database";


let get_all_for_product_reviews =  async function(reviewData, result) {

    const dbRef = ref(database);

    get(child(dbRef, `/Reviews/`+reviewData.productID)).then((snapshot) => {
        
        if (snapshot.exists()) {
            
            const arrayOfReviews = [];


            const objectArray = Object.entries( snapshot.val());

            objectArray.forEach(([key, value]) => {
                arrayOfReviews.push({
                    reviewID: key,
                    // authid: value.authid,
                    name: value.name,
                    rating: value.rating,
                    review: value.review,
                    visable: value.visable,
                    email: value.email,
                });
            });
            result(null, arrayOfReviews);
        } else {
            //If we dont get any data
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
            // authid: review.authid,
            name: review.name,
            rating: review.rating,
            review: review.review,
            visable: true,//if implement confirm review function change to false
            email: review.email
        };
        
        //We will create an object of updates
        const updates = {};
        //We will assign a URL inside [] /Reviews/reviewProductID/ReviewID
        updates['/Reviews/'+ review.productID+ '/'+ newPostKey] = postData;
        //Update function to pass database reference and an array of updates
        update(dbRef, updates);
        //Passing updated review to front-end cood.
        result(null, {
            productID: review.productID,
            reviewID: newPostKey,
            // authid: review.authid,
            name: review.name,
            rating: review.rating,
            review: review.review,
            visable: true,
            email: review.email
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
    console.log(review)
    if(review.productID != null && review.reviewID != null){
        
        const postData = {};
    
        const updates = {};

        updates['/Reviews/' + review.productID+"/"+ review.reviewID] = postData;

        update(dbRef, updates);
 
        result(null, review.reviewID);

    }else{
        result("Bad reveiw", null);
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
            // authid: review.review.authid,
            name: review.review.name,
            rating: review.review.rating,
            review: review.review.review,
            visable: review.review.visable,
            email: review.review.email
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
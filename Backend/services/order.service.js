'use strict';

import { database } from "../db/firebaseDB.js";
import { auth } from "../db/firebaseDBAdmin.js";
import { ref, child, get, push, update} from "firebase/database";


let getOrders =  async function(thingamabob, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Orders/`)).then(async (snapshot) => {
 
        if (snapshot.exists()) {
            const arrayOfOrders = [];

            const objectArray = Object.entries( snapshot.val());

            for (let index = 0; index < objectArray.length; index++) {
                const key = objectArray[index][0]; //([key, value])
                const value = objectArray[index][1]; //([key, value])
                arrayOfOrders.push({

                    uid: key,
                    authid: value.authid,

                    ordernumber: value.ordernumber,
                    email: value.email,
                    products: value.products,
                    totalproductcount: value.totalproductcount,
                    paymentstatus: value.paymentstatus,
                    deliverystatus: value.deliverystatus,
                    shippinginfo: value.shippinginfo,
                    orderdate: value.orderdate,

                });
            }
            result(null, arrayOfOrders);
        } else {

            console.log("No data available");
            result(null, []);
        }

        }).catch((error) => {
            console.error(error);
            result(error, null);
        });
};

let getSingleOrder =  async function(uid, result) {

    const dbRef = ref(database);
 
    get(child(dbRef, `/Orders/`+uid)).then((snapshot) => {
 
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


let addOrder =  async function(order, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(order != null){
        
        //we create a new key
        const newPostKey = push(child(dbRef, '/Orders/' + order.uid)).key;

        const postData = {

            uid: newPostKey,
            authid: order.authid,
            ordernumber: order.ordernumber,
            email: order.email,
            products: order.products,
            totalproductcount: order.totalproductcount,
            paymentstatus: order.paymentstatus,
            deliverystatus: order.deliverystatus,
            shippinginfo: order.shippinginfo,
            orderdate: order.orderdate,
        };
    
        const updates = {};

        updates['/Orders/'+ newPostKey] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad add Order", null);
    }
};

let editOrder =  async function(order, result) {
    const dbRef = ref(database);
    //db ref - > firebase storage 
    if(order.order != null){
        
        //we reuse key

        const postData = {

            uid: order.uid,
            authid: order.order.authid,
            ordernumber: order.order.ordernumber,
            email: order.order.email,
            products: order.order.products,
            totalproductcount: order.order.totalproductcount,
            paymentstatus: order.order.paymentstatus,
            deliverystatus: order.order.deliverystatus,
            shippinginfo: order.order.shippinginfo,
            orderdate: order.order.orderdate,
        };
    
        const updates = {};

        updates['/Orders/'+ order.uid] = postData;

        update(dbRef, updates);
 
        result(null, postData);

    }else{
        result("Bad edit Order", null);
    }
};

let deleteOrder =  async function(order, result) {
    const dbRef = ref(database);
    console.log(order);
    if(order!=null){
        
        const postData = {};
    
        const updates = {};

        updates['/Orders/'+ order] = postData;

        update(dbRef, updates);

        result(null, order);

    }else{
        result("Bad delete order", null);
    }
};





export {getOrders, getSingleOrder, addOrder, editOrder, deleteOrder};
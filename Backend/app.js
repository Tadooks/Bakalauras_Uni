import { createRequire } from 'module'
const require = createRequire(import.meta.url);

//Controllers
import { addComment, getAllCommentsOnSong} from './controllers/comment.controller.js'

import { verifyUserIsAdmin} from './controllers/auth.controller.js'

import { getProducts, getSingleProduct, addProduct, editProduct, deleteProduct} from './controllers/product.controller.js'
import { getUsers, getSingleUserUID, getSingleUserByAuthID, addUser, editUser, deleteUser} from './controllers/user.controller.js'


// Express
const bodyParser = require('body-parser');

const http = require('http');

const app = require('express')();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());

// app.use(cors({
//     origin: "http://localhost:3000",
// })
// );

//--------------new stuff--------------//
const express=require("express");
const cors = require("cors");

// const products = require("./products.js");



app.use(express.json());
app.use(cors())



app.get("/",function (req,res) {
    res.send("Melonter shop api");
});


//---------------PRODUCTS---------------------
//all
app.get("/products",function (req,res) {
    getProducts(null, function(err, all_products) {
        if (err){
            console.log(err);
        }
        else{
            res.send(all_products);
        }
    });
});

//single
app.get("/products/:id",function (req, res) {
    const id = req.params.id;
    getSingleProduct(id, function(err, single_product) {
        if (err){
            console.log(err);
        }
        else{
            res.send(single_product);
        }
    });
});

//create
app.post("/products",function (req,res) {
    let userToVerify = req.headers['user'];
    let product = req.body;
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
                addProduct(product, function(err, responseAddProduct) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.send(responseAddProduct);
                    }
                });
            }else{
                res.send("No pablo");
            }
        }
    });
});

//edit
app.put("/products/:id",function(req,res) {
    let userToVerify = req.headers['user'];
    const id = req.params.id;
    let product = req.body;
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
                editProduct({"uid": id, "product": product}, function(err, responseEditProduct) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.send(responseEditProduct);
                    }
                });
            }else{
                res.send("No pablo");
            }
        }
    });
});

//delete 
// To delete / edit / create you need to use admin account . Thus its important to send user object with product to verify that its admin that wants to delete/edit/create !
app.delete("/products/:id",function(req,res) {
    let userToVerify = req.headers['user'];
    const id = req.params.id;
    let product = req.body;
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
                deleteProduct(id, function(err, responseDeleteProduct) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.send(responseDeleteProduct);
                    }
                });
            }else{
                res.send("No pablo");
            }
        }
    });
});
//-------------------------------------------------------------------------------------



//------------------USERS------------------
//all
app.get("/users",function (req,res) {
    let userToVerify = req.headers['user'];
    console.log(userToVerify)
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
                getUsers(null, function(err, all_users) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.send(all_users);
                    }
                });
            }else{
                res.send("No pablo");
            }
        }
    });

});

//single
app.get("/users/:id",function (req, res) {
    const id = req.params.id;
    getSingleUserUID(id, function(err, single_user) {
        if (err){
            console.log(err);
        }
        else{
            res.send(single_user);
        }
    });
});

//single
app.get("/auth/:id",function (req, res) {
    const id = req.params.id;
    getSingleUserByAuthID(id, function(err, single_user) {
        if (err){
            console.log(err);
        }
        else{
            res.send(single_user);
        }
    });
});

//create
app.post("/users",function (req,res) {
    let user = req.body;
    addUser(user, function(err, responseAddUser) {
        if (err){
            console.log(err);
        }
        else{
            res.send(responseAddUser);
        }
    });
});


//edit
app.put("/users/:id",function(req,res) {
    let userToVerify = req.headers['user'];
    const uid = req.params.id;
    let user = req.body;
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
                editUser({"uid": uid, "user": user}, function(err, responseEditUser) {
                    if (err){
                        console.log(err);
                    }
                    else{
                        res.send(responseEditUser);
                    }
                });
            }else{
                res.send("No pablo");
            }
        }
    });
});

//delete 
// To delete / edit / create you need to use admin account . Thus its important to send user object with user to verify that its admin that wants to delete/edit/create !
app.delete("/users/:id",function(req,res) {
    let userToVerify = req.headers['user'];
    const uid = req.params.id;
    let user = req.body;
    verifyUserIsAdmin(userToVerify, function(err, isAdmin) {
        if (err){
            console.log(err);
        }
        else{
            if(isAdmin){
            deleteUser({uid,user}, function(err, responseDeleteUser) {
                if (err){
                    console.log(err);
                }
                else{
                    res.send(responseDeleteUser);
                }
            });
            }else{
                res.send("No pablo");
            }
        }
    });
});
//-------------------------------------------------------------------------------------




//the function ()=> thingamabob is the same as function(req,res) thingamajig
// app.get("/products",(req,res)=>{
//     res.send(products);
// });


// app.post('/event', function (req, res) {
//     let change = req.body;
//     console.log(change.id);
//     console.log(change.name);
//     res.send(change);
// });


const PORT = process.env.PORT || 3001;
server.listen(PORT, function (err) {
    if (err) {
        console.error(err);
    } else {
        console.info(`Server is running on port ${PORT}.`);
    }
});
//-------------------------------------//





//Sockets
const io = require("socket.io")(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

// Socket setup
//const io = socket(server);



//Socket IO
io.on("connection", function (socket) {
    console.log("Made socket connection 2 here wooo");


    //gets all comments on  a song based on its ID (songID) or console logs error and sends an error message back. 
    socket.on('get_all_comments', (songID) => {
        getAllCommentsOnSong(songID, function(err, all_comments) {
            if (err){
                console.log(err);
                socket.emit("error", err);
            }
            else{
                socket.emit("get_all_comments_react", all_comments.reverse());
            }
        });
    });

    //adds a comment object to a specific song or console logs error and sends an error message back. 
    /*{
        Id: SongID,
        Who:
        Rating:
        Comment:
    }*/
    socket.on('add_comment', (comment) => {
        addComment(comment, function(err, addedComment) {
            if (err){
                console.log(err);
                socket.emit("error", err);
            }
            else{
                io.emit("added_comment", addedComment);
            }
        });
    });

    socket.on("disconnect", () => {
        console.log("User disconnect");
    });

  });
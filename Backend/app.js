import { createRequire } from 'module'
const require = createRequire(import.meta.url);

//Controllers
import { addComment, getAllCommentsOnSong} from './controllers/comment.controller.js'


import { getProducts, getSingleProduct, addProduct, editProduct, deleteProduct} from './controllers/product.controller.js'

// import products from './products.js';





// Express
const bodyParser = require('body-parser');

const http = require('http');

const app = require('express')();
const server = http.createServer(app);

// Middleware
app.use(bodyParser.json());

//--------------new stuff--------------//
const express=require("express");
const cors = require("cors");

// const products = require("./products.js");



app.use(express.json());
app.use(cors())

app.get("/",function (req,res) {
    res.send("Melonter shop api");
});


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
    let product = req.body;
    addProduct(product, function(err, responseFROMPRODUCTTHEwatchemacallit) {
        if (err){
            console.log(err);
        }
        else{
            res.send(responseFROMPRODUCTTHEwatchemacallit);
        }
    });
});

//edit
app.put("/products/:id",function(req,res) {
    const id = req.params.id;
    let change = req.body;
    editProduct({"uid": id, "product": change}, function(err, holyFuckLuisImDeleting) {
        if (err){
            console.log(err);
        }
        else{
            res.send(holyFuckLuisImDeleting);
        }
    });
});

//delete 
// To delete / edit / create you need to use admin account . Thus its important to send user object with product to verify that its admin that wants to delete/edit/create !
app.delete("/products/:id",function(req,res) {
    const id = req.params.id;
    deleteProduct(id, function(err, holyFuckLuisImDeleting) {
        if (err){
            console.log(err);
        }
        else{
            res.send(holyFuckLuisImDeleting);
        }
    });
});

//the function thingamabob is the same as function(req,res) thingamajig
// app.get("/products",(req,res)=>{
//     res.send(products);
// });
app.post('/event', function (req, res) {
    let change = req.body;
    console.log(change.id);
    console.log(change.name);
    res.send(change);
});


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
import {React, useState, useEffect,useContext } from "react";
import {  useParams,Link } from 'react-router-dom';
import { CartContext } from "../Pages/CartContext";
// import Rating from '@mui/material/Rating';
import { Rating } from "@mui/material";

import { AuthContext } from "../Pages/AuthContextNew";

import { ThemeProvider, createTheme } from '@mui/material/styles';

import { auth } from "../firebase_config";
import { Button } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//https://fkhadra.github.io/react-toastify/introduction

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

const Product = ({socket}) => {
    
    //getting user data from useContext
    const { user } = useContext(AuthContext);

    
    //visual cart change
    const { cartCount, setCartCount } = useContext(CartContext);
    
    const [productSize, setProductSize] = useState('None');
    
    //cart data
    //if cart is empty 
    const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);
    //---------------------------------------


    const [showForm, setShowForm] = useState(false);
    const [showAudio, setShowAudio] = useState(false);
    const [refresh,setRefresh] = useState(false);

    let { id } = useParams();//getting id from url

    const [inputs, setInputs] = useState({});

	const handleChange = (event) => {
      
      if(event.target.name == "rating"){
          const name = event.target.name;
          const value = Number(event.target.value);
          setInputs(values => ({...values, [name]: value}))
      }else{
          const name = event.target.name;
          const value = event.target.value;
          setInputs(values => ({...values, [name]: value}))
      }
	}
	
	const handleSubmit = (event) => {
	event.preventDefault();
	console.log("inputs.rating")
	console.log(inputs.rating)
    if(!inputs.rating) {
        inputs.rating=5;
    }
	if(inputs.name && inputs.review && inputs.rating){
		socket.emit('add_review',{
			productID: id,
			name: inputs.name,
			rating: inputs.rating,
			review: inputs.review,
            email: auth.currentUser.email,
		});
	}
	}		

	const [list, setList] = useState(
		{
            rating: 0,
            listOfReviews: []
		}
	);

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------





    const handleAddToCart = (product) => {
        console.log("Looking to fix size bugs")
        console.log(product)
        console.log(productSize)
        if(product.type=="Clothing" && productSize=="None"){
            alert("Please select a size")
            return;
        }
        
        if (cart[0].some((tempCart2) => {

            //--------Setting clothing product size---------
            if(productSize != "None"){
                console.log(productSize);
                return productSize == tempCart2.productSize && tempCart2.uid == product.uid
            }else{
                console.log(productSize);
                return tempCart2.uid == product.uid
            }
            //---------------------------------------------

        }))
        {
            //1. find product index inside cart, 2. get product based on index 3. product amount ++ 4. set cart with increased product.
            console.log("non-unique click");
            var productIndex = cart[0].findIndex(item => {


                //--------Setting clothing product size---------
                if(productSize != "None"){
                    console.log(product);
                    return productSize == item.productSize && item.uid == product.uid
                }else{
                    console.log(productSize);
                    return item.uid == product.uid
                }
                //---------------------------------------------


            });
            if(productSize != "None"){
                product.productSize = productSize;
            }
            var k = cart;
            var n = k[0][productIndex];
    
            n.amount++;
            k[0][productIndex] = n;
            setCart(k);
            
            
            
            // console.table(product);
    
            //setting the new cart to be saved in local storage
            window.localStorage.setItem("cart", JSON.stringify(k))
            console.table(window.localStorage);
            toast(product.name+" was added to the cart!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar'
            });
    
            //-------visual header cart update-------
            const c= Number(cartCount) +1;
            setCartCount(c)
            window.localStorage.setItem("cartVisualCount", c)
            //---------------------------------------

            return;
        }
        else
        {

            const clone = {...product}
            //setting first cart value.
            if(productSize != "None"){
                clone.productSize = productSize;
            }
            clone.amount = 1;
            var tempCart = cart;
            
            //we push product into first array
            tempCart[0].push(clone);
            
    
            
            console.log(" PIRMAS Table of tempCart[0]:")
            console.table(tempCart[0])
            setCart(tempCart);
    
            
            //setting the new cart to be saved in local storage
            window.localStorage.setItem("cart", JSON.stringify(tempCart))
            console.log("table window.localStorage (but non table :sadge: )")
            console.table(window.localStorage);
    
            //-------visual header cart update-------
            const c= Number(cartCount) +1;
            setCartCount(c)
            window.localStorage.setItem("cartVisualCount", c)
            //---------------------------------------
    
            toast(clone.name+" was added to the cart!", {
                position: toast.POSITION.BOTTOM_RIGHT,
                className: 'foo-bar'
            });
        }
    

        
    };




    
    

    const [dataID, setDataID] = useState();
    
    //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        fetch(`http://localhost:3001/products/` + id)
          .then(response => response.json())
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
            setDataID(id);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
    }, [id]);




    useEffect(() => {
		if( !socket) return;//fix crash on page refresh

        //helps avoid adding an empty value
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }
        console.log("auth.currentUser")
        console.log(auth.currentUser)
		const allReviews = (message) => {
			let realRating = 0;
            let hasComment = false;
			message.forEach((el)=>{
				realRating += Number(el.rating);
                if(auth.currentUser != null && el.email == auth.currentUser.email){
                    hasComment = true;
                }
			})


			setList({
				rating: realRating,
				listOfReviews: message
			});

            // SET STATE TO TRUE. TO NOT SHOW COMMENT FIELD !
            //hide form here
            console.log("AR AUTH??????????????????????????")
            //checking if user is logged in
            console.log(auth.currentUser)//one way,
            console.log(user[0].verified)//other way, i guess the more correct way

            //hiding if user is not logged in or already posted comment
            if(auth.currentUser==null ||  hasComment==true){
                setShowForm(false)
                
            }
            else{
                setShowForm(true);
            }
		};

		const addedNewReview = (message) => {
			//Decending
			//setArray(oldArray => [...oldArray, message]);
			//Assending
			if(message.productID == id){
				setList((oldArray) =>{
					const newList = [message,...oldArray.listOfReviews];
					let realRating = 0;
					newList.forEach((el)=>{
						realRating += Number(el.rating);
					});
					return {rating: realRating , listOfReviews: newList}
				});
			}
            setRefresh(true);
		};

		socket.on('get_all_reviews_react', allReviews);
		socket.on('added_review', addedNewReview);

        if(auth.currentUser != null){
		    socket.emit('get_all_reviews',{"productID": id, "email": auth.currentUser.email});
        }
		else {
            socket.emit('get_all_reviews',{"productID": id, "email": "None"});
        }

		return () => {
		  socket.off('get_all_reviews_react', allReviews);
		  socket.off('added_review', addedNewReview);
		};
	}, [socket,refresh]);


//--------------------CSS for MUI table(well and buttons apparently)-------------------------
const theme = createTheme({
    palette: {
      primary: {
        main: '#5a0061',
      },
      secondary: {
        main: '#5a0061', 
      },
    },
  });
  //---------------------------------------------------------------

    
    
    return(
        <div  style={{ color: 'white'}}>
            <ToastContainer/>
            
            
            <div className="productInfoMain">
            <ThemeProvider theme={theme}>
            <div className="buttonPadding">
                <Link to={`/shop`} >
                    <Button variant="contained">BACK</Button>
                </Link>
            </div>
            
            
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
                <div>
                
                <div className="productViewCenter">
                    <div key={data.uid} className="productClicked">
                            
                        <div>
                            <img className="productImg" src={data.image} alt={data.name} />
                        </div>
                        <h2 style={{ textAlign: 'center' }}>{data.name}</h2>
                        <div className="productPrice">
                            <span>{data.price} € </span>
                        </div>

                    </div>
                </div>

                <div className="productBonusInfo">
                    <div className="buttonPadding">
                        <Button variant="contained" onClick={()=> handleAddToCart(data)}>Add To Cart</Button>
                    </div>
                    
                    
                    {data.type == "Clothing" && (
                        <>
                        <select className='OptionSelection' id="product-type" name="product-type" value={productSize} onChange={e => setProductSize(e.target.value)}>
                            <option default disabled value="None">Please select size</option>
                            <option value="Extra Small">Extra Small</option>
                            <option value="Small">Small</option>
                            <option value="Medium">Medium</option>
                            <option value="Large">Large</option>
                            <option value="Extra Large">Extra Large</option>
                        </select>
                        </>
                    )}
                    

                </div>

                <div style={{ textAlign: 'center', paddingBottom: '20px' }}>
                        <Link to="/cart">
                            <Button variant="contained">Checkout</Button>
                        </Link>
                </div>
                
                <div>
                     {data.desc}
                </div>
                
                {data.type =="Audio" && (
                <div className="audioPreview">
                <div>
                    Preview:
                </div>
                    <div>
                    <ReactPlayer
                        
                        url={data.audio}
                        width="100%"
                        height="50px"
                        playing={false}
                        controls={true}
                    />
                    </div>
                </div>
                )}
                
                </div>
        
        <div className="reviewDiv">

                <br/>
            {showForm && (
            <div >
                <h3>Leave some feedback!</h3>

                <form onSubmit={handleSubmit}>
                    <Rating
                        name="rating"
                        value={inputs.rating || 5}
                        onChange={handleChange}
                    />
                    <p>
                        <label >&nbsp;Enter your name: &nbsp;
                        <input 
                            maxlength="20" 
                            className="textboxName"
                            type="text" 
                            name="name" 
                            value={inputs.name || ""} 
                            onChange={handleChange}
                        />
                        </label>
                    </p>
                    <textarea
                    maxlength="100" 
                    className="textboxclass" 
                    id="review" 
                    name="review" rows="4" cols="50"
                    value={inputs.review || ""} 
                    onChange={handleChange}>
                            Your review goes here
                        </textarea>
                    <p>
                        <input className="button2 button1" type="submit" value="Post review"/>
                    </p>
                </form>
            </div>
            )}

            <h3>Reviews:</h3>
            <div>Average user rating: &nbsp;
            {  
                Number.parseFloat(list.rating/list.listOfReviews.length).toFixed(2)
            }
            </div>
            Number of reviews: &nbsp;
            {  
                list.listOfReviews.length
            }

        <ul>
        {  
                list.listOfReviews.map((review) =>
                    <li key={review.id}>
                        <div>
                            <b>Name: </b> {review.name}
                            
                        </div>
                        <div>
                            {/* <b>Rating:</b> {review.rating} */}
                            <p>
                                <Rating className='ReviewRating'
                                name="rating"
                                value={review.rating}
                                onChange={handleChange}
                                />
                            </p>
                                
                            <p></p>
                        </div>
                        <li>
                            <div>
                                <b> </b> {review.review}
                            </div>
                        </li>
                    </li>
                    )

                }
        </ul>


            </div>
            </>
            )}

        </ThemeProvider>
        </div>
</div>
    
);};

export default Product;

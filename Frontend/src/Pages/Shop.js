import {useState,useEffect, useContext} from 'react'
import { generatePath,Router, Link, Routes, Route,useParams } from 'react-router-dom';
import { GetProductsAPI } from '../API/ProductsAPI';
import Cookies from 'universal-cookie';

import { CartContext } from './CartContext';

import { ToastContainer, toast } from 'react-toastify';
import { Button } from "@mui/material";
import 'react-toastify/dist/ReactToastify.css';


//https://fkhadra.github.io/react-toastify/introduction

const Shop = () => {

    //visual cart change
    const { cartCount, setCartCount } = useContext(CartContext);

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    //cart data
    //if cart is empty 
    const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);
    //---------------------------------------

    //display data for sort
    const [displayData, setDisplayData] = useState(null);
    const [selectedType, setSelectedType] = useState('');
    
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }
        
        fetch(`http://localhost:3001/products`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setLoading(false);
            setData(usefulData);

            //setting data for displaying
            setDisplayData(usefulData)
            console.log(usefulData);

          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
        
    }, []);
    // //------------------------------------------


    //window.localStorage.clear();
    console.log("cart.length")
    console.log(cart.length)
    
        
    //window.localStorage.clear();
    // window.localStorage.setItem("cart", JSON.stringify(""));

    

//filter 
const handleTypeClick = (type) => {
    setSelectedType(type);
  };

  const handleClearClick = () => {
    setSelectedType('');
  };


    return (
        <div style={{ color: 'white'}}>
            <ToastContainer/>
            <h1 style={{ textAlign: 'center' }}>Shop</h1>
            <div style={{ textAlign: 'center' }}>
            <h2>
                <button className='filterButton' onClick={() => handleClearClick()} >All</button>  
                &nbsp; &nbsp; &nbsp; &nbsp; 
                <button className='filterButton'   onClick={() => handleTypeClick('Clothing')} >Clothing</button>  
                &nbsp; &nbsp; &nbsp; &nbsp; 
                <button className='filterButton'  onClick={() => handleTypeClick('Misc')} > Misc </button>
                &nbsp; &nbsp; &nbsp; &nbsp;  
                <button className='filterButton'  onClick={() => handleTypeClick('Audio')} >Audio </button>

            </h2>
            </div>
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
                <div className="products">
                {displayData &&
                    displayData
                    .filter((product) => !selectedType || product.type == selectedType) // Filter products by selected type
                    .map((product) => (
                        <div key={product.uid} className="product">
                        <Link className="productCard" to={`/productdetails/${product.uid}`}>
                            
                            <div>
                            <img className="productImg" src={product.image} alt={product.name} />
                            </div>
                            <h2 style={{ textAlign: 'center' }}>{product.name}</h2>
                            <div className="productPrice">
                                <span>{product.price} € </span>
                            </div>
                        </Link>
                        </div>
                    ))}
                </div>
            </>
            )}
        </div>
)
}
  
export default Shop

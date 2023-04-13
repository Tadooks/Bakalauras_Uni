import {useState,useEffect, useContext} from 'react'
import { generatePath,Router, Link, Routes, Route,useParams } from 'react-router-dom';
import { GetProductsAPI } from '../API/ProductsAPI';
import Cookies from 'universal-cookie';

import { CartContext } from './CartContext';

import { ToastContainer, toast } from 'react-toastify';
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



    
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }
        
        fetch(`http://localhost:3001/products`)
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setLoading(false);
            setData(usefulData);
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

    

    //-------------add to cart button---------
const handleAddToCart = (product) => {

    if (cart[0].some((tempCart2) => tempCart2.id == product.id))//why? Checks for duplicates i guess, if theres a duplicate, +1 to amount, if not a new object is created.
    {
        //1. find product index inside cart, 2. get product based on index 3. product amount ++ 4. set cart with increased product.
        console.log("non-unique click");
        var productIndex = cart[0].findIndex(item => item.id === product.id);
        var k = cart;
        var n = k[0][productIndex];

        n.amount++;
        k[0][productIndex] = n;
        setCart(k);
        
        
        console.log("Table of cart[0]:");
        console.table(cart[0]);
        // console.table(product);

        //setting the new cart to be saved in local storage
        window.localStorage.setItem("cart", JSON.stringify(k))
        console.table(window.localStorage);
        toast(product.name+" was added to the cart!", {
            position: toast.POSITION.BOTTOM_LEFT,
            className: 'foo-bar'
        });

        //-------visual header cart update-------
        const c= Number(cartCount) +1;
        setCartCount(c)
        window.localStorage.setItem("cartVVVVV", c)
        //---------------------------------------

        return;
    }
    else
    {
        //setting first cart value.
        console.log("first unique click")

        product.amount = 1;
        var tempCart = cart;
        
        //we push product into first array
        tempCart[0].push(product);
        

        
        console.log("Table of tempCart[0]:")
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

        toast(product.name+" was added to the cart!", {
            position: toast.POSITION.BOTTOM_LEFT,
            className: 'foo-bar'
        });
    }

    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
    console.log(data);
    

};
//----------------------------------------

    return (
        <div style={{ color: 'white'}}>
            <ToastContainer/>
            <h1>Music shop!</h1>
            Filter
            Sort
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
                <div className="products">
                    {data && 
                        data?.map((product) => (
                            <div key={product.id} className="product">
                                <Link
                                    to={`/productDetails/${product.id}`}
                                >
                                    <h2>Product name: {product.name}</h2>
                                    <h2>Product id: {product.id}</h2>
                                    <div>
                                    <img className="productImg" src={product.image} alt={product.name}/>
                                    </div>
                                    <div>
                                        <span className="productPrice">Price:{product.price}</span>
                                    </div>
                                    <div>
                                        <span className="productPrice">description: {product.desc}</span>
                                    </div>
                                </Link>
                                
                                <button onClick={()=> handleAddToCart(product)} className="productButton">Add To Cart</button>
                                
                            </div>
                        ))}
                </div>
            </>
            )}
        </div>
)
}
  
export default Shop

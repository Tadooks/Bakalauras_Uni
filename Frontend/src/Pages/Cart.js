import {Link} from "react-router-dom"
import { useState } from "react";

import { useEffect,createContext,useContext } from "react";
import { CartContext } from './CartContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//https://fkhadra.github.io/react-toastify/introduction



const Cart = () => {
    
    //TO DO:
    //Clear all carts
    //Price calculations
    //Total price calculations
    //Checkout screen

    //visual cart change
    const { cartCount, setCartCount } = useContext(CartContext);
    


    const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

    const [subtotal,setSubtotal] = useState();


    const [refresh,setRefresh] = useState(false);
    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }//this if may cause issues. idk idk

        var tempTotalPrice=0.0;
        var countTotal = 0;

        //---------Calculate total cart subtotal----------
        console.log("Calculating Subtotal")
        let tempArray = [];
        if(window.localStorage.getItem("cart")){
            tempArray = JSON.parse(window.localStorage.getItem("cart"))[0];
        }

        tempArray.forEach((value) =>{
            
            var tempPrice = (Object(value)['price']);
            var tempAmount = (Object(value)['amount']);
            console.log("Price: "+ tempPrice+ " Amount: "+ tempAmount);
            //convert to number
            tempTotalPrice=((tempPrice*tempAmount)+tempTotalPrice);


            countTotal=tempAmount+countTotal;


        })
        console.log("Final total: "+tempTotalPrice);
        console.log("Total: "+countTotal)
        setSubtotal(tempTotalPrice.toFixed(2));
        //saving subtotal to local storage (idk if its really needed)
        window.localStorage.setItem("Subtotal", JSON.stringify(tempTotalPrice))
        //------------------------------------------------
        
        


        setRefresh(false);
        console.log("Use effect");
    }, [refresh]);
    // //------------------------------------------



    const handleRemoveFromCart=(cartItem)=>{
        console.log("removedFromCart");

        

        var tempCart = cart;
        
        var productIndex = cart[0].findIndex(item => {
            if(item.productSize != "None"){
                return item.productSize == cartItem.productSize && item.uid == cartItem.uid
            }else{
                return item.uid == cartItem.uid
            }
        });
        //we remove 
        console.log("Splicing this:"+ cartItem.uid);
        tempCart[0].splice(productIndex,1)
        //display all except that
    
        setCart(tempCart);
        setRefresh(true);//refreshing values
        console.table(tempCart[0]);
        
        //setting the new cart to be saved in local storage
        window.localStorage.setItem("cart", JSON.stringify(tempCart))
        toast(cartItem.name+" was removed from cart!", {
            position: toast.POSITION.BOTTOM_LEFT,
            className: 'foo-bar'
        });

        //-------visual header cart update-------
        if(cartItem.amount==0)
        {
            cartItem.amount=1
        }
        const c= Number(cartCount) -cartItem.amount;
        console.log(Number(cartCount)+" - "+cartItem.amount + " = " + c)
        setCartCount(c)
        window.localStorage.setItem("cartVisualCount", c)
        //---------------------------------------
        

        return;
    }

    //Need to add data saving cuz editing cart like in Shop.js
    const handleAmountAdd=(cartItem)=>{
        console.log("amountAdded");

        var productIndex = cart[0].findIndex(item => {
                if(item.productSize != "None"){
                    return item.productSize == cartItem.productSize && item.uid == cartItem.uid
                }else{
                    return item.uid == cartItem.uid
                }
            });
        console.log("amountAdd to productIndex: " + cartItem.uid);


        var k = cart;
        var n = k[0][productIndex];

        n.amount++;
        k[0][productIndex] = n;
        setCart(k);
        setRefresh(true);//refreshing values
        

        //setting the new cart to be saved in local storage
        window.localStorage.setItem("cart", JSON.stringify(cart))

        toast("Count of " + cartItem.name+ " was increased" +" !", {
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
    const handleAmountRemove=(cartItem)=>{
        console.log("amountRemove");
        
        

        var productIndex = cart[0].findIndex(item => {
            if(item.productSize != "None"){
                return item.productSize == cartItem.productSize && item.uid == cartItem.uid
            }else{
                return item.uid == cartItem.uid
            }
        });
        
        var k = cart;
        console.log(cart);
        var n = k[0][productIndex];
        
        

        n.amount--;
        if(n.amount<=0)
        {
            
            handleRemoveFromCart(cartItem);
            return;
        }
        else
        {


            //-------visual header cart update-------
            const c= Number(cartCount) -1;
            setCartCount(c)
            window.localStorage.setItem("cartVisualCount", c)
            console.log("Huhhhh!!!!!!!!!!!")
            //---------------------------------------

            toast("Count of " + cartItem.name+ " was decreased" +" !", {
                position: toast.POSITION.BOTTOM_LEFT,
                className: 'foo-bar'
            });

            console.log("minus minus");
            k[0][productIndex] = n;
        
            setCart(k);
            setRefresh(true);//refreshing values
            
    
            //setting the new cart to be saved in local storage
            window.localStorage.setItem("cart", JSON.stringify(k))

            return;
        }
        
    }

    const handleClearCart=() => {
        console.log("Clearing cart")
        const tempEmpty = [[]]
        window.localStorage.setItem("cart", JSON.stringify(tempEmpty))
        console.log(window.localStorage.getItem("cart"))
        setRefresh(true);//refreshing values
        toast("Cart was cleared!", {
            position: toast.POSITION.BOTTOM_LEFT,
            className: 'foo-bar'
        });

        //-------visual header cart update-------
        const c= Number(0);
        setCartCount(c)
        window.localStorage.setItem("cartVisualCount", c)
        //---------------------------------------
    }

    var tempCartSum;


    //console.log("awooga user:"+ {user?.email})

    return(
    <div style={{ color: 'white'}} className="cart-container">
        <ToastContainer/>
        <h2>Shopping cart</h2>

        {/* <ThemeContext.Provider value={darkTheme} >
            <button onClick={toggleTheme}>Toggle</button>
            <FunctionContextComponent/>
        </ThemeContext.Provider> */}

        {/* if empty array */}
        {cart[0][0]==null ? (
            <div className="cartEmpty">
            <p>Your cart is empty!</p>
            {console.log("This carrrt is empty ")}
                    {console.log([cart])}
            <div className="startShopping">
                <Link to="/shop">

                    Start Shopping
                </Link>
            </div>
            </div>
        ) : (//LOADED cart
            <div>
                
                <div className="cart-items">
                ORDER SUMMARY
                <table>
                    {console.log("This aint empty ")}
                    {console.log(cart[0][0])}
                    {cart[0]?.map((cartItem) =>(
                        // <div className="cart-item" key={cartItem.id}>
                        <>
                            <tr className="cart-item" key={cartItem.uid}>
                                <div>{cartItem.uid}</div>
                                <td class="first"> 
                                    <img style={{ width: '50px', height: '80px' }} src={cartItem.image} alt={cartItem.name}/>
                                </td>

                                <td class="other">
                                    <div>
                                        Name: 
                                        {cartItem.name}
                                    </div>
                                    <div>
                                        Name: 
                                        {cartItem.productSize}
                                    </div>
                                    <div>
                                        Price:
                                        {tempCartSum=(cartItem.price*cartItem.amount).toFixed(2)} €
                                    </div>
                                    
                                </td>
                                <td class="other">
                                    
                                </td>
                                <td class="other">
                                    Quantity:
                                    <div>
                                        <button onClick={()=>handleAmountRemove(cartItem)}>-</button>
                                        <div className="count">{cartItem.amount}</div>
                                        <button onClick={()=>handleAmountAdd(cartItem)}>+</button>
                                    </div>
                                    
                                </td>
                                <td>
                                    <button onClick={()=>handleRemoveFromCart(cartItem)}>Remove</button>
                                </td>
                            </tr>
                        </>
                    ))}
                </table>
                </div>
                <div className="cart-summary">
                    <button onClick={()=>handleClearCart()} className="clear-cart">Clear Cart</button>
                    <div className="cart-checkout">
                        <div className="subtotal">
                            <span>Subtotal: </span>
                            <span>{subtotal} €</span>
                        </div>
                        
                        <Link to="/checkout">
                        <button>Checkout</button>
                        </Link>

                        <div className="continue-shopping">
                            <Link to="/shop">
                                Continue shopping
                            </Link>
                            Continue Shopping
                        </div>
                    </div>
                </div>

            </div>
        )}
        
    </div>
    );
};
export default Cart;
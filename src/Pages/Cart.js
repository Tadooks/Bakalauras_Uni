import {Link} from "react-router-dom"
import { useState } from "react";
import { useEffect } from "react";

const Cart = () => {
    
    //TO DO:
    //Clear all carts
    //Price calculations
    //Total price calculations
    //Checkout screen



    const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

    const [subtotal,setSubtotal] = useState();


    const [refresh,setRefresh] = useState(false);
    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }//this if may cause issues. idk idk

        var tempTotalPrice=0.0;

        //---------Calculate total cart subtotal----------
        console.log("Calculating Subtotal")
        const tempArray = JSON.parse(window.localStorage.getItem("cart"))[0];

        tempArray.forEach((value) =>{
            
            var tempPrice = (Object(value)['price']);
            var tempAmount = (Object(value)['amount']);
            console.log("Price: "+ tempPrice+ " Amount: "+ tempAmount);
            //convert to number
            tempTotalPrice=((tempPrice*tempAmount)+tempTotalPrice);
        })
        console.log("Final total: "+tempTotalPrice);
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
        
        var productIndex = cart[0].findIndex(item => item.id === cartItem.id);
        //we remove 
        console.log("Splicing this:"+ cartItem.id);
        tempCart[0].splice(productIndex,1)
        //display all except that
    
        setCart(tempCart);
        setRefresh(true);//refreshing values
        console.table(tempCart[0]);
        
        //setting the new cart to be saved in local storage
        window.localStorage.setItem("cart", JSON.stringify(tempCart))
        return;
    }

    //Need to add data saving cuz editing cart like in Shop.js
    //cart doesnt update live.
    const handleAmountAdd=(cartItem)=>{
        console.log("amountAdded");

        var productIndex = cart[0].findIndex(item => item.id === cartItem.id);
        console.log("amountAdd to productIndex: " + cartItem.id);


        var k = cart;
        var n = k[0][productIndex];

        n.amount++;
        k[0][productIndex] = n;
        setCart(k);
        setRefresh(true);//refreshing values
        

        //setting the new cart to be saved in local storage
        window.localStorage.setItem("cart", JSON.stringify(cart))
        return;
    }
    const handleAmountRemove=(cartItem)=>{
        console.log("amountRemove");

        var productIndex = cart[0].findIndex(item => item.id === cartItem.id);
        
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
    }




    var tempCartSum;

    return(
    <div style={{ color: 'white'}} className="cart-container">
        <h2>Shopping cart</h2>
        {/* if empty array */}
        {cart==[] ? (
            <div className="cartEmpty">
            <p>Your cart is empty boyyyyyy got danmn</p>
            <div className="startShopping">
                <Link to="/">

                    Start Shopping
                </Link>
            </div>
            </div>
        ) : (//LOADED cart
            <div>
                
                <div className="cart-items">
                ORDER SUMMARY
                <table>
                
                    {cart[0]?.map((cartItem) =>(
                        // <div className="cart-item" key={cartItem.id}>
                        <>
                            <tr className="cart-item" key={cartItem.id}>
                                <div>{cartItem.id}</div>
                                <td class="first"> 
                                    <img style={{ width: '50px', height: '80px' }} src={cartItem.image} alt={cartItem.name}/>
                                </td>

                                <td class="other">
                                    <div>
                                        Name: 
                                        {cartItem.name}
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
                        
                        <button>Checkout</button>
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
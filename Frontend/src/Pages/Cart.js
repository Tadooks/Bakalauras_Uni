import {Link} from "react-router-dom"
import { useState } from "react";

import { useEffect,createContext,useContext } from "react";
import { CartContext } from './CartContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//https://fkhadra.github.io/react-toastify/introduction

import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';


const Cart = () => {
    

    //visual cart change
    const { cartCount, setCartCount } = useContext(CartContext);
    


    const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

    const [subtotal,setSubtotal] = useState();


    const [refresh,setRefresh] = useState(false);
    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        if(window.localStorage.getItem("cart")){
            setCart(JSON.parse(window.localStorage.getItem("cart")));
        }

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
        
        //--------Setting clothing product size---------
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
            position: toast.POSITION.BOTTOM_RIGHT,
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

        //--------Setting clothing product size---------
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
        
        
        //--------Setting clothing product size---------
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
                position: toast.POSITION.BOTTOM_RIGHT,
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
            position: toast.POSITION.BOTTOM_RIGHT,
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




    //-------------------------RETURN----------------------------
    return(
    <div style={{ color: 'white'}} className="cart-container">
        <ThemeProvider theme={theme}>
        <ToastContainer/>
        <h1 style={{ textAlign: 'center' }}>Shopping cart</h1>

        <div className="productViewCenter">
            <div className="continue-shopping">
                <div className="buttonPadding">
                    <Link to="/shop">
                        <Button  variant="contained">Back to shopping</Button>
                    </Link>
                </div>
                
            </div>
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
            {/* <div className="startShopping">
                <Link to="/shop">

                    Start Shopping
                </Link>
            </div> */}
            </div>
        ) : (//LOADED cart
            <div>
                
                <div className="cart-items">

                <table>
                    {console.log("This aint empty ")}
                    {console.log(cart[0][0])}
                    {cart[0]?.map((cartItem) =>(
                        // <div className="cart-item" key={cartItem.id}>
                        <>
                            <tr className="cart-item" key={cartItem.uid}>
                                {/* <div>{cartItem.uid}</div> */}
                                <td class="first"> 
                                    <img style={{ width: '120px', height: '120px' }} src={cartItem.image} alt={cartItem.name}/>
                                </td>

                                <td class="other">
                                    <div>
                                        {cartItem.name}
                                    </div>
                                    <div>
                                        {cartItem.type == "Clothing" && (
                                            <>
                                                Size: {cartItem.productSize}
                                            </>
                                        )}
                                        
                                    </div>
                                    <div>
                                        Price:
                                        {tempCartSum=(cartItem.price*cartItem.amount).toFixed(2)} €
                                    </div>
                                    
                                </td>
                                <td class="other">
                                    
                                    <div>
                                        <Button variant="contained" onClick={()=>handleAmountRemove(cartItem)}><div style={{ fontSize: '35px'}} >-</div></Button>
                                        <div className="quantityCount">{cartItem.amount}</div>
                                        <Button variant="contained" onClick={()=>handleAmountAdd(cartItem)}><div style={{ fontSize: '35px'}} >+</div></Button>
                                    </div>
                                    
                                </td>
                                <td>
                                    <Button variant="contained" onClick={()=>handleRemoveFromCart(cartItem)}>Remove</Button>
                                </td>
                            </tr>
                        </>
                    ))}
                </table>
                

                
                </div>
                <div className="subtotal">
                    <h2 style={{ textAlign: 'center' }}>
                        <span>Subtotal: </span>
                        <span>{subtotal} €</span>
                    </h2>
                </div>
                <div className="cartSummary">
                    <div className="buttonPadding">
                        <Button variant="contained" onClick={()=>handleClearCart()} className="clear-cart">Clear Cart</Button>
                    </div>
                    <div className="buttonPadding">
                        <Link to="/checkout">
                            <Button variant="contained">Checkout</Button>
                        </Link>
                    </div>
                    
                </div>
                                            
            </div>
        )}
        </div>
    </ThemeProvider>
    </div>
    );
};
export default Cart;
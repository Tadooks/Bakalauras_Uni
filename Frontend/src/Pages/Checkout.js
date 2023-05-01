import React, { useState,useEffect,useContext } from 'react';
import {Link,useNavigate, useParams} from "react-router-dom"
import { auth } from '../firebase_config';
import { AuthContext } from './AuthContextNew';
import { CartContext } from './CartContext';
//if success, clear cart. and show success transfer complete,
//send receipt email with more info.

//Info perduotas for createorder
//Order number, email, ,  payment status, delivery status, order date
//products
// shipping info,

import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';



const Checkout=()=> {
  
  //getting user data from useContext
  const { user } = useContext(AuthContext);


  //visual cart change
  const { cartCount, setCartCount } = useContext(CartContext);

  // const [userAuthId, setUserAuthId] = useState('');
  //Add states

  //Number generate orderNumber
  const [orderNumber, setOrderNumber] = useState('');



  const [email, setEmail] = useState('');
  
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [deliveryStatus, setDeliveryStatus] = useState('not shipped');
  const [orderDate, setOrderDate] = useState(Date.now());

  //these kazkaip atskirai? Products i array sudet
  //for products i only need the uid and count.
  const [products, setProducts] = useState([]);


  //shipping info stuff
  const [shippingInfo, setShippingInfo] = useState({
    country: '',
    city: '',
    address: '',
    post: '',
    name: '',
    surname: '',
    phone: ''
  });



  // item uid and count



  //need to set cart local storage to 0 after successful checkout
  const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

  

  const [subtotal,setSubtotal] = useState();


  const [refresh,setRefresh] = useState(false);


  //----------PRODUCT data states----------
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //---------------------------------------
  

  console.log("timestamp")
  // console.log(Date.now())
  
  const navigate = useNavigate()

  
  useEffect(() => {
      if(window.localStorage.getItem("cart")){
          setCart(JSON.parse(window.localStorage.getItem("cart")));
      }//this if may cause issues. idk idk

      var tempTotalPrice=0.0;
      var countTotal = 0;

      //---------Calculate total cart subtotal----------
      console.log("Calculating Subtotal")
      const tempArray = JSON.parse(window.localStorage.getItem("cart"))[0];

      tempArray.forEach((value) =>{
          
          var tempPrice = (Object(value)['price']);
          var tempAmount = (Object(value)['amount']);
          console.log("Price: "+ tempPrice+ " Amount: "+ tempAmount);
          //convert to number
          tempTotalPrice=((tempPrice*tempAmount)+tempTotalPrice);


          countTotal=tempAmount+countTotal;


      })

      setSubtotal(tempTotalPrice.toFixed(2));
      //saving subtotal to local storage (idk if its really needed)
      window.localStorage.setItem("Subtotal", JSON.stringify(tempTotalPrice))
      //------------------------------------------------
      
      


      setRefresh(false);
      console.log("Use effect");
  }, [refresh]);
  // //------------------------------------------
  var tempCartSum;

  const handleShippingChange = (value,name) => {
    setShippingInfo(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  console.log("UHHHHHHH")
  console.log(JSON.stringify(user[0]))


  //------------BUTTON GOES CLICKTY CLICK--------------------------
  //------------Create product------------
  const handleCreateOrder=(e)=>{
    e.preventDefault()
    console.log("handleCreateOrder was clicked!");

    if(window.confirm("Are you sure you want to create your order ?")){
    

    // Returns a random integer from 0 to 999:
    const randomNumTxt = (Math.floor(Math.random() * 1000));


    
    

    // console.log(order);
    fetch(`http://localhost:3001/orders`,{
        method: "POST",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            // backend requires whole object
            'user': JSON.stringify(user[0])
        },
        body: JSON.stringify(
            { 
                authid: auth.currentUser.uid,
                ordernumber: Date.now().toString()+randomNumTxt,
                email: auth.currentUser.email,
                products: cart[0],
                shippinginfo: shippingInfo,
                totalproductcount: totalProductCount,
                paymentstatus: paymentStatus,
                deliverystatus: deliveryStatus,
                orderdate: orderDate,
            }
        )
    })
      .then(response => {
        alert('Order was sent successfully');
        //we wipe local cart storage
        const tempEmpty = [[]]
        window.localStorage.setItem("cart", JSON.stringify(tempEmpty))
        //-------visual header cart update-------
        const c= Number(cartCount) *0;
        setCartCount(c)
        window.localStorage.setItem("cartVisualCount", c)
        //---------------------------------------
        navigate('/ProfileOrders')//PAYMENT INFO PAGE
      })
      .then((usefulData) => {
        setLoading(false);
        setData(usefulData);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`)
      });

    }
      setRefresh(true);
    return;
}
//------------------------------------


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
    <div style={{ color: 'white'}}>
        <ThemeProvider theme={theme}>
        <h1 style={{ textAlign: 'center' }}>Order summary</h1>
        <div className='Checkout-Screenerino'>
        {/* when empty this will get stuck on loading. */}
        {/* {loading ?(
            <p>Loading...</p>
            
        ) : error ? (
            <p>An error occured</p>
        ):( */}

        {/* if empty array */}
        {cart[0].length==0  ? (
                <div className="cartEmpty">
                <p>Your cart is empty !</p>
                <div className="startShopping">
                    <div className="buttonPadding">
                        <Link to="/shop">
                            <Button  variant="contained">Back to shopping</Button>
                        </Link>
                    </div>
                </div>
                </div>
            ) : (//LOADED cart
        <>

            <div className='StyledCreateOrder'>
                <div>
                    

                    <form className="StyledForm" onSubmit={handleCreateOrder} >
                        
                        
                        <h1>Shipping info</h1>
                        Country:
                        <input 
                            type='text' 
                            value={shippingInfo.country}
                            placeholder="Country"
                            required
                            name="country"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        City:
                        <input 
                            type='text' 
                            value={shippingInfo.city}
                            placeholder="City"
                            required
                            name="city"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        Address:
                        <input 
                            type='text' 
                            value={shippingInfo.address}
                            placeholder="Address"
                            required
                            name="address"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        Postal code:
                        <input 
                            type='text' 
                            value={shippingInfo.post}
                            placeholder="Postal code"
                            required
                            name="post"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        Name:
                        <input 
                            type='text' 
                            value={shippingInfo.name}
                            placeholder="Name"
                            required
                            name="name"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        Surname:
                        <input 
                            type='text' 
                            value={shippingInfo.surname}
                            placeholder="Surname"
                            required
                            name="surname"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        Phone:
                        <input 
                            type='text' 
                            value={shippingInfo.phone}
                            placeholder="Phone"
                            required
                            name="phone"
                            onChange={e=>handleShippingChange(e.target.value,e.target.name)}
                        />
                        

                        <Button variant="contained" type='submit'>Create order</Button>
                    </form>
                    </div>

                    
            </div>

            {/* ---------------------------------ORDER SUMMARY---------------------------------- */}
        <div style={{scale: "100%"}} >
            
            {/* if empty array */}

            {cart[0].length==0 ? (
                <div className="cartEmpty">
                <p>Your cart is empty !</p>
                <div className="startShopping">
                    <Link to="/">

                        Start Shopping
                    </Link>
                </div>
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
                                        <div className="quantityCount">Count: {cartItem.amount}</div>
                                    </div>
                                    
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

                </div>
            )}
            </div>
            {/* -------------------------------------order summary end */}



            

        </>
)}
</div>
</ThemeProvider>
</div>
)

}

export default Checkout;








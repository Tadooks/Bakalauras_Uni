import React, { useState,useEffect } from 'react';
import {Link,useNavigate, useParams} from "react-router-dom"
import Button from '@material-ui/core/Button';
import { auth } from '../firebase_config';

//if success, clear cart. and show success transfer complete,
//send receipt email with more info.

//Info perduotas for createorder
//Order number, email, ,  payment status, delivery status, order date
//products
// shipping info,


const Checkout=()=> {
  
  
  const [userAuthId, setUserAuthId] = useState('');
  //Add states
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  
  const [totalProductCount, setTotalProductCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');
  const [deliveryStatus, setDeliveryStatus] = useState('not shipped');
  const [orderDate, setOrderDate] = useState('');

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



  //set cart local storage to 0
  const [cart, setCart] = useState([window.localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : []]);

  const [subtotal,setSubtotal] = useState();


  const [refresh,setRefresh] = useState(false);


  //----------PRODUCT data states----------
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //---------------------------------------
  

  const navigate = useNavigate()

  // //-------GET PRODUCT DATA FROM API------------
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


  //------------BUTTON GOES CLICKTY CLICK--------------------------
  //------------Create product------------
  const handleCreateOrder=(e)=>{
    e.preventDefault()
    console.log("handleCreateOrder was clicked!");

    
    console.log("shippingInfo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.log(shippingInfo);

    


    // console.log(order);
    fetch(`http://localhost:3001/orders`,{
        method: "POST",
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'user': auth.currentUser.uid
        },
        body: JSON.stringify(
            { 
                authid: userAuthId,
                ordernumber: orderNumber,
                email: email,
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
        alert('Created successfully');
        navigate('/home')//PAYMENT INFO PAGE
      })
      .then((usefulData) => {
        setLoading(false);
        setData(usefulData);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`)
      });


      setRefresh(true);
    return;
}
//------------------------------------


  return(
    <div style={{ color: 'white'}}>

        {/* when empty this will get stuck on loading. */}
        {/* {loading ?(
            <p>Loading...</p>
            
        ) : error ? (
            <p>An error occured</p>
        ):( */}

        {/* if empty array */}
        {cart==[] ? (
                <div className="cartEmpty">
                <p>Your cart is empty !</p>
                <div className="startShopping">
                    <Link to="/">

                        Start Shopping
                    </Link>
                </div>
                </div>
            ) : (//LOADED cart
        <>
            <div className='StyledCreateOrder'>
                <div>
                    <div >Create window content</div>

                    <form className="StyledForm" onSubmit={handleCreateOrder} >
                      <div style={{ background: 'grey'}} >
                        authid:
                        <input 
                            type='text' 
                            value={userAuthId}
                            placeholder="Auth id xd"
                            required
                            onChange={e => setUserAuthId(e.target.value)}
                        />
                        <br></br>
                        Order number:
                        <input 
                            type='text' 
                            value={orderNumber}
                            placeholder="Order number"
                            required
                            onChange={e => setOrderNumber(e.target.value)}
                        />
                        <br></br>
                        Order date:
                        <input 
                            type='text' 
                            value={orderDate}
                            placeholder="Order date"
                            required
                            onChange={e=>setOrderDate(e.target.value)}
                        />
                        <br></br>
                        Email:
                        <input 
                            type='text' 
                            value={email}
                            placeholder="Email"
                            required
                            onChange={e=>setEmail(e.target.value)}
                        />
                      </div>

                    
                        
                        
                        Shipping info
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
            <div className='auth'>
            <h1>Order summary</h1>
            {/* if empty array */}
            {cart==[] ? (
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
                                            <div className="count">{cartItem.amount}</div>
                                        </div>
                                        
                                    </td>
                                </tr>
                            </>
                        ))}
                    </table>
                    </div>
                    <div className="cart-summary">
                        <div className="cart-checkout">
                            <div className="subtotal">
                                <span>Subtotal: </span>
                                <span>{subtotal} €</span>
                            </div>
                        </div>
                    </div>

                </div>
            )}
  </div>
{/* ------------------------------------------------------------------order summary end */}

        </>
)}
</div>
)

}

export default Checkout;








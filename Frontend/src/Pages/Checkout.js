import React, { useState,useEffect } from 'react';
import {Link} from "react-router-dom"


//if success, clear cart. and show success transfer complete,
//send receipt email with more info.

const Checkout=()=> {
  const [formValues, setFormValues] = useState({
    firstname: '',
    lastname: '',
    phonenumber: '',
    address: '',
    city: '',
    country: '',
    zip: '',
  });


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
      const tempArray = JSON.parse(window.localStorage.getItem("cart"))[0];

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
  var tempCartSum;
  

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm(formValues);
    if (Object.keys(errors).length === 0) {
      // Submit the form data to the server
      console.log(formValues);
    } else {
      setFormErrors(errors);
    }
  };

  //uhh? yra kazkaip auto sitas dalykas?
  const validateForm = (values) => {
    let errors = {};
    if (!values.name) {
      errors.name = 'Name is required';
    }
    if (!values.lastname) {
      errors.name = 'Lastname is required';
    }
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    if (!values.address) {
      errors.address = 'Address is required';
    }
    if (!values.city) {
      errors.city = 'City is required';
    }
    if (!values.country) {
      errors.country = 'country is required';
    }
    if (!values.zip) {
      errors.zip = 'ZIP code is required';
    } else if (!/^\d{5}(?:[-\s]\d{4})?$/.test(values.zip)) {
      errors.zip = 'ZIP code is invalid';
    }
    return errors;
  };

  return (
    <div style={{ color: 'white'}} className="container">

      <div className='auth'>
        <h1>Shipping</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">First name:</label>
            <input type="text" id="name" name="name" value={formValues.name} onChange={handleChange} />
            {formErrors.name && <div className="input-error">{formErrors.name}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="name">Last name:</label>
            <input type="text" id="lastname" name="lastname" value={formValues.lastname} onChange={handleChange} />
            {formErrors.name && <div className="input-error">{formErrors.lastname}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="tel">Email:</label>
            <input type="email" id="email" name="email" value={formValues.email} onChange={handleChange} />
            {formErrors.email && <div className="input-error">{formErrors.email}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="address">Address:</label>
            <input type="text" id="address" name="address" value={formValues.address} onChange={handleChange} />
            {formErrors.address && <div className="input-error">{formErrors.address}</div>}
          </div>
          <div className="form-group">
            <label>City:</label>
            <input type="text" id="city" name="city" value={formValues.city} onChange={handleChange} />
            {formErrors.city && <div className="input-error">{formErrors.city}</div>}
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input type="text" id="country" name="country" value={formValues.country} onChange={handleChange} />
            {formErrors.country && <div className="input-error">{formErrors.country}</div>}
          </div>
          <div className="form-group">
            <label htmlFor="zip">ZIP Code:</label>
            <input type="text" id="zip" name="zip" value={formValues.zip} onChange={handleChange} />
            {formErrors.zip && <div className="input-error">{formErrors.zip}</div>}
          </div>
          <button type="submit">Place Order</button>
        </form>
      </div>
      











      <div className='auth'>
        <h1>Order summary</h1>
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

    </div>
  );

}

export default Checkout;
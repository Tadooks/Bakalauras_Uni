
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';

import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'

const EditOrder = () => {

    //Add states
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [products, setProducts] = useState('');
    const [shippingInfo, setShippingInfo] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [deliveryStatus, setDeliveryStatus] = useState('not shipped');
    const [orderDate, setOrderDate] = useState('');

    console.log("?????????????????????????")

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const navigate = useNavigate()

    //get id from URL
    const idFromURL= window.location.pathname.split('/').pop();
    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/orders/${idFromURL}`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //setting fetched data
            setData(usefulData);
            setOrderNumber(usefulData.ordernumber);
            setEmail(usefulData.email)
            setProducts(usefulData.products)
            setShippingInfo(usefulData.shippinginfo)
            setPaymentStatus(usefulData.paymentstatus)
            setDeliveryStatus(usefulData.deliverystatus)
            setOrderDate(usefulData.orderdate)

            setLoading(false);//stop loading once data is fetched.
            
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

          setRefresh(false);
    }, []);
    // //------------------------------------------

    

    //------------EDIT PRODUCT------------
    const handleEditOrder=(e,order)=>{
        e.preventDefault()
        console.log("handleEditOrder was clicked!");

        // console.log(order);
        fetch(`http://localhost:3001/orders/${idFromURL}`,{
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'user': auth.currentUser.uid
            },
            body: JSON.stringify(
                { 
                    uid: idFromURL,
                    ordernumber: orderNumber,
                    email: email,
                    products: products,
                    shippinginfo: shippingInfo,
                    paymentstatus: paymentStatus,
                    deliverystatus: deliveryStatus,
                    orderdate: orderDate,
                }
            )
        })
          .then(response => {
            alert('Edited successfully');
            navigate('/orderadminpanel')
          })
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

    
        //   setRefresh(true);
        return;
    }
    //------------------------------------

    return(
        <div style={{ color: 'white'}}>
            <Link to='/orderadminpanel'>
                <Button variant="contained">Back</Button>
            </Link>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
                
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
    
                {/* Dialog content goes here */}
                <div>Edit window content</div>

                <Link to='/orderadminpanel'>
                    <Button variant="contained">Back</Button>
                </Link>
                

                <form onSubmit={handleEditOrder} >
                
                    Order number
                    <div>{orderNumber}</div>
                    Email
                    <div>{email}</div>
                    Products:
                    <div>Products info </div>
                    Shipping info:
                    <div>Shipping info</div>
                    Total price:
                    <div>Total</div>
                    Payment status:
                    <select id="product-type" name="product-type" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                        <option value="unpaid">unpaid</option>
                        <option value="paid">paid</option>
                    </select>
                    Delivery status:
                    <select id="product-type" name="product-type" value={deliveryStatus} onChange={e => setDeliveryStatus(e.target.value)}>
                        <option value="unpaid">not shipped</option>
                        <option value="unpaid">shipped</option>
                        <option value="paid">arrived</option>
                    </select>
                    Order date
                    <div>Shipping info</div>
                    <Button variant="contained" type='submit'>Save changes</Button>
                </form>


            </>
            )}
        </div>
    )
}

export default EditOrder;
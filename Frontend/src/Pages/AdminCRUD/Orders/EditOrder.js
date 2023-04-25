
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@material-ui/core";

import {auth} from '../../../firebase_config'

const EditOrder = () => {

    const [userAuthId, setUserAuthId] = useState('');
    //Add states
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    const [products, setProducts] = useState('');
    const [shippingInfo, setShippingInfo] = useState('');
    const [totalProductCount, setTotalProductCount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [deliveryStatus, setDeliveryStatus] = useState('not shipped');
    const [orderDate, setOrderDate] = useState('');



    const [productDialogStuff, setProductDialogStuff] = useState("");
    const [shippingDialogStuff, setShippingDialogStuff] = useState("");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenProducts, setDialogOpenProducts] = useState(false);
    const [dialogOpenShipping, setDialogOpenShipping] = useState(false);



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
            console.log("usefulData");
            console.log(usefulData);
            setUserAuthId(usefulData.authid)
            setOrderNumber(usefulData.ordernumber);
            setEmail(usefulData.email)
            setProducts(usefulData.products)
            setShippingInfo(usefulData.shippinginfo)
            setTotalProductCount(usefulData.totalproductcount)
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
    const handleEditOrder=(e)=>{
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
                    authid: userAuthId,
                    ordernumber: orderNumber,
                    email: email,
                    products: products,
                    shippinginfo: shippingInfo,
                    totalproductcount: totalProductCount,
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











// Dialog close
const handleCloseProducts = () => {
    setDialogOpenProducts(false);
};
const handleCloseShipping = () => {
    setDialogOpenShipping(false);
};




const OpenProductsDialog=async(orderarray)=>{

    await setProductDialogStuff(orderarray);
    setDialogOpenProducts(true);

}
const OpenShippingDialog=async(shippinginfo)=>{


  await setShippingDialogStuff(shippinginfo);
  setDialogOpenShipping(true);

}

const ProductsVisual=()=>{

  let tempSubtotal=0;
  if(productDialogStuff){
    productDialogStuff?.map((item) => (
      tempSubtotal=item.totalprice+tempSubtotal
    ))
  }
  

  return(
  <>
    <Dialog open={dialogOpenProducts} onClose={handleCloseProducts}>
        {/* Dialog content goes here */}
        
        <button variant="contained" onClick={handleCloseProducts}>Close</button>
        Order number:
        <table>
                <thead>
                  <tr>
                    
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Single product price</th>
                    <th>Combined price</th>
                    <th>Total product count</th>
                    
                  </tr>
                </thead>
                <tbody>
                {productDialogStuff && 
                    productDialogStuff?.map((item) => (
                      <tr>
                        <td>{item.name}</td>
                        <td>{item.type}</td>
                        <td>{item.amount}</td>
                        <td>{item.price} €</td>
                        <td>{item.totalprice} €</td>
                      </tr>
                    ))
                  }
                </tbody>
        </table>
        Subtotal of all products: {tempSubtotal} €
    </Dialog>
  </>
  );
}


const ShippingVisual=()=>{


  return(
  <>
    {/*-------------------Dialog EDIT window popup-------------------*/}
    <Dialog open={dialogOpenShipping} onClose={handleCloseShipping}>
        {/* Dialog content goes here */}
        
        <button variant="contained" onClick={handleCloseShipping}>Close</button>
        Order number:
        <table>
                <thead>
                  <tr>
                    
                    <th>Country</th>
                    <th>City</th>
                    <th>Post code</th>
                    <th>Name</th>
                    <th>Surname</th>
                    <th>Phone</th>
                    
                  </tr>
                </thead>
                <tbody>
                <tr>
                        <td>{shippingDialogStuff.country}</td>
                        <td>{shippingDialogStuff.city}</td>
                        <td>{shippingDialogStuff.post}</td>
                        <td>{shippingDialogStuff.name}</td>
                        <td>{shippingDialogStuff.surname}</td>
                        <td>{shippingDialogStuff.phone}</td>
                </tr>
                </tbody>
        </table>
    </Dialog>
  </>
  );
}





    const CalculateTotal=(item) => {
        let totalItemSum=0;
        item.map((temp) =>{
          totalItemSum=totalItemSum+temp.totalprice;
        })
        return totalItemSum
    };



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
                    <span className="clickableText" onClick={()=>OpenProductsDialog(products)}>Products info</span >

                    <div>Shipping info</div>
                    <span className="clickableText" onClick={()=>OpenShippingDialog(shippingInfo)}>Shipping info</span >
                   
                   <div>Total product count</div>
                   {/* calculated in backend */}
                   <div>{totalProductCount}</div>

                    Total price:
                    {/* Product prices are set in backend, matched according to the product */}
                    <div>{CalculateTotal(products)} €</div>

                    Payment status:
                    <select id="product-type" name="product-type" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                        <option value="unpaid">unpaid</option>
                        <option value="paid">paid</option>
                    </select>

                    Delivery status:
                    <select id="product-type" name="product-type" value={deliveryStatus} onChange={e => setDeliveryStatus(e.target.value)}>
                        <option value="not shipped">not shipped</option>
                        <option value="shipped">shipped</option>
                        <option value="arrived">arrived</option>
                    </select>

                    Order date
                    <div>Shipping info</div>

                    <Button variant="contained" type='submit'>Save changes</Button>
                </form>

                <ProductsVisual/>
                <ShippingVisual/>

            </>
            )}
        </div>
    )
}

export default EditOrder;
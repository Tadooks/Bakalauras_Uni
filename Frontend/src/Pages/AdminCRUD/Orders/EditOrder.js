
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"

import Dialog from '@material-ui/core/Dialog';


import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
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
        
        fetch(`https://bakalaurasserverrender.onrender.com/orders/${idFromURL}`,{
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
        fetch(`https://bakalaurasserverrender.onrender.com/orders/${idFromURL}`,{
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

  let tempSubtotal=0.00;
  if(productDialogStuff){
    productDialogStuff?.map((item) => (
      tempSubtotal=item.totalprice+tempSubtotal
    ))
  }

  return(
  <>
    <Dialog open={dialogOpenProducts} onClose={handleCloseProducts}>
        {/* Dialog content goes here */}
        <div className="DialogPopup" >
        <Button variant="contained" onClick={handleCloseProducts}>Close</Button>
        <h4 style={{ textAlign: 'center' }}><b > Product info</b> </h4>
        <table>
                <thead>
                  <tr>
                    
                    <th>Name</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Size</th>
                    <th>Single product price</th>
                    <th>Combined price</th>
                    
                  </tr>
                </thead>
                <tbody>
                {productDialogStuff && 
                    productDialogStuff?.map((item) => (
                      <tr>
                        <td className="tableInfo">{item.name}</td>
                        <td className="tableInfo">{item.type}</td>
                        <td className="tableInfo">{item.amount}</td>
                        <td className="tableInfo">{item.productSize}</td>
                        <td className="tableInfo">{item.price} €</td>
                        <td className="tableInfo">{item.totalprice.toFixed(2)} €</td>
                      </tr>
                    ))
                  }
                </tbody>
        </table>
        <span style={{ padding: '5px' }}> Subtotal of all products: {tempSubtotal.toFixed(2)} € </span>
        </div>
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
        <div className="DialogPopup" >
        <Button variant="contained" onClick={handleCloseShipping}>Close</Button>
        <h4 style={{ textAlign: 'center' }}><b > Shipping info</b></h4>
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
                        <td className="tableInfo">{shippingDialogStuff.country}</td>
                        <td className="tableInfo">{shippingDialogStuff.city}</td>
                        <td className="tableInfo">{shippingDialogStuff.post}</td>
                        <td className="tableInfo">{shippingDialogStuff.name}</td>
                        <td className="tableInfo">{shippingDialogStuff.surname}</td>
                        <td className="tableInfo">{shippingDialogStuff.phone}</td>
                </tr>
                </tbody>
        </table>
        </div>
    </Dialog>
  </>
  );
}





    const CalculateTotal=(item) => {
        let totalItemSum=0;
        item.map((temp) =>{
          totalItemSum=totalItemSum+temp.totalprice;
        })
        return totalItemSum.toFixed(2)
    };



    //--------------------CSS for MUI table-------------------------
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
            
            <h1 style={{ textAlign: 'center' }}>Edit order</h1>
            <div style={{ textAlign: 'center' }}>
              <Link to='/orderadminpanel'>
                  <Button variant="contained">Back</Button>
              </Link>
            </div>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
                
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
    
                {/* Dialog content goes here */}
                
              <div className='EditProduct-Screenerino'>

                
                <form onSubmit={handleEditOrder} >
                
                    <b>Order number:</b>
                    <div>{orderNumber}</div>
                    <br></br>
                    <b>Email:</b>
                    <div>{email}</div>
                    <br></br>


                    <b>Products:</b>
                    <br></br>
                    <span className="clickableText" onClick={()=>OpenProductsDialog(products)}>Products info</span >
                    <br></br><br></br>
                    
                    <div>Shipping info</div>
                    <span className="clickableText" onClick={()=>OpenShippingDialog(shippingInfo)}>Shipping info</span >
                    <br></br><br></br>
                    
                   <div>Total product count</div>
                   {/* calculated in backend */}
                   <div>{totalProductCount}</div>
                   <br></br><br></br>

                    Total price:
                    {/* Product prices are set in backend, matched according to the product */}
                    <div>{CalculateTotal(products)} €</div>

                    <br></br><br></br>
                    Payment status:
                    <select id="product-type" name="product-type" value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)}>
                        <option value="unpaid">unpaid</option>
                        <option value="paid">paid</option>
                    </select>
                    <br></br><br></br>
                    Delivery status:
                    <select id="product-type" name="product-type" value={deliveryStatus} onChange={e => setDeliveryStatus(e.target.value)}>
                        <option value="not shipped">not shipped</option>
                        <option value="shipped">shipped</option>
                        <option value="arrived">arrived</option>
                    </select>
                    <br></br><br></br>
                    Order date
                    <br></br>
                    {new Date(orderDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour:"numeric",minute:"numeric"}).replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")}
                    <br></br><br></br>
                    <Button variant="contained" type='submit'>Save changes</Button>
                </form>

                <ProductsVisual/>
                <ShippingVisual/>
                </div>
            </>
            )}
            </ThemeProvider>
        </div>
    )
}

export default EditOrder;
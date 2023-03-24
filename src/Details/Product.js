import {React, useState, useEffect } from "react";
import {  useParams,Link } from 'react-router-dom';


const Product = ({}) => {
    
    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    let { id } = useParams();
    const [dataID, setDataID] = useState();
    
    //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        fetch(`http://localhost:3001/products`)
          .then(response => response.json())
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
            setDataID(id);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
    }, [id]);


    let currentProduct ="null";
    if(loading == true)
    {
        console.log("it hasnt loaded yet");
    }
    else if( error!=null )
    {
        console.log("error");
    }
    else
    {
        console.log(dataID-1);
        console.log(data[dataID-1]);
        currentProduct = data[dataID-1];
    }
    
    

    
    
    return(
        <div style={{ color: 'white'}}> Cia bus id: {dataID}
        <Link to={`/shop`} >
            <button>BACK</button>
        </Link>
        <div>Product name: {currentProduct.name}</div>
        <div>Product image: {currentProduct.image}</div>
        <div>Product description: {currentProduct.desc}</div>
        <div>Product price: {currentProduct.price} europiniu moneys</div>
        
        <div>Amount: + 0 - </div>
        <button>Add to cart</button>
        </div>
    );
};

export default Product;

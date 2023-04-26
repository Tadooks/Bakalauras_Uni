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
        fetch(`http://localhost:3001/products/` + id)
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

    
    
    return(
        <div style={{ color: 'white'}}>
        {loading ?(
            <p>Loading...</p>
        ) : error ? (
            <p>An error occured</p>
        ):(
        <>
            <div> Cia bus id: {dataID}
            <Link to={`/shop`} >
                <button>BACK</button>
            </Link>
            <div>Product name: {data.name}</div>
            <div>Product image: {data.image}</div>
            <div>Product description: {data.desc}</div>
            <div>Product price: {data.price} europiniu moneys</div>
            
            <div>Amount: + 0 - </div>
            <button>Add to cart</button>
            </div>
        </>
        )}
        </div>
    );
};

export default Product;

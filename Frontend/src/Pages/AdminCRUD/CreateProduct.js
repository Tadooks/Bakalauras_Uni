
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';

import { Link,useNavigate } from "react-router-dom";

import { IconButton } from "@material-ui/core";


const CreateProduct = () => {

    //Add states
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productType, setProductType] = useState('');

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const navigate = useNavigate()


    
    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`http://localhost:3001/products`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
          setRefresh(false);
    }, [refresh]);
    // //------------------------------------------

    //------------CREATE PRODUCT------------
    const handleCreateProduct=e=>{
        e.preventDefault()
        console.log("handleCreateProduct was clicked!");

        fetch(`http://localhost:3001/products`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(
                { 
                    id: productId,
                    name: productName,
                    desc: productDescription,
                    price: productPrice,
                    image: productImage,
                    type: productType

                }
            )
        })
          .then(response => {
            alert('Created successfully');
            navigate('/adminpanel')
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
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>

                {/* Dialog content goes here */}
                <div>Dialog Content</div>

                <Link to='/adminpanel'>
                <Button variant="contained">Close</Button>
                </Link>
                

                <form onSubmit={handleCreateProduct} >
                <input 
                    type='text' 
                    value={productId}
                    placeholder="Product id"
                    required
                    onChange={e => setProductId(e.target.value)}
                />

                <input 
                    type='text' 
                    value={productName}
                    placeholder="Product name"
                    required
                    onChange={e=>setProductName(e.target.value)}
                />
                <input 
                    type='number' 
                    value={productPrice}
                    placeholder="Price"
                    required
                    onChange={e=>setProductPrice(e.target.value)}
                />
                <input 
                    type='text' 
                    value={productDescription}
                    placeholder="Description"
                    required
                    onChange={e=>setProductDescription(e.target.value)}

                />
                <input 
                    type='text' 
                    value={productImage}
                    placeholder="Image"
                    required
                    onChange={e=>setProductImage(e.target.value)}

                />
                <input 
                    type='text' 
                    value={productType}
                    placeholder="Type"
                    required
                    onChange={e=>setProductType(e.target.value)}

                />

                <Button variant="contained" type='submit'>Add new</Button>
                </form>


            
        

            </>
            )}
        </div>
    )
}

export default CreateProduct;
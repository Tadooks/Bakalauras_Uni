
import React,{useState, useEffect} from "react"
import Button from '@material-ui/core/Button';

import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton } from "@material-ui/core";


//storage for adding files
import { getStorage, ref, uploadBytes  } from "firebase/storage";
const storage = getStorage();


const EditProduct = () => {

    //Add states
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productType, setProductType] = useState('');


    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");

    // const tempStorage = storage;

    

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
        
        fetch(`http://localhost:3001/products/${idFromURL}`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //setting fetched data
            setData(usefulData);
            
            setProductId(usefulData.id);
            setProductName(usefulData.name);
            setProductPrice(usefulData.price);
            setProductDescription(usefulData.desc);
            setProductImage(usefulData.image);
            setProductType(usefulData.type);

            setLoading(false);//stop loading once data is fetched.
            
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

          setRefresh(false);
    }, []);
    // //------------------------------------------

    

    //------------EDIT PRODUCT------------
    const handleEditProduct=(e,product)=>{
        e.preventDefault()
        console.log("handleEditProduct was clicked!");

        // console.log(product);
        fetch(`http://localhost:3001/products/${idFromURL}`,{
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(
                { 
                    uid: idFromURL,
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
            alert('Edited successfully');
            navigate('/productadminpanel')
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


    //allow admin to input only numbers
    const handlePriceChange = (e) => {
        const regex = /^[0-9]+(\.[0-9]{1,2})?$/; // regex to validate money values with up to 2 decimal places
        if (e.target.value === '' || regex.test(e.target.value)) {
          setProductPrice(e.target.value);
        }
    }



    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const mountainsRef = ref(storage, fileName);
            uploadBytes(mountainsRef, file).then((snapshot) => {
                console.log('Uploaded a blob or file!');
            });
        //   setUrl(downloadUrl);
        }
    };


///////////////////////////////////////

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
                <div>Edit window content</div>

                <Link to='/productadminpanel'>
                    <Button variant="contained">Back</Button>
                </Link>
                

                <form onSubmit={handleEditProduct} >
                    id:
                    <input 
                        type='text' 
                        value={productId}
                        placeholder="Product id"
                        required
                        onChange={e => setProductId(e.target.value)}
                    />
                    name:
                    <input 
                        type='text' 
                        value={productName}
                        placeholder="Product name"
                        required
                        onChange={e=>setProductName(e.target.value)}
                    />
                    price:
                    <input 
                        type='number' 
                        value={productPrice}
                        placeholder="Price"
                        step="0.01"
                        required
                        onChange={handlePriceChange}
                    />
                    description:
                    <input 
                        type='text'
                        value={productDescription}
                        placeholder="Description"
                        required
                        onChange={e=>setProductDescription(e.target.value)}

                    />
                    image:
                    <input 
                        type='text' 
                        value={productImage}
                        placeholder="Image"
                        required
                        onChange={e=>setProductImage(e.target.value)}

                    />
                    type:
                    <select id="product-type" name="product-type" value={productType} onChange={e => setProductType(e.target.value)}>
                        <option value="Clothing">Clothing</option>
                        <option value="Audio">Audio</option>
                    </select>

                    

                    <Button variant="contained" type='submit'>Save changes</Button>
                </form>


                <div>
                    <form onSubmit={handleSubmit}>
                        <div>
                        <label htmlFor="fileInput">Select file:</label>
                        <input type="file" id="fileInput" onChange={handleFileChange} />
                        </div>
                        <div
                        style={{ border: "1px dashed black", padding: "1rem" }}
                        >
                        Drop file here
                        </div>
                        <button type="submit">Upload</button>
                    </form>
                    {url && (
                        <div>
                        <p>Download URL:</p>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                        </a>
                        </div>
                    )}
                </div>


            </>

            

            )}
        </div>
    )
}

export default EditProduct;
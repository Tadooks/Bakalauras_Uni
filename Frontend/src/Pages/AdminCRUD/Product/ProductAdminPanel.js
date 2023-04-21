import { firebaseDatabase } from "../../../firebase_config"
import React,{useState, useEffect} from "react"



import { Link } from "react-router-dom";

import { IconButton } from "@material-ui/core";


//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

const ProductAdminPanel = () => {

    //Add states
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productAudio, setProductAudio] = useState('');
    const [productDownload, setProductDownload] = useState('');
    const [productType, setProductType] = useState('');



    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogOpenEdit, setDialogOpenEdit] = useState(false);



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






    //delete not always doing its delete thing
    const handleDeleteProduct=(product)=>{
        console.log("handleDeleteProduct was clicked!");
        console.log(product.uid);
        if(window.confirm("Are you sure you want to delete " + product.name + " ?")){
            
            fetch(`http://localhost:3001/products/${product.uid}`,{
                method: "DELETE",
            body: JSON.stringify({ uid: product.uid })
            })
            .then(response => response.json())
            .then((usefulData) => {
                //console.log(usefulData);
                setLoading(false);
                setData(usefulData);
            })
            .catch((e) => {
                setRefresh(true);
                console.error(`An error occurred: ${e}`)
            });

        
            
        }
        setRefresh(true);
        
        return;
    }



    return(
        <div style={{ color: 'white'}}>

            <Link to='/createproduct'>
                <button>Add product</button>
            </Link>
            {/* when empty this will get stuck on loading. */}
            {loading ?(
                <p>Loading...</p>
            ) : error ? (
                <p>An error occured</p>
            ):(
            <>
            

            ????Search????
            <table>
                    <thead>
                      <tr>
                        <th>Firebase uid</th>
                        <th>Product id</th>
                        <th>Product name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Product type</th>
                        <th>Image</th>
                        <th>Audio</th>
                        <th>Download</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data && 
                        data?.map((product) => (
                          <tr key={product.id}>
                            <td>{product.uid}</td>
                            <td>{product.id}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.desc}</td>
                            <td>{product.type}</td>
                            <td><a href={product.image}>{product.image}</a></td>
                            <td>
                              <ReactPlayer
                                url={product.audio}
                                width="100%"
                                height="50px"
                                playing={false}
                                controls={true}
                              />
                            </td>
                            <td><a href={product.download}>{product.download}</a></td>
                            {/* on edit, open Single product, with screen to edit it? */}
                            {/* Add the open single product  */}

                            <Link to={`/editproduct/${product.uid}`}>
                                <button>Edit</button>
                            </Link>
                            {/* <button onClick={()=>OpenEditDialogWindow(product)}>Edit</button>  */}
                            <button onClick={()=>handleDeleteProduct(product)}>Delete</button>
                            
                            

                            {/* <td>{product.image}</td> */}
                          </tr>
                        ))}
                    </tbody>
            </table>

            
            

            </>
            )}
        </div>
    )
}

export default ProductAdminPanel;

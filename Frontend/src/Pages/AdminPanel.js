import { firebaseDatabase } from "../firebase_config"
import React,{useState, useEffect} from "react"
import { set,ref,child, Database } from "firebase/database"
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { Link } from "react-router-dom";

import { IconButton } from "@material-ui/core";




const AdminPanel = () => {

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
                console.error(`An error occurred: ${e}`)
            });

        
            setRefresh(true);
        }
        
        
        return;
    }


    // Dialog close
    const handleClose = () => {
        setDialogOpen(false);
    };
    // Dialog close
    const handleCloseEdit = () => {
        setDialogOpenEdit(false);
    };


    const OpenDialogWindow=()=>{
        console.log("OpenDialogWindow was clicked!");
        setDialogOpen(true);

        setRefresh(true);
        return;
    }

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
            handleClose();
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

    const EditVisual=(product)=>{
        return(
        <>
        {/*-------------------Dialog EDIT window popup-------------------*/}
        <Dialog open={dialogOpenEdit} onClose={handleCloseEdit}>
            {/* Dialog content goes here */}
            <div>Editing product {product.name}</div>

            <Button variant="contained" onClick={handleCloseEdit}>Close</Button>

            <form onSubmit={handleEditProduct} >
                <input 
                    type='text' 
                    value={product.id}
                    placeholder="Product id"
                    required
                    onChange={e => setProductId(e.target.value)}
                />

                <input 
                    type='text' 
                    value={product.name}
                    placeholder="Product name"
                    required
                    onChange={e=>setProductName(e.target.value)}
                />
                <input 
                    type='number' 
                    value={product.price}
                    placeholder="Price"
                    required
                    onChange={e=>setProductPrice(e.target.value)}
                />
                <input 
                    type='text' 
                    value={product.description}
                    placeholder="Description"
                    required
                    onChange={e=>setProductDescription(e.target.value)}

                />
                <input 
                    type='text' 
                    value={product.image}
                    placeholder="Image"
                    required
                    onChange={e=>setProductImage(e.target.value)}

                />
                <input 
                    type='text' 
                    value={product.type}
                    placeholder="Type"
                    required
                    onChange={e=>setProductType(e.target.value)}

                />

                <Button variant="contained" type='submit'>Save changes</Button>
            </form>
        </Dialog>
        </>
        );
    }

    const OpenEditDialogWindow=(product)=>{
        console.log("OpenEditDialogWindow was clicked!");
        setDialogOpenEdit(true);
        setRefresh(true);
        EditVisual(product);

    }

    //------------EDIT PRODUCT------------
    const handleEditProduct=(product)=>{
        // e.preventDefault()
        console.log("handleEditProduct was clicked!");

        fetch(`http://localhost:3001/products/${product.uid}`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: JSON.stringify(
                { 
                    uid: product.uid,
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
            handleClose();
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

            <Link to='/createproduct'>
                <button>Add neeeew product</button>
            </Link>
            <button onClick={()=>OpenDialogWindow()}>Add new product</button><br></br><br></br>
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
                        <th>Product type</th>
                        <th>Product name</th>
                        <th>Price</th>
                        <th>Description</th>
                        {/* <th>image</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {data && 
                        data?.map((product) => (
                          <tr key={product.id}>
                            <td>{product.uid}</td>
                            <td>{product.id}</td>
                            <td>{ }</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.desc}</td>

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

export default AdminPanel;












            {/* -------------------Dialog CREATE window popup------------------- */}
            {/* <Dialog open={dialogOpen} onClose={handleClose}>
                <div>Dialog Content</div>

                <Button variant="contained" onClick={handleClose}>Close</Button>

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
            </Dialog> */}
            {/* -------------------------------------------- */}
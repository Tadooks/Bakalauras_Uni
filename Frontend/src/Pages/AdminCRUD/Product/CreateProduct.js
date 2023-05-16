
import React,{useState, useEffect} from "react"

import { Link,useNavigate, useParams } from "react-router-dom";

import {auth} from '../../../firebase_config'
import { IconButton, useTheme } from "@material-ui/core";

//https://www.npmjs.com/package/react-player
import ReactPlayer from "react-player";

import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';


//storage for adding files
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
const storage = getStorage();


const CreateProduct = () => {

    //Add states
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productAudio, setProductAudio] = useState('');
    const [productDownload, setProductDownload] = useState('');
    const [productType, setProductType] = useState('Clothing');



    const [file, setFile] = useState(null);


    // const tempStorage = storage;

    //Selection type state
    const [selectedOption, setSelectedOption] = useState('');
    

    //----------PRODUCT data states----------
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //---------------------------------------

    const [refresh,setRefresh] = useState(false);

    const navigate = useNavigate()


    

    // //-------GET PRODUCT DATA FROM API------------
    useEffect(() => {
        
        fetch(`https://bakalaurasserverrender.onrender.com/products`,{
            method: "GET"
        })
          .then(response => response.json())
          .then((usefulData) => {
            //console.log(usefulData);
            setData(usefulData);
            setLoading(false);
            
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });
          setRefresh(false);
    }, [refresh]);
    // //------------------------------------------
    

    //------------Create PRODUCT (save changes button)------------
    const handleCreateProduct=(e)=>{
        e.preventDefault()
        console.log("handleCreateProduct was clicked!");
        console.log(productType)
        //clearing AUDIO and DOWNLOAD if type was Clothing
        if(productType=="Clothing"){
            fetch(`https://bakalaurasserverrender.onrender.com/products`,{
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'user': auth.currentUser.uid
                },
                
                body: JSON.stringify(
                    { 
                        name: productName,
                        desc: productDescription,
                        price: productPrice,
                        image: productImage,
                        audio: "None",
                        type: productType

                    }
                )
            })
            .then(response => {
                alert('Created successfully');
                navigate('/productadminpanel')
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
        //if its Audio type
        else if(productType=="Audio"){
            // console.log(product);
            fetch(`https://bakalaurasserverrender.onrender.com/products`,{
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'user': auth.currentUser.uid
                },
                body: JSON.stringify(
                    { 
                        name: productName,
                        desc: productDescription,
                        price: productPrice,
                        image: productImage,
                        audio: productAudio,
                        type: productType

                    }
                )
            })
            .then(response => {
                alert('Created successfully');
                navigate('/productadminpanel')
            })
            .then((usefulData) => {
                setLoading(false);
                setData(usefulData);
            })
            .catch((e) => {
                console.error(`An error occurred: ${e}`)
            });

            
            return;
        }
        else if(productType=="Misc"){
            // console.log(product);
            fetch(`https://bakalaurasserverrender.onrender.com/products`,{
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                    'user': auth.currentUser.uid
                },
                body: JSON.stringify(
                    { 
                        name: productName,
                        desc: productDescription,
                        price: productPrice,
                        image: productImage,
                        audio: "None",
                        type: productType

                    }
                )
            })
            .then(response => {
                alert('Created successfully');
                navigate('/productadminpanel')
            })
            .then((usefulData) => {
                setLoading(false);
                setData(usefulData);
            })
            .catch((e) => {
                console.error(`An error occurred: ${e}`)
            });

            
            return;
        }
        
    }
    //------------------------------------


    //allow admin to input only numbers
    const handlePriceChange = (e) => {
        const regex = /^(?!0\d)[0-9]+(\.[0-9]{1,2})?$/; // regex to validate money values with up to 2 decimal places
        if (e.target.value === '' || regex.test(e.target.value)) {
          setProductPrice(e.target.value);
        }
    }



    //-----------------Handle file changes---------------------
    //FILE IMAGE UPLOADING 
    const handleFileChangeImage = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.includes("image")) { // Check if image
            setFile({type:1, selectedFile});

        } else {
            alert("Please select a valid image file."); // 
        }
    };

    //FILE AUDIO UPLOADING MP3
    const handleFileChangeAudio = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.includes("audio")) { // check if audio file
            setFile({type:2, selectedFile});

        } else {
            alert("Please select a valid audio file."); 
        }
    };
    //FILE UPLOADING rar archive file (i allow any file to be uploaded)
    const handleFileChangeDownload = (e) => {
        const selectedFile = e.target.files[0];
        setFile({type:3, selectedFile});

    };
    //--------------------------------------------------------



    //getting the actual link to file
    const handleDownloadURL = async (ref) => {
        return await getDownloadURL(ref);
    }

    //on upload, set the url 
  
    const handleUpload = async (type) => {
        if (file && file.type == type) {
            console.log(file);
            const newFile = file.selectedFile;
            const fileName = `${Date.now()}-${newFile.name}`;
            const storageRef = ref(storage, fileName);

            const snapshot = await uploadBytes(storageRef, newFile);
            alert("File " + fileName + " was added successfully")
            console.log('Uploaded file!');
            const naujasURL = await handleDownloadURL(snapshot.ref);//getting the download url
            console.log(naujasURL);
            // setProductImage(url);
            ////nunulinam values, kad nebutu visi vienodi
            //Paskirstom failus: if file is image,
            if(newFile.type.includes("image")){
                setProductImage(naujasURL);
                setFile(null);
            }
            else if(newFile.type.includes("audio")){
                setProductAudio(naujasURL)
                setFile(null);
            }
            else{
                setProductDownload(naujasURL)
                setFile(null);
            }

        }
        else
            alert("No file or wrong file selected!");
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
            <h1 style={{ textAlign: 'center' }}>Create product</h1>

            <ThemeProvider theme={theme}>
            <div style={{ textAlign: 'center' }}>
                <Link to='/productadminpanel'>
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
                <div className='EditProduct-Screenerino'>
                    
                    <div>
                        <div >Edit window content</div>


                        <form className="StyledForm" onSubmit={handleCreateProduct} >
                            Name:
                            <input 
                                type='text' 
                                value={productName}
                                placeholder="Product name"
                                required
                                onChange={e=>setProductName(e.target.value)}
                            />
                            Price:
                            <input 
                                type='number' 
                                value={productPrice}
                                placeholder="Price"
                                step="0.01"
                                required
                                onChange={handlePriceChange}
                            />
                            Description:
                            <textarea 
                                type='text'
                                value={productDescription}
                                placeholder="Description"
                                required
                                onChange={e=>setProductDescription(e.target.value)}

                            />

                            Image:
                            <textarea 
                                type='text' 
                                value={productImage}
                                placeholder="Image"
                                required
                                onChange={e=>setProductImage(e.target.value)}

                            />
                            

                            Type:
                            <select id="product-type" name="product-type" value={productType} onChange={e => setProductType(e.target.value)}>
                                <option value="Clothing">Clothing</option>
                                <option value="Audio">Audio</option>
                                <option value="Misc">Miscellaneous</option>
                            </select>
                            

                            {productType == "Audio" && (
                            <>
                            Audio url:
                            <textarea 
                                type='text' 
                                value={productAudio}
                                placeholder="Image"
                                required
                                onChange={e=>setProductAudio(e.target.value)}
                                
                            />
                            </>
                            )}
                            

                            

                            <Button variant="contained" type='submit'>Save changes</Button>
                        </form>
                        </div>
                    </div>    

                    <div className="bonus-Product">  
                        {/* We always show image preview */}
                        <div>
                                <div className="crudFilePreview">
                                    <form onSubmit={e => {
                                        e.preventDefault();
                                        handleUpload(1);
                                    }
                                        }>
                                        <div>
                                        <label htmlFor="imageInput">Select an image file:</label>
                                        <input type="file" id="imageInput" onChange={handleFileChangeImage} />
                                        </div>
                                        <Button  variant="contained" type="submitImage">Upload</Button>
                                    </form>
                                    
                                    Image preview:
                                    {productImage && (
                                    <div>
                                        {/* <a href={productImage}>{productImage}</a> */}
                                        <img src={productImage} alt={productImage} width="250" height="250"></img>
                                    </div>
                                    )}
                                    
                                </div>
                        </div>
                        

                        {/* If Audio is selected we show image upload */}
                        {productType == "Audio" && (
                        <div>
                            
                            <div className="crudFilePreview">

                                <div className="crudFilePreview">
                                    <form onSubmit={e => {
                                                e.preventDefault();
                                        handleUpload(2);
                                    }
                                        }>
                                        <div>
                                        <div>Audio preview file</div>
                                        <label htmlFor="audioInput">Select an audio mp3 file:</label>
                                        <input type="file" id="audioInput" onChange={handleFileChangeAudio} />
                                        </div>
                                        <Button  variant="contained" type="submitAudio">Upload</Button>
                                    </form>
                                    
                                    Audio url and preview:
                                    {productAudio && (
                                    <div>
                                        {/* <a href={productAudio}>{productAudio}</a> */}
                                        <ReactPlayer
                                            url={productAudio}
                                            width="100%"
                                            height="50px"
                                            playing={false}
                                            controls={true}
                                        />
                                    </div>
                                    )}
                                </div>

                                
                        
                                
                            </div>
                        </div>
                        )}
                    </div>      
                        
                

            </>

            

            )}
            </ThemeProvider>
        </div>
    )
}

export default CreateProduct;



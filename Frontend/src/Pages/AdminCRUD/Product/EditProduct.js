
import React,{useState, useEffect} from "react"
import Button from '@material-ui/core/Button';

import { Link,useNavigate, useParams } from "react-router-dom";

import { IconButton, useTheme } from "@material-ui/core";


//storage for adding files
import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage";
const storage = getStorage();


const EditProduct = () => {

    //Add states
    const [productId, setProductId] = useState('');
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState(0);
    const [productDescription, setProductDescription] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productAudio, setProductAudio] = useState('');
    const [productDownload, setProductDownload] = useState('');
    const [productType, setProductType] = useState('');


    const [file, setFile] = useState(null);
    const [url, setUrl] = useState("");

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
            setProductAudio(usefulData.audio);
            setProductDownload(usefulData.download);
            setProductType(usefulData.type);

            setLoading(false);//stop loading once data is fetched.
            
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
          });

          setRefresh(false);
    }, [refresh]);
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
                    audio: productAudio,
                    download: productDownload,
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



    //-----------------Handle file changes---------------------
    //FILE IMAGE UPLOADING 
    const handleFileChangeImage = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.includes("image")) { // Check if the selected file is an image
            setFile(selectedFile);

        } else {
            alert("Please select a valid image file."); // Display an error message if the selected file is not an image
        }
    };

    //FILE AUDIO UPLOADING MP3
    const handleFileChangeAudio = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.includes("audio")) { // Check if the selected file is an audio file
            setFile(selectedFile);

        } else {
            alert("Please select a valid audio file."); // Display an error message if the selected file is not an audio file
        }
    };
    //FILE UPLOADING rar archive file (i allow any file to be uploaded)
    const handleFileChangeDownload = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

    };
    //--------------------------------------------------------



    //getting the actual link to file
    const handleDownloadURL = async (ref) => {
        const downloadURL = await getDownloadURL(ref);
        setUrl(downloadURL);
        console.log("Download URL:", downloadURL);
    }

    //on upload, set the url 
    const handleUpload = async (e) => {
        e.preventDefault();
        if (file) {
            const fileName = `${Date.now()}-${file.name}`;
            const storageRef = ref(storage, fileName);
            uploadBytes(storageRef, file).then((snapshot) => {
                alert("File " + fileName + " was added successfully")
                console.log('Uploaded file!');
                handleDownloadURL(snapshot.ref);//getting the download url
                
                // setProductImage(url);
                ////nunulinam values, kad nebutu visi vienodi
                //Paskirstom failus: if file is image,
                if(file.type.includes("image")){
                    setProductImage(url);
                    setUrl("");//nunulinam values, kad nebutu visi vienodi
                }
                else if(file.type.includes("audio")){
                    setProductAudio(url)
                    setUrl("");
                }
                else{
                    setProductDownload(url)
                    setUrl("");
                }
            });

        }
        else
            alert("No file or wrong file selected!");
    };
    // const handleUploadAudio = async (e) => {
    //     e.preventDefault();
    //     if (file) {
    //         const fileName = `${Date.now()}-${file.name}`;
    //         const storageRef = ref(storage, fileName);
    //         uploadBytes(storageRef, file).then((snapshot) => {
    //             alert("File " + fileName + " was added successfully")
    //             console.log('Uploaded file!');
    //             handleDownloadURL(snapshot.ref);//getting the download url
                

    //             setProductAudio(url)
    //             setUrl("");
    //         });

    //     }
    //     else
    //         alert("No file or wrong file selected!");
    // };
    // const handleUploadDownload= async (e) => {
    //     e.preventDefault();
    //     if (file) {
    //         const fileName = `${Date.now()}-${file.name}`;
    //         const storageRef = ref(storage, fileName);
    //         uploadBytes(storageRef, file).then((snapshot) => {
    //             alert("File " + fileName + " was added successfully")
    //             console.log('Uploaded file!');
    //             handleDownloadURL(snapshot.ref);//getting the download url
                

    //             setProductDownload(url)
    //             setUrl("");
    //         });

    //     }
    //     else
    //         alert("No file or wrong file selected!");
    // };


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
                <div className='crudCenter'>
                    <div>
                        <div >Edit window content</div>

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
                                <option value="Merch">Merch</option>
                                <option value="Audio">Audio</option>
                            </select>

                            {productType == "Audio" && (
                            <>
                            audio:
                            <input 
                                type='text' 
                                value={productAudio}
                                placeholder="Image"
                                required
                                onChange={e=>setProductAudio(e.target.value)}

                            />
                            download:
                            <input 
                                type='text' 
                                value={productDownload}
                                placeholder="Image"
                                required
                                onChange={e=>setProductDownload(e.target.value)}

                            />
                            </>
                            )}
                            

                            

                            <Button variant="contained" type='submit'>Save changes</Button>
                        </form>
                        </div>
                        
                        {/* We always show image preview */}
                        <div>
                                <div className="crudFilePreview">
                                    <form onSubmit={handleUpload}>
                                        <div>
                                        <label htmlFor="imageInput">Select an image file:</label>
                                        <input type="file" id="imageInput" onChange={handleFileChangeImage} />
                                        </div>
                                        <button type="submitImage">Upload</button>
                                    </form>
                                    
                                    Image preview:
                                    {productImage && (
                                    <div>
                                        {productImage}
                                        <img src={productImage} alt={productImage} width="400" height="300"></img>
                                    </div>
                                    )}
                                    
                                </div>
                        </div>
                        

                        {/* If Audio is selected we show image upload */}
                        {productType == "Audio" && (
                        <div>

                            <div className="crudFilePreview">

                                <div className="crudFilePreview">
                                    <form onSubmit={handleUpload}>
                                        <div>
                                        <div>Audio preview file</div>
                                        <label htmlFor="audioInput">Select an audio mp3 file:</label>
                                        <input type="file" id="audioInput" onChange={handleFileChangeAudio} />
                                        </div>
                                        <button type="submitAudio">Upload</button>
                                    </form>
                                    
                                    Audio url and preview:
                                    {productAudio && (
                                    <div>
                                        {productAudio}
                                        
                                    </div>
                                    )}
                                </div>

                                
                                <div className="crudFilePreview">
                                    <form onSubmit={handleUpload}>
                                        <div>
                                            <div>Downloadable file</div>
                                            <label htmlFor="downloadInput">Select an archive rar file:</label>
                                            <input type="file" id="downloadInput" onChange={handleFileChangeDownload} />
                                        </div>
                                        <button type="submitDownload">Upload</button>
                                    </form>
                                    
                                    Download file url:
                                    {productDownload && (
                                    <div>
                                        {productDownload}
                                        
                                    </div>
                                    )}
                                </div>
                                
                            </div>
                        </div>
                        )}
                        
                        
                </div>

            </>

            

            )}
        </div>
    )
}

export default EditProduct;
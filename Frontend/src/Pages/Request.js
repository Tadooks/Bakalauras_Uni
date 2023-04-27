import React, {useState,useEffect,useContext} from 'react'
import { AuthContext } from './AuthContextNew';
import {useNavigate} from "react-router-dom"
import { auth } from '../firebase_config';

// import emailjs from '@emailjs/browser'

//data sent: email, genre selection, budget, song length, packs, include project file 
const Request = () => {

  //getting user data from useContext
  const { user } = useContext(AuthContext);

  const [hide, setHide] = useState(false);
  

  const [refresh,setRefresh] = useState(false);


  //----------PRODUCT data states----------
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //---------------------------------------


  //Add states
  const [requestBudget, setRequestBudget] = useState(0);
  const [requestType, setRequestType] = useState('Song request');
  const [requestDescription, setRequestDescription] = useState("");
  const [requestGenre, setRequestGenre] = useState('Other');
  const [requestProject, setRequestProject] = useState('No');
  const [requestPackType, setRequestPackType] = useState('Other');
  const [requestSynthPresetPack, setRequestSynthPresetPack] = useState('Other');



  const navigate = useNavigate()



//   // //-------GET PRODUCT DATA FROM API------------
//   useEffect(() => {
        
//     fetch(`http://localhost:3001/request`,{
//         method: "GET"
//     })
//       .then(response => response.json())
//       .then((usefulData) => {
//         //console.log(usefulData);
//         setData(usefulData);
//         setLoading(false);
        
//       })
//       .catch((e) => {
//         console.error(`An error occurred: ${e}`)
//       });
//       setRefresh(false);
// }, [refresh]);
// // //------------------------------------------




//product types:
// Song request
// Sound pack
// Synth preset pack

console.log("DIS DA MF USER WHOOOA")
console.log(user[0])

//------------BUTTON GOES CLICKTY CLICK--------------------------
  //------------Create product------------
  const handleCreateRequest=(e)=>{
    e.preventDefault()
    console.log("handleCreateOrder was clicked!");

    if(auth.currentUser==null){
      alert("You need to sign in to create a request!")
      navigate('/login')
    }
    else{
      if(requestType=="Song request"){
          fetch(`http://localhost:3001/requests`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                // backend requires whole object
                'user': JSON.stringify(user[0])
            },
            body: JSON.stringify(
                {
                    email: auth.currentUser.email,
                    budget: requestBudget,
                    type: requestType,
                    description: requestDescription,
                    genre: requestGenre,
                    includeproject: requestProject,
                    soundpacktype: "None",
                    synthpresetpack: "None"
                }
            )
          })
          .then(response => {
            alert('Request was sent successfully');
            navigate('/')
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
      if(requestType=="Sound pack"){
          fetch(`http://localhost:3001/requests`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                // backend requires whole object
                'user': JSON.stringify(user[0])
            },
            body: JSON.stringify(
                {
                  email: auth.currentUser.email,
                  budget: requestBudget,
                  type: requestType,
                  description: requestDescription,
                  genre: "",
                  includeproject: "No",
                  soundpacktype: requestPackType,
                  synthpresetpack: "None"
                }
            )
          })
          .then(response => {
            alert('Request was sent successfully');
            navigate('/')
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
      if(requestType=="Synth preset pack"){
          fetch(`http://localhost:3001/requests`,{
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                // backend requires whole object
                'user': JSON.stringify(user[0])
            },
            body: JSON.stringify(
                {
                  email: auth.currentUser.email,
                  budget: requestBudget,
                  type: requestType,
                  description: requestDescription,
                  genre: "",
                  includeproject: "No",
                  soundpacktype: "None",
                  synthpresetpack: requestSynthPresetPack
                }
            )
          })
          .then(response => {
            alert('Request was sent successfully');
            navigate('/')
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
      
    }

    
}
//------------------------------------




//allow admin to input only numbers
const handlePriceChange = (e) => {
  const regex = /^(?!0\d)[0-9]+(\.[0-9]{1,2})?$/; // regex to validate money values with up to 2 decimal places
  if (e.target.value === '' || regex.test(e.target.value)) {
    setRequestBudget(e.target.value);
  }
}










  return (
    <div>
        <h1 className="temp">Request form</h1>
        <div className="temp2">
        <div className='songrequest'>
          <>
                <div className='StyledCreateProduct'>
                    <div>
                        <div >Create window content</div>

                        Email: {user[0].email}

                        <form className="StyledForm" onSubmit={handleCreateRequest} >
                            Type:
                            <select id="product-type" name="product-type" value={requestType} onChange={e => setRequestType(e.target.value)}>
                                <option selected value="Song request">Song request</option>
                                <option selected value="Sound pack">Sound pack</option>
                                <option selected value="Synth preset pack">Synth preset pack</option>
                            </select>
                            
                            {/* Minimum and maximum budget */}
                            Budget:
                            <input 
                                type='number' 
                                value={requestBudget}
                                placeholder="Price"
                                step="0.01"
                                required
                                onChange={handlePriceChange}
                            />

                            
                            {/* If its a Song Request */}
                            {requestType == "Song request" && (
                            <>
                              Genre:
                              <select id="product-type" name="product-type" value={requestGenre} onChange={e => setRequestGenre(e.target.value)}>
                                
                                <option selected value="Other">Other</option>
                                <option selected value="Rock">Rock</option>
                                <option selected value="Punk">Punk</option>
                                <option selected value="Metal">Metal</option>
                                <option selected value="Ambience">Ambience</option>
                                <option selected value="Synthwave">Synthwave</option>
                                <option selected value="Drum and bass">Drum and bass</option>
                                <option selected value="Rap">Drum and bass</option>
                                <option selected value="House">House</option>
                                <option selected value="Techno">Techno</option>
                                <option selected value="Dubstep">Dubstep</option>
                                
                              </select>

                              Project file: (do you want to receive the full project file)
                              <select id="product-type" name="product-type" value={requestProject} onChange={e => setRequestProject(e.target.value)}>
                                
                                <option selected value="None">No</option>
                                <option selected value="Yes">Yes</option>
                              </select>
                            </>)}

                            {requestType == "Sound pack" && (
                            <>
                              Sound pack type:
                              <select id="product-type" name="product-type" value={requestPackType} onChange={e => setRequestPackType(e.target.value)}>
                                <option selected value="Drumkit">Drumkit</option>
                                <option selected value="Ambience sounds">Ambience sounds</option>
                                <option selected value="Other">Other</option>
                              </select>
                            </>)}

                            {requestType == "Synth preset pack" && (
                            <>
                              Synth preset pack type
                              <select id="product-type" name="product-type" value={requestSynthPresetPack} onChange={e => setRequestSynthPresetPack(e.target.value)}>
                                <option selected value="Serum bass">Serum bass</option>
                                <option selected value="Ambience sounds">Serum pads</option>
                                <option selected value="Other">Other</option>
                              </select>
                            </>)}

                            Description:
                            <textarea 
                                type='text'
                                value={requestDescription}
                                placeholder="Description"
                                required
                                onChange={e=>setRequestDescription(e.target.value)}
                            />

                            <button variant="contained" type='submit'>Create product</button>
                        </form>
                        </div>
                        

                        
                </div>

            </>

          {/* {loading ?(
                <p>Loading...</p>
                
            ) : error ? (
                <p>An error occured</p>
            ):(
            
          )}; */}

        </div>
        </div> 
    </div>
)
}
  
export default Request
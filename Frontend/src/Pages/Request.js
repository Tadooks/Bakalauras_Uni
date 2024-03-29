import React, {useState,useEffect,useContext} from 'react'
import { AuthContext } from './AuthContextNew';
import {useNavigate} from "react-router-dom"
import { auth } from '../firebase_config';


import { Button } from "@mui/material";

import { ThemeProvider, createTheme } from '@mui/material/styles';
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






//product types:
// Song request
// Sound pack
// Synth preset pack



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
          fetch(`https://bakalaurasserverrender.onrender.com/requests`,{
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
                    synthpresetpack: "None",
                    requestdate: Date.now().toString(),
                }
            )
          })
          .then(response => {
            alert('Success! You will receive an email if your request gets accepted!');
            navigate('/')
          })
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
            alert('Error, contact support: ' + e.message);
          });
    
    
          setRefresh(true);
        return;
      
      }
      if(requestType=="Sound pack"){
          fetch(`https://bakalaurasserverrender.onrender.com/requests`,{
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
                  genre: "Other",
                  includeproject: "No",
                  soundpacktype: requestPackType,
                  synthpresetpack: "None",
                  requestdate: Date.now().toString(),
                }
            )
          })
          .then(response => {
            alert('Request was sent successfully! You will receive an email if your request gets accepted!');
            navigate('/')
          })
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
            alert('Error, contact support: ' + e.message);
          });
    
    
          setRefresh(true);
        return;
      
      }
      if(requestType=="Synth preset pack"){
          fetch(`https://bakalaurasserverrender.onrender.com/requests`,{
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
                  genre: "None",
                  includeproject: "No",
                  soundpacktype: "None",
                  synthpresetpack: requestSynthPresetPack,
                  requestdate: Date.now(),
                }
            )
          })
          .then(response => {
            alert('Request was sent successfully! You will receive an email if your request gets accepted!');
            navigate('/')
          })
          .then((usefulData) => {
            setLoading(false);
            setData(usefulData);
          })
          .catch((e) => {
            console.error(`An error occurred: ${e}`)
            alert('Error, contact support: ' + e.message);
          });
    
    
          setRefresh(true);
        return;
      
      }
      
    }

    
}
//------------------------------------




//allow admin to input only numbers
const handlePriceChange = (e) => {
  // https://www.regextester.com/97725
  const regex = /^[0-9]+(\.[0-9]{1,2})?$/; // regex to validate money value
  if (e.target.value === '' || regex.test(e.target.value)) {
    setRequestBudget(e.target.value);
  }
}


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



  return (
    <div style={{ color: 'white'}} >
      <ThemeProvider theme={theme}>
        <h1 style={{ textAlign: 'center' }}>Request</h1>
        
        <div>
          
        <div className='Centered-Request'>
          <>
          
                <div className='StyledCreateProduct'>
                  
                    <div>
                        <br></br>
                        <form className="StyledForm" onSubmit={handleCreateRequest} >
                            Type:
                            <select id="product-type" name="product-type" value={requestType} onChange={e => setRequestType(e.target.value)}>
                                <option selected value="Song request">Song request</option>
                                <option selected value="Sound pack">Sound pack</option>
                                <option selected value="Synth preset pack">Synth preset pack</option>
                            </select>
                            
                            {/* Minimum and maximum budget */}
                            Budget €:
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
                                <option selected value="Rap">Rap</option>
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
                                maxLength={400}//limit

                                onChange={e=>setRequestDescription(e.target.value)}
                            />

                            <Button variant="contained" type='submit'>Send request</Button>
                        </form>
                        </div>
                        

                        
                </div>

            </>


        </div>
        </div> 
        </ThemeProvider>
    </div>
)
}
  
export default Request
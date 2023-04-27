import React, {useState} from 'react'
// import emailjs from '@emailjs/browser'

//data sent: email, genre selection, budget, song length, packs, include project file 
const Request = () => {


  const [hide, setHide] = useState(false);

  return (
    <div>
        <h1 className="temp">Request form</h1>
        <div className="temp2">
        <div className='songrequest'>
        {  hide && 
                    <div>
                      Your request has been sent!<br></br>
                      Once your request is reviewed, you will receive an email with more info 
                    </div>
        }
        {  !hide && 
                  <>
                      <div>
                        email,<br></br>
                        budget, <br></br>
                        description, <br></br>
                        type ( song request/ghost production, soundpack, synthpreset pack), <br></br>
                        genre selection (for music), <br></br>
                        
                      </div>
                  <form onSubmit={""}>
                    <label>Name:</label> &nbsp;
                    <input type='text' name="name" className='textboxName'/>
                    <br></br>
                    <br></br>
                    <label>Email:</label> &nbsp;
                    <input type='email' name="user_email" className='textboxName'/>
                    <br></br>
                    <br></br>
                    <label>Your song request/idea:</label>
                    <br></br>
                    <textarea name='message' rows='4' className='textboxclass'></textarea>
                    <br></br>
                    <input type='submit' value='Send' className='button2 button1'></input>
      
                </form>
                </>
        }
        </div>
        </div>

        
    </div>
)
}
  
export default Request
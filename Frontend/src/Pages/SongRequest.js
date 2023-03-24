import React, {useState} from 'react'
// import emailjs from '@emailjs/browser'


const SongRequest = () => {


  const [hide, setHide] = useState(false);

  return (
    <div>
        <h1 className="temp">Song request form</h1>
        <div className="temp2">
        <div className='songrequest'>
        {  hide && 
                    <div>Thanks for the email!</div>
        }
        {  !hide && 
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
        }
        </div>
        </div>

        
    </div>
)
}
  
export default SongRequest
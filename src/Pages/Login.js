import React, {useState} from 'react'
// import emailjs from '@emailjs/browser'


const Login = () => {


  const [hide, setHide] = useState(false);

  return (
    <div style={{ color: 'white'}}>

      <div className=''>
        <h1>Login</h1>
        <form onSubmit={""}>
                    <label>Email:</label> &nbsp;
                    <br></br>
                    <input type='text' name="name" className='textboxName'/>
                    <br></br>
                    <label>Password:</label> &nbsp; 
                    <br></br>
                    <input type='text' name="name" className='textboxName'/>
                    <br></br>
                    <button>Login</button>
        </form>

      </div>
        

    </div>
)
}
  
export default Login
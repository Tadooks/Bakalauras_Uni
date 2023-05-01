import {useState} from 'react'
import {auth} from '../firebase_config';
import {EmailAuthProvider,reauthenticateWithCredential,updatePassword} from 'firebase/auth'


import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name == 'currentPassword') {
      setCurrentPassword(value);
    } else if (name == 'newPassword') {
      setNewPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("a")
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    console.log("b")
    reauthenticateWithCredential(auth.currentUser,credential)
      .then(() => {
        updatePassword(auth.currentUser,newPassword);
        alert("Sucessfully changed password!")
        // window.location.href = "http://localhost:3000/profile";
        window.location.href = window.location.origin + "/profile";
      })
      .catch((err) => {
        console.log(err);
        alert(err)
      });
  };

  //--------------------CSS for MUI table(well and buttons apparently)-------------------------
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
    <div style={{ color: 'white'}} className='center'>
      <ThemeProvider>
        <div className='auth'>
            <form onSubmit={handleSubmit}>
                <label htmlFor="current-password">Current password:</label>
                <input
                    type="password"
                    value={currentPassword}
                    id="current-password"
                    name="currentPassword"
                    onChange={handleChange}
                />

                <label htmlFor="new-password">New password:</label>
                <input
                    type="password"
                    value={newPassword}
                    id="new-password"
                    name="newPassword"
                    onChange={handleChange}
                />
                You will have to login after changing the password!
                <Button variant="contained" type="submit">Change Password</Button>
            </form>
        </div>
        </ThemeProvider>
    </div>
  );
};

export default ChangePassword;

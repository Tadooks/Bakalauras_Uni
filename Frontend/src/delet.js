
import { Button } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

<ThemeProvider theme={theme}></ThemeProvider>

<Button  variant="contained"></Button>



<h1 style={{ textAlign: 'center' }}>Order summary</h1>

<div className='Checkout-Screenerino'></div>


<form className="StyledForm" onSubmit={handleCreateOrder} ></form>
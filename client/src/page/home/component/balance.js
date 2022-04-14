import { autocompleteClasses, Chip, Divider, Grid, IconButton, Paper, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import BuyMTC from './buyMTC';
//import { importMTC } from '../utility/addToken';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCircleIcon from '@mui/icons-material/AddCircle';


const Balance = ({balance, mtcbal, user})=>{
    //console.log(user);

    //handle buyMTC open and close
    const [open, setopen] = useState(false);

    const handleOnclick = ()=>{
        setopen(true);
    }

    const handleOnclose = ()=>{
        setopen(false);
    }

    return(
        <div>
            <Paper style={{
            width: '300px',
            height: '50px',
            padding: '10px',
            margin: '10px',
            marginTop: '10px',
            textAlign: 'center',
            }} 
            elevation={1}> 
                <Grid container justifyContent= "space-evenly" alignItems="center">
                    <Grid item xs>
                        <AccountBalanceWalletIcon />
                    </Grid>
                    <Grid item xs>
                        <Chip label={balance + " ETH"}></Chip>
                    </Grid>
                    
                    <Grid item xs>
                        <Tooltip title="Click to withdraw MTC">
                            <Chip clickable label={mtcbal + " MTC"}></Chip>
                        </Tooltip>     
                    </Grid>
                    <Grid item xs>
                        <IconButton onClick={handleOnclick}><AddCircleIcon color='primary'/></IconButton>
                    </Grid>
                </Grid>
            </Paper>     
            <BuyMTC openDia={open} handleClose={handleOnclose} eBal={balance} mBal={mtcbal} player={user}></BuyMTC>  
        </div>
        
    );
}

export default Balance;
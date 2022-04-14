import React from "react";
import { useState, useEffect } from "react";
import Button from '@mui/material/Button';
import { AlertTitle, Avatar, Backdrop, Snackbar, Typography } from "@mui/material";
import { Chip, Alert } from "@mui/material";

const Login = ({login, player})=>{
    //const [username, setusername] = useState("");
    const [btndisable, setBtndisable] = useState(false);
    const [open, setOpen] = useState(false);
    console.log("Login " + player);
    //console.log(btndisable);

    //To set the snackbar open when account switch
    //run on first render and run only player name change
    useEffect(()=>{
        if (player !== ""){
            setOpen(true);
        }else{
            setOpen(false);
        }
    }, [player]);

    async function getAccount(e){
        setBtndisable(true);
        await window.ethereum.request({
            method: 'eth_requestAccounts'
        })
        .then((result) =>{
            console.log(result[0] + " grant permissions.");
            //setusername(result);
            login(result[0]);
            setOpen(true);
            
        })
        .catch((err) =>{
            console.log(err.code + ": " + err.message);
            setBtndisable(false);
        });
    }

    function btnclick(){
        console.log("btn clicked");
    }

    function snackClosed(){
        setOpen(false);
        //enable back button to prevent button disable when user totally logout
        setBtndisable(false);
    }


    if(player === ""){
        return (
            <div>
                <Button disabled={btndisable} variant="contained" onClick={(e) =>{getAccount(e)}}>Login</Button>
            </div>
        )
    }else{
        return(
        <div>
            <Typography variant="subtitle2" >Welcome back</Typography>
            <Chip color="info" avatar={<Avatar>{player.substring(0,3)}</Avatar>}
                label={player.substring(0,6) + "...." + player.substring(player.length - 0,player.length - 6)}
                onClick={btnclick}></Chip>
            
            <Snackbar open={open} anchorOrigin={{vertical:'bottom', horizontal:'right'}} autoHideDuration={6000} onClose={snackClosed}>
                <Alert onClose={snackClosed} severity="success">
                    <AlertTitle>Successfully Login</AlertTitle>
                    You login as <strong>{player}</strong>
                </Alert>
            </Snackbar>

        </div>
        )
    }
}

export default Login;

import React from 'react';
import './home.css';
import Logo from './component/logo.js';
import Login from './component/login.js';
import Balance from './component/balance';
import History from './component/history';
import Bet from './component/bet';
import {detectProvider} from './utility/checkProvider.js';
import { Divider, Slide, Snackbar, Alert } from '@mui/material';
import { Chip} from '@mui/material';
import { useState, useEffect } from 'react';


const Home = ()=> {
    let display;
    let displaySnack;
    const [username, setUsername] = useState("");
    const [userBalance, setUserBalance] = useState(0);
    const [open, setOpen] = useState(true);
    const [web3, setWeb3] = useState();
    const [contract, setContract] = useState("");
    const [mtcBalance, setMtcBalance] = useState(0);
    //For bet.js and history.js used
    //passing record data to home.js and to history.js
    const [betRecord, setBetRecord] = useState([]);

    console.log(betRecord);

    //account change listener for metamask account change event listener
    //only will run in first time 
    let accountListener = async ()=>{
        
        //Get promise result for metamask install
        let metaInstall = await detectProvider(setUsername, setUserBalance, setWeb3, setContract, setMtcBalance);
        if (metaInstall){
            console.log("install");   
            
        }else {
            console.log("Not install");
        }
        
    }

    //this effect only will run on first render ONLY
    //in first render, it will check for current user provider and user acc login
    //the detectProvider function will pass the setUsername and setUserBalance usestate
    //Then it will create metamask account changed event listener
    //The listener will not destroy as it need to detect acc changed all the time
    useEffect(()=>{
        accountListener();
        window.ethereum.on('accountsChanged', accountListener);
    },[]);

    //when username state change, it will check on username
    //to determine the login snack bar display or not
    useEffect(()=>{
        if(username !== ""){
            setOpen(false);
        }else{
            setOpen(true);
        }
    },[username]);

    //console.log("home username " + username);
    //console.log("home web3 " + web3);
    //console.log("home contract " + contract);
    //console.log("home balance " + userBalance);
    
    if (username !== "" && userBalance >= 0 && mtcBalance >= 0){
        //use toFixed to round of number to 2 decimal string
        display = <Balance balance={userBalance.toFixed(2)} mtcbal={mtcBalance.toFixed(2)} user={username}/>;
    }else{
        displaySnack = <Snackbar 
                        anchorOrigin={{vertical:'bottom', horizontal:'center'}}
                        open={open}
                        TransitionComponent={(props)=>{
                            return <Slide {...props} direction='right'/>
                        }}
                        >
                            <Alert severity="warning">Please Login to Metamask to use this service</Alert>

                        </Snackbar>;
        display = "";
    }

    return (
    <header className='header'>
        <div className='flexcontainer'>
            <div><Logo/></div>
            <div style={{flex:1}}></div>
            <div>{display}</div>
            <div><Login login={setUsername} player={username}/></div>               
        </div>
        <Divider>
            <Chip label='Scissor, Paper, Stone'></Chip>
        </Divider>
        <div sx={{ display: "flex", flexDirection: "column"}}>
            <div><Bet btnDisable={open} mbal={mtcBalance.toFixed(2)} record={setBetRecord} username={username}/></div>
        </div>
        <div>
            <History betRecord={betRecord}/>
        </div>
        <div>{displaySnack}</div>
    </header>
    )
}

export default Home;
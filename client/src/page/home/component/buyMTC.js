//User click confirm to send Transaction to contract - done
//fixed refresh MTCToken  when Transaction complete - done
//Do withdraw function
//Do add token button
//update the buy token transaction to a table
import { Dialog, Box, Stepper, Step, StepLabel, Paper, Card, Grid, CardContent, Chip, Avatar, CardActions, Typography, TextField, InputAdornment, Button, CardHeader, Fab, CircularProgress} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import InfoIcon from '@mui/icons-material/Info';
import CheckIcon from '@mui/icons-material/Check';
import PublishIcon from '@mui/icons-material/Publish';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import { green } from "@mui/material/colors";
import { buyMTCToken, getEthMtcContract } from "../utility/checkProvider";

const step = ["Buy MTC", "Comfirm Order", "Transaction Submitted"];
const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayName=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
let displayTxHash = null;

const BuyMTC = ({openDia, handleClose, eBal, mBal, player})=>{
    
    const [activeStep, setActiveStep] = useState(0);
    const [currTime, setCurrTime] = useState("");
    const [mtcBuy, setMtcBuy] = useState(0);
    const [ethConvert, setEthConvert] = useState(0);
    const [txHash, setTxHash] = useState("");

    //state to check available balance
    const [failValidate, setFailValidate] = useState(false);
    //console.log("mtcBuy " + getEthMtcContract());

    //For transaction submit
    const [success, setSucess] = useState(false);
    const [loading, setLoading] = useState(false); 
    const timer = useRef();
    //console.log("Set success " +success);
    //console.log("Set Loading "+ loading);
    //console.log("Set TxHash " + txHash);
    //console.log("displayTx " + displayTxHash);

    const buttonSx = {
        ...(success && {
            bgcolor: green[500],
            '&:hover': {
                bgcolor: green[700],
            }, 
        }),
    };

    //Every render will process date
    useEffect(()=>{
        let now = new Date();
        let currhour = now.getHours();

        //If currentminute is < 10, it will display only 1 digit
        let currMin = now.getMinutes();
        if(currMin.toString().length == 1){
            currMin = "0" + currMin;
        }

        //6 is Saturday, 0 is Sunday
        let currday = dayName[now.getDay()];

        //Curr month = current month -1
        //It is used to determine which month in string
        let currmonth = monthName[now.getMonth()];
        let currdate = now.getDate();
        let curryear = now.getFullYear();
        setCurrTime(currhour +":" + currMin + ",   " + currday + ", " + currmonth + " " + currdate + " " + curryear);
    });

    //handle next button
    const handleNext = ()=>{
        //If it is on second page, "Comfirm Order"
        if (activeStep == 1){
            //setSucess(false);
            //setLoading(true);
            buyMTCToken(ethConvert, setSucess, setLoading, setTxHash);
            //timer.current = window.setTimeout(()=>{
            //    setSucess(true);
            //    setLoading(false);
            //}, 2000);
            setActiveStep((prevActiveStep)=> prevActiveStep + 1);
        //If it is on first page, "Buy MTC page"
        }else if (activeStep == 0){
            console.log(ethConvert + " "+ eBal);
            //need to parse eBal to INT as it is string
            //check available ETH balance with current input ETH
            if (ethConvert > parseInt(eBal)){
                console.log("fail validate");
                setFailValidate(true);
            }else if (ethConvert == 0){
                setFailValidate(true);
            }
            else {
                setFailValidate(false);
                setActiveStep((prevActiveStep)=> prevActiveStep + 1);
            }
        }

    }; 

    //handle back button
    const handleBack = ()=>{
        if (activeStep <= 0){
            handleReset();
        }else {
            setActiveStep((prevActiveStep)=> prevActiveStep - 1);
        }
        
    };

    //handle OK button to reset activestep to 0 and close
    //on transaction submmited
    const handleReset = () =>{
        setActiveStep(0);
        //Reset MTC and ETH to 0 after dialog close
        setMtcBuy(0);
        setEthConvert(0);
        //reset the hash to empty, success to false,loading to false
        //and displayTxHash element to null
        setTxHash("");
        setSucess(false);
        setLoading(false);
        displayTxHash = null;

        handleClose();
    };

    //handle MTC amount and convert to ETH amount
    const handleMtcChange = (e)=>{
        setMtcBuy(e.target.value);
        let mtcToEth = e.target.value *0.01;
        setEthConvert(mtcToEth);
    };

    //handle ETH amount and convert to MTC amount
    const handleEthChange = (e)=>{
        setEthConvert(e.target.value);
        let ethToMtc = e.target.value / 0.01;
        setMtcBuy(ethToMtc);
    };

    if (txHash != "" && success === true && loading === false){
        displayTxHash = 
        <Box sx={{textAlign: "center", marginTop: "10px"}}>
            <Typography>Transaction Hash</Typography>
            <Typography sx={{wordWrap: "break-word"}}>{txHash}</Typography>
            <Box sx={{display:"flex", direction:"row", spacing:"1", alignItems: "center",justifyContent:"center", marginTop:"10px"}}>
                <InfoIcon fontSize="small" color="info"></InfoIcon>
                <Typography variant="body2">Transaction will be comfirm within few minutes. <br/>Please wait Patiently.</Typography>
            </Box>
        </Box>;
    }else if (txHash != "" && success === false && loading === true){
        displayTxHash = 
        <Box sx={{textAlign: "center", marginTop: "10px"}}>
            <Typography>Transaction Failed</Typography>
            <Typography sx={{wordWrap: "break-word"}}>{txHash}</Typography>
            <Box sx={{display:"flex", direction:"row", spacing:"1", alignItems: "center",justifyContent:"center", marginTop:"10px"}}>
                <InfoIcon fontSize="small" color="info"></InfoIcon>
                <Typography variant="body2">Press "OK" button to exit this section.</Typography>
            </Box>
        </Box>;
    }

    const step1Container = 
    <Paper sx={{margin:"20px", height:"400px"}} elevation={2}>
        <Grid container direction="column" spacing={1} justifyContent= "space-around" alignItems="center">
            <Grid item>
                <Card sx={{width: "360px", height:"70px"}} variant="outlined">
                    <Typography sx={{paddingLeft: "10px"}} variant="subtitle2">Account Balance</Typography>
                    <CardActions >
                        <Chip color="info" avatar={<Avatar>{player.substring(0,3)}</Avatar>} label={player.substring(0,6) + "...." + player.substring(player.length - 0,player.length - 6)}></Chip>
                        <Chip label={eBal + " ETH"}></Chip>
                        <Chip label={mBal + " MTC"}></Chip>
                    </CardActions>
                </Card>
            </Grid>
            <Grid item>
                <Box sx={{display:"flex", direction:"row", spacing:"1"}}>
                    <InfoIcon fontSize="small" color="info"></InfoIcon>
                    <Typography variant="body2"> 1 MTC = 0.001 ETH</Typography>
                    
                </Box>
            </Grid>
            <Grid item sx={{marginBottom:"10px"}}>
                <Card sx={{width: "360px"}} variant="outlined">
                    <CardContent>
                        <Typography sx={{paddingLeft: "10px"}} variant="h6">Amount</Typography>
                        <Box sx={{textAlign: "center", marginTop:"10px"}}>
                            <TextField
                                label="MTC"
                                type="number"
                                size="small"
                                value={mtcBuy}
                                onChange={handleMtcChange}
                                helperText="Please Key in the MTC amount to buy"
                                InputLabelProps={{shrink: true}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">MTC</InputAdornment>
                                    ),
                                    //set min number to 0 to prevent negative input
                                    inputProps: {min: 0},
                                }}>
                            </TextField>
                        </Box>

                        <Box sx={{textAlign: "center", marginTop:"10px", marginBottom:"10px"}}>
                            <ChangeCircleIcon fontSize="large" color="info"></ChangeCircleIcon>
                        </Box>

                        <Box sx={{textAlign: "center"}}>
                            <TextField
                                error={failValidate? true: false}
                                label="ETH"
                                type="number"
                                size="small"
                                value={ethConvert}
                                onChange={handleEthChange}
                                helperText={failValidate? "Not Enough ETH Balance or 0 ETH" : "Please Key in the ETH amount to buy"}
                                InputLabelProps={{shrink: true}}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="start">ETH</InputAdornment>
                                    ),
                                    inputProps: {min:0},
                                }}>
                            </TextField>
                        </Box>

                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    </Paper>;
    const step2Container = 
    <Paper sx={{margin:"20px",height:"400px"}} elevation={2}>
        <Box sx={{margin:"20px", paddingTop:"20px"}}>
            <Card variant="outlined">
                <CardHeader 
                    subheader="Transaction Detail">
                </CardHeader>
                <CardContent>
                    <Box sx={{display:"flex", direction:"row", spacing:"1"}}>
                        <TextField disabled label="From" value={player.substring(0,6) + "...." + player.substring(player.length - 0,player.length - 6)}></TextField>
                        <Box sx={{flex:"1 1 auto"}}></Box>
                        <Typography variant="h5">{ethConvert + " ETH"}</Typography>
                    </Box>
                    <Box sx={{marginTop:"10px"}}>
                        <TextField disabled label="To" value={getEthMtcContract().substring(0,6) + "...." + getEthMtcContract().substring(getEthMtcContract().length - 0, getEthMtcContract().length - 6)}></TextField>
                    </Box>
                    <Box sx={{marginTop:"10px"}}>
                        <TextField disabled label="Type" defaultValue="Buy MTC from ETH"></TextField>
                    </Box >
                    <Box sx={{display:"flex", directon:"row", spacing:"1", marginTop:"10px"}}>
                        <TextField 
                            disabled 
                            label="MTC To Receive" 
                            value={mtcBuy}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="start">MTC</InputAdornment>
                                ),
                            }}>
                        </TextField>
                        <Box sx={{flex:"1 1 auto"}}></Box>
                        <Typography variant="body2">{currTime}</Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Paper>;

    const step3Container = 
    <Paper sx={{margin:"20px",height:"400px"}} elevation={2}>
        <Box sx={{display:"flex",alignItems:"center", justifyContent:"center"}}>
            <Box sx={{position:"relative", marginTop:"150px"}}>
                <Fab
                    aria-label="save"
                    color="primary"
                    sx={buttonSx}>
                        {success ? <CheckIcon></CheckIcon> : <PublishIcon></PublishIcon>}
                </Fab>
                {
                    loading && (
                    <CircularProgress
                        size={68}
                        sx={{
                            color: green[500],
                            position: "absolute",
                            top: -6,
                            left: -6,
                            zIndex: 1,
                        }}>

                    </CircularProgress>
                    )
                }
            </Box >
            <Box sx={{position:"relative", marginLeft:"10px", marginTop:"150px"}}>
                <Button
                    variant="contained"
                    sx={{buttonSx}}
                    disabled={loading}
                >
                    {success ? "Transaction Submitted" : "Submitting Transaction"}
                </Button>
                {
                    loading && (
                        <CircularProgress
                            size={24}
                            sx={{
                                color: green[500],
                                position: "absolute",
                                top: '50%',
                                left: '50%',
                                marginTop: "-12px",
                                marginLeft: "-12px",
                            }}>

                        </CircularProgress>
                    )
                }
            </Box>
        </Box>
        {displayTxHash}
    </Paper>;


    return(
        <div>
            <Dialog fullWidth open={openDia}>
                <Stepper sx={{margin:"10px"}} activeStep={activeStep}>
                    {
                        step.map((label, index)=>{
                            return (<Step key={index} label={label}>
                                        <StepLabel>{label}</StepLabel>
                                    </Step>
                            );
                        })
                    }
                </Stepper>
                {
                    //if it is last activestep, perform step3container
                    activeStep === step.length -1 ? 
                        <div>
                            {step3Container}
                            <Box sx={{display:"flex", direction:"row", marginLeft:"10px", marginRight:"10px", marginBottom:"10px"}}>
                                <Box sx={{flex: "1 1 auto"}}></Box>
                                <Button onClick={handleReset}>Ok</Button>
                            </Box>
                        </div> : ( 
                        <div>
                            {
                                //if it is first activestep, perform step1container else perform step2container
                                activeStep === 0 ? <div>{step1Container}</div> : <div>{step2Container}</div>
                            }
                            <Box sx={{display:"flex", direction:"row", marginLeft:"10px", marginRight:"10px", marginBottom:"10px"}}>
                                <Button onClick={handleBack}>Back</Button>
                                <Box sx={{flex: "1 1 auto"}}></Box>
                                <Button onClick={handleNext}>{activeStep === step.length -2 ? "Comfirm" : "Next"}</Button>
                            </Box>
                        </div>
                    )
                }
            </Dialog>
        </div>

    );
}

export default BuyMTC;
//do win indicator on chip -done
//bring MTC amount from home.js -done
//pass roll result to table -done
//connect contract for real transaction for winlose
import React from "react";
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';
import { useState, useEffect } from "react";
import '@fontsource/roboto/500.css';
import { Alert, Collapse, Divider, fabClasses, IconButton, InputAdornment, MenuItem, Slider, TextField, Typography } from "@mui/material";
import { Paper, Chip, Button, ButtonGroup, Grid, Card } from "@mui/material";
import TokenIcon from '@mui/icons-material/Token';
import InfoIcon from '@mui/icons-material/Info';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box } from "@mui/system";
import "../component/bet.css";
import { triggerRoll } from "../utility/betting";
import { getFulldateAndTime } from "../utility/time";


const choice = [
    {
        value: 'scissor',
        label: 'scissor',
    },
    {
        value: 'paper',
        label: 'paper',
    },
    {
        value: 'stone',
        label: 'stone',
    }
    ];

const multiplier = [{value: '1/2'}, {value: '2'}, {value: 'max'}];

//btnDisable is from home.js, used to check user login and disable button
const Bet = ({btnDisable, mbal, record, username})=> {

    const [pChoice, setPchoice] = useState('scissor');
    //For banker card spin
    const [forSpin, setForSpin] = useState(false);
    //for handling btnDisable with associate with user btn login from home.js
    const [startRoll, setStartRoll] = useState(false);
    const [bankerCard, setBankerCard] = useState('scissor');
    //for handling player and banker chip color for winlose
    const [playerColor, setPlayerColor] = useState('default');
    const [bankerColor, setBankerColor] = useState('default');
    //player bet value on Bet Amount
    const [playerBet, setPlayerBet] = useState(0);
    //player multiplier ammount
    const [pMultiplier, setPmultipler] = useState('0');
    //player win and lose amount after calculated
    const [pWin, setPwin] = useState(0);
    const [pLose, setPlose] = useState(0);
    const [aOpen, setAopen] = useState(false);
    //alert severity for win, lose and tie
    //win = true, lose =false, tie = true
    const [aSeve, setAseve] = useState(false);
    //alert content
    const [alertContent, setAlertContent] = useState('');


    //use to determine the max value on textinput and slider
    //convert to INT number
    let totalMTC = parseInt(mbal);
    let displayAlert = null;

    //handle when user change Bet Amount
    //It will auto calculate the payout according to selected multiplier
    useEffect(()=>{
        handlePayout(pMultiplier);
    },[playerBet]);

    //handle alert open and close
    //Trigger when either playerColor and bankerColor state change
    useEffect(()=>{
        if (playerColor === 'success' && bankerColor === 'default'){
            setAseve(true);
        }else if (playerColor === 'default' && bankerColor === 'success'){
            setAseve(false);
        }else{
            setAseve(true);
        }
    }, [playerColor, bankerColor]);
    
    //console.log(playerBet);

    const handleAlert = ()=>{
        setAopen(false);
    };

    const handleRoll = () =>{
        let finalResult = null;
        //set spin and btn disable to true
        setForSpin(true);
        setStartRoll(true);

        //reset alert display to false
        setAopen(false);

        //reset player and banker chip color to default after click
        setPlayerColor('default');
        setBankerColor('default');

        //invoke Trigger Roll function with Promise resolve array return
        //result[0] is the banker card result
        //result[1] is the compare result, either win, lose or tie
        triggerRoll(pChoice)
        .then((result)=>{
            finalResult = result;
        });

        //after 3 seconds, reset back the spin and btn disable
        window.setTimeout(()=>{
            setForSpin(false);
            setStartRoll(false);
            console.log(finalResult);

            //Check the return result value
            //it must be at least 2 result
            if (finalResult.length >= 2){
                setBankerCard(finalResult[0]);
                handleColor(finalResult[1], finalResult[0]);
                contructRecord(finalResult[1], finalResult[0]);
            }else{
                console.log("Bet not process, error occur");
            }

        }, 3000);
    };

    //Contruct the result record for passsing to table
    const contructRecord = async (result, bankerRe)=>{
        let gameName = 'Scissor, Paper, Stone';
        let FullTime = getFulldateAndTime();
        let pay =0; 
        if (result === "win"){
            pay = pWin;
        }else if (result === "lose"){
            pay = pLose;
        }else{
            pay = 0;
        }

        let gameid = uuidv4();

        let dbschema = {
            gid: gameid,
            game: gameName,
            user: username,
            time: FullTime,
            wager: playerBet,
            mult: pMultiplier,
            payout: pay,
            result: result,
        };

        await axios.post('http://localhost:3001/create', dbschema)
        .then((res)=>{
            console.log(res);
        })
        .catch((err)=>{
            console.log(err);
        });

        record((previousItem)=>{
            return [...previousItem, 
                {
                    id: gameid,
                    game: gameName,
                    username: username,
                    time:FullTime,
                    player:pChoice,
                    banker:bankerRe,
                    wager: playerBet,
                    mult: pMultiplier,
                    payout: pay,
                    result: result,
                }
            ];
        });
    }

    //handling win lose color
    //bankerResult is to use to set Alert content
    const handleColor = (result, bankerResult)=>{
        if (result === "win"){
            setPlayerColor('success');
            setAlertContent("Player Win: " + pChoice + " > " + bankerResult);
        } else if (result === "lose"){
            setBankerColor('success');
            setAlertContent("Player Lose: " + pChoice + " < " + bankerResult);
        }else{
            setPlayerColor('success');
            setBankerColor('success');
            setAlertContent("Tie: " + pChoice + " = " + bankerResult);
        }

        setAopen(true);
    };

    //handle Multiplier button
    const handleBet = (e)=>{
        //parse the event input from Textinput and slider to Number
        //prevent error on slider value
        setPlayerBet(Number(e.target.value));
    }

    const handleChange = (e) => {
        setPchoice(e.target.value);
    };

    const handleMultiplier = (e) => {
        
        //If same button click twice
        //then de-select button and reset multiplier to 0
        setPmultipler((previousState)=>{
            if(previousState === e.target.value){
                handlePayout('0');
                return ('0');
            }else {
                handlePayout(e.target.value);
                return(e.target.value);
            }           
        });
    };

    //calculate total payout for lose and win
    //It will be triggered also by useEffect with associate with Bet Amount 
    const handlePayout = (pMul)=>{
        //payout
        if(pMul === '1/2'){
            let totalpayout = playerBet + (playerBet * (1/2));
            setPwin(totalpayout);
            setPlose(totalpayout * -1);
        }else if(pMul === '2'){
            let totalpayout = playerBet + playerBet;
            setPwin(totalpayout);
            setPlose(totalpayout* -1);

        }else if (pMul === '0'){
            setPwin(playerBet * 1);
            setPlose(playerBet* -1);
        }
        else{
            let totalpayout = Math.pow(playerBet, 2);
            setPwin(totalpayout);
            setPlose(totalpayout* -1);
        }
    };

    displayAlert = 
    <Collapse in={aOpen}>
        <Alert
            sx={{marginBottom: "10px", width:"500px"}}
            severity={aSeve ? 'success': 'error'}
            icon={aSeve ? '': <CancelOutlinedIcon fontSize="inherit"></CancelOutlinedIcon>}
            onClose={handleAlert}
        >
            {alertContent}
        </Alert>
    </Collapse>;
    
    return (
        <Paper style={{paddingLeft: "10px", marginTop:"10px"}} elevation={2}>
            <Typography variant="h6">Bet Area</Typography>
            <Divider></Divider>
            <div>
                <Grid style={{marginTop: "10px", marginBottom:"10px"}} container spacing={1} justifyContent= "space-around" alignItems="center">
                    <Grid item> 
                        <Chip color={playerColor} label="Player"></Chip>
                    </Grid>
                    <Grid item>
                        <TextField
                            disabled={startRoll}  
                            size="medium"
                            label="Bet"
                            select
                            value={pChoice}
                            onChange={handleChange}
                            helperText="Please choose one to bet with banker"
                            >
                                {
                                choice.map((option)=>{
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                        )})
                                }

                        </TextField>
                    </Grid>
                    <Divider orientation="vertical" flexItem>vs</Divider>
                    <Grid item> 
                        <div className={forSpin? "spin": null}>
                            <Card  sx={{width:"100px"}}elevation={2}>
                                <Box sx={{height:"50px",display:"flex", direction:"row",spacing:"1", justifyContent:"center", alignItems:"center"}}>
                                    <Typography variant="h6">{bankerCard}</Typography>
                                </Box>
                            </Card>
                        </div>
                    </Grid>
                    <Grid item>
                        <Chip color={bankerColor} label="Banker"></Chip>
                    </Grid>
                </Grid>
            </div>
            <Divider orientation="horizontal" flexItem></Divider>
            <div>
                <Grid style={{ marginTop: "10px", marginBottom:"10px"}} container spacing={2} justifyContent="center">
                    <Grid item xs>                    
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <TextField 
                                    label="Bet Amount" 
                                    type="number"
                                    size="small"
                                    value={playerBet}
                                    onChange={handleBet}
                                    InputLabelProps={{shrink: true}}
                                    helperText="Please key in bet amount"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                MTC
                                            </InputAdornment>
                                        ),
                                        inputProps: {min: 0, max: totalMTC},
                                    }}
                                >
                                </TextField>
                            </Grid>
                            <Grid item>
                                <Grid container item spacing={1} justifyContent="center" direction="column">
                                    <Grid item>
                                        <ButtonGroup variant="contained" >
                                            {
                                                multiplier.map((options)=>{
                                                    return (
                                                        // use pMultiplier to determine which button is selected
                                                        //if pMultipler is the same as value then the button color change to purple
                                                        <Button color={pMultiplier === options.value ? 'secondary': 'info'} disabled={btnDisable || startRoll? true:false} key={options.value} value={options.value} onClick={handleMultiplier}>
                                                            {options.value}
                                                        </Button>
                                                        )
                                                    })
                                            }
                                    </ButtonGroup> 
                                    </Grid>
                                    <Grid item>
                                        <Slider marks={true} value={playerBet} onChange={handleBet} max={totalMTC} valueLabelDisplay="auto"></Slider>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Card sx={{width: "400px", height:"195px", margin:"auto"}} elevation={2}>
                            <Box sx={{margin:"10px"}}>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    Same Result<strong> will not occur twice </strong>in a row.
                                </Typography>
                                <br/>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    <strong>Tie</strong> consider <strong>both lose</strong>.
                                </Typography>
                                <br/>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    <strong>No reward</strong> will be given on <strong>Tie</strong>.
                                </Typography>
                                <br/>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    1/2 multiplier = Bet Amount + (Bet Amount * 0.5). 
                                </Typography>
                                <br/>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    2x multiplier = Bet Amount * 2. 
                                </Typography>
                                <br/>
                                <Typography variant="caption" gutterBottom>
                                    <InfoIcon color="info" fontSize="small" />
                                    Max multiplier = (Bet Amount)<sup>2</sup>. 
                                </Typography>
                            </Box>
                        </Card> 
                    </Grid>
                    <Grid item xs>
                        <Card style={{width: "300px", height: "230px", padding:"20px", marginBottom:"20px", marginRight: "20px"}} elevation={2}>
                            <Grid container item spacing={1} direction="column" justifyContent="space-evenly">
                                <Grid item>
                                    <Typography variant="h6">Bet Detail<KeyboardArrowDownIcon sx={{marginLeft: "10px"}} color="primary" fontSize="small"/></Typography>
                                </Grid>
                                <Grid item>
                                    <Box sx={{borderTop: "solid black 1px", borderBottom:"solid black 1px"}}>
                                        <Typography variant="caption" gutterBottom>Bet Amount: {playerBet} MTC</Typography>
                                        <br/>
                                        <Typography variant="caption" gutterBottom>Multiplier: {pMultiplier}x</Typography>
                                    </Box>
                                </Grid>
                                <Grid item>
                                    <Typography variant="h6">Payout<KeyboardArrowDownIcon sx={{marginLeft: "10px"}} color="primary" fontSize="small"/></Typography>
                                </Grid>
                                <Grid item>
                                    <Box sx={{borderTop: "solid black 1px", borderBottom:"solid black 1px"}}>
                                        <Typography sx={{color: "green"}} variant="caption" gutterBottom>Win: {pWin} MTC</Typography>
                                        <br/>
                                        <Typography sx={{color: "red"}} variant="caption" gutterBottom>Lose: {pLose} MTC</Typography>
                                    </Box>
                                </Grid>
                                <Grid item>
                                <Button disabled={btnDisable || startRoll? true:false} onClick={handleRoll} style={{width:"100%"}} variant="contained" size="small" startIcon={<TokenIcon/>}>Roll</Button>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
            </div>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                {displayAlert}
            </Box>
        </Paper>
    );
}

export default Bet;
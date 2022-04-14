import React from "react"; 
import { PropTypes } from "prop-types";
import { useState, useEffect } from "react";
import { Box, width } from "@mui/system";
import { Tabs, Tab, Table, TableContainer, TableHead, TableRow, TableCell, tableCellClasses, Paper, TableBody, Typography, Chip, TablePagination } from "@mui/material";

const tabTitle = ["All", "MyBet", "Transaction"];

const History = (betRecord)=>{
    const [tabValue, setTabValue] = useState(0);
    const [displayColor, setDisplayColor] = useState('');

    const handleTabValue = (e, newvalue)=>{
        setTabValue(newvalue);
    };

    //need odo those assign as the betRecord contain betReord array
    let bRecord = betRecord.betRecord;

    //For creating element call <TabPanel>
    const TabPanel = (props)=>{
        //children = content under <TabPanel>
        //value = value props from <TabPanel>
        //index = index props from <TabPanel>
        const {children, value, index, ...other} = props;

        return (
            <Box
                //if the value(which is TabValue) is the same as index of <TabPanel>
                hidden={value != index}
                //passing <TabPanel> props to here
                {...other}
            >
                {
                    value === index && (
                        <Box sx={{textAlign:"center"}}>{children}</Box>
                    )
                }
            </Box>
        );
    };

    //use to validate the props of TabPanel function
    TabPanel.prototype = {
        //children: PropTypes.node,
        value: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
    };

    return(
        <Box sx={{ minHeight:"350px", bgcolor:'white', marginTop:"10px", padding:"10px"}}>
            <Tabs value={tabValue} onChange={handleTabValue} centered>
                {
                    tabTitle.map((title)=>{
                        return (
                            <Tab key={title} label={title}></Tab>
                        )
                    })
                }
            </Tabs>
            <TabPanel value={tabValue} index={0}>
                one
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
                <Box>
                    <TableContainer  component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{backgroundColor:"#A7C7E7"}}>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Game</TableCell>
                                    <TableCell>User</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Result</TableCell>
                                    <TableCell align="right">Wager (MTC)</TableCell>
                                    <TableCell align="right">Mult (x)</TableCell>
                                    <TableCell align="right">Payout (MTC)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    bRecord.length === 0 ? (
                                        <TableRow>
                                            <TableCell sx={{textAlign:"center"}} colSpan={8}>No record</TableCell>
                                        </TableRow>        
                                    ) : (
                                        //create an copy of current array using slice 0
                                        //then use the copy array to reverse
                                        //so the original array will not be modify
                                        bRecord.slice(0).reverse().map((row, index)=> {
                                            //only display 5 item but bRecord array will still holding all array
                                            while (index <=4){
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        sx={{'&:last-child td, &:last-child th': { border: 0 }}}
                                                >
                                                        <TableCell>{row.id}</TableCell>
                                                        <TableCell>{row.game}</TableCell>
                                                        <TableCell>{row.username}</TableCell>
                                                        <TableCell>{row.time}</TableCell>
                                                        <TableCell>
                                                            {row.player} -vs- {row.banker} &nbsp;
                                                            <Chip label={row.result} color={row.result === "win" ? 'success': (row.result === "lose" ? 'error':'warning')}></Chip>
                                                        
                                                        </TableCell>
                                                        <TableCell align="right">{row.wager}</TableCell>
                                                        <TableCell align="right">{row.mult}</TableCell>
                                                        <TableCell align="right"><Typography color={row.result === "win" ? 'green': (row.result === "lose" ? 'error':'orange')}>{row.payout}</Typography></TableCell>
                                                    
                                                    </TableRow>
                                                )
                                            }

                                            

                                        })
                                    )

                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

            </TabPanel>
            <TabPanel value={tabValue} index={2}>
                three
            </TabPanel>
        </Box>
    );
} 

export default History;
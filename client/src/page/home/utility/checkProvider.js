import detectEthereumProvider from '@metamask/detect-provider';
import getWeb3 from './getWeb3';
import MTCToken from '../../../contracts/MTCToken.json';
import ethMtc from '../../../contracts/Ethmtc.json';
import Web3 from 'web3';

let currentAccount = null;
let currentBalance =null;
let metaInstall = false;
let web3 = null;
let contract = null;
let ethMtcContract = null;
//The usestate function of setMtcBalance from home.js
let checkSetMtcBalance = null;

//Checking Ethereum Provider
export async function detectProvider(setUsername, setUserBalance, setWeb3, setContract, setMtcBalance){
    checkSetMtcBalance = setMtcBalance;
    //return true if there is any ETH provider
    const provider = await detectEthereumProvider();

    if (provider){
        console.log("Provider installed");
        if(provider !== window.ethereum){
            console.log("Are you using different ETH wallet")
        }else{
            console.log("Metamask is installed");
            metaInstall = true;
            web3 = await getWeb3();
            setWeb3(web3);
            const networkid = await web3.eth.net.getId();
            const deployedNetwork = MTCToken.networks[networkid];
            contract = new web3.eth.Contract(MTCToken.abi, deployedNetwork.address);
            // console.log(contractset);
            // console.log(web3);
            const ethmtcNetwork = ethMtc.networks[networkid];
            ethMtcContract = new web3.eth.Contract(ethMtc.abi, ethmtcNetwork.address);
            console.log(ethMtcContract.options.address);
            setContract(contract);
            handleAccout(setUsername, setUserBalance);
        }

    }else{
        console.log("Metamask not installed");
    }

    //return Promise resolve back to react home.js
    return Promise.resolve(metaInstall);
}

//Function to check handle user account and account changes
//Once user has login from metamask to web, nexttime user refresh the page it will auto get his account
//If user change account, it will also able to refresh page and get the changed account
function handleAccout(setUsername, setUserBalance){
    window.ethereum.request({
        method : 'eth_accounts'
    })
    .then((value)=>{handleAccountchanged(value, setUsername, setUserBalance);})
    .catch((err)=>{
        console.log(err);
    });
}

function handleAccountchanged(accounts, setUsername, setUserBalance){
    console.log(accounts);
    if (accounts.length === 0){
        //alert("Please connect to metamask");
        currentAccount = null;
        //Reset the useState to default when detect no one login
        setUsername("");
        setUserBalance(0);
    }else {
        currentAccount = accounts[0];
        //setUsername(currentAccount);
        getAccountDetail(setUsername, setUserBalance);
    }
}
//Function Get account balance detail
async function getAccountDetail(setUsername, setUserBalance){
    var accParam = [
        currentAccount,
        'latest'
    ];

    const detail = await window.ethereum.request({
        method: 'eth_getBalance',
        params: accParam,
    })
    .then((value)=>{getBalance(value, setUsername, setUserBalance)})
    .catch((err)=>{
        console.log(err.code + ": " + err.message);
    });
}

function getBalance(balance, setUsername, setUserBalance){

    //parse hexa string to INT, if value begin as 0x , it will auto define as radix 16 string (hexa string)
    //It will convert to more than 18 digits number ex: 1000000000000000000
    //Which javascripts only can handle 16 digits
    let userBalance = parseInt(balance, 16);
    console.log(userBalance);

    //the userBalance is the user ETH balance in Wei
    //Divided to 10^18 to get ETH value
    let userBalanceDisplay = userBalance / (Math.pow(10, 18));
    currentBalance = userBalanceDisplay;
    getMTCToken(currentAccount);
    setUsername(currentAccount);
    setUserBalance(currentBalance);
}

export async function getMTCToken(user){
    if (contract !== null){
        await contract.methods.balanceOf(user).call()
        .then((result)=>{
            //MTC having 10^18 units
            //Divide 10^18 to get the exact MTC value
            let converted = result / (Math.pow(10, 18));
            //console.log(converted);
            checkSetMtcBalance(converted);
        })
        .catch((err)=>{
            console.log(err.code + err.message);
        });
    }    
}

//Function to Buy MTC Token on buyMTC.js
export async function buyMTCToken(ethAmount, setSucess, setLoading, setTxHash){
    if (ethMtcContract !== null){
        setSucess(false);
        setLoading(true);
        let playerAccount = await web3.eth.getAccounts();
        //need to convert the ethAmount to string for toWei
        //toWei only recieve String or BN
        await ethMtcContract.methods.buy().send({
            from: playerAccount[0],
            value: Web3.utils.toWei(ethAmount.toString(), 'ether'),
        })
        .on('transactionHash', (hash)=>{
            console.log(hash);
            setSucess(true);
            setLoading(false);
            setTxHash(hash);
        })
        .on('receipt', (receipt)=>{
            console.log(receipt);
            //re-get current user MTC Balance and update to home.js
            getMTCToken(playerAccount[0]);
            
        })
        .on('error', (err)=>{
            console.log(err.code + ": " + err.message);
            setTxHash(err.code + ": " + err.message);
        });

    }
}

//get the contract address of the EthMtc Contract
//return string
export function getEthMtcContract(){
    if (ethMtcContract !== null){
        return ethMtcContract.options.address;
    }
}

//Create Event listener for detecting account changes,
//if there is account changes, it will auto process the new account
//no need remove this listener after used as it used to be detection purpose
//window.ethereum.on('accountsChanged', handleAccountchanged);

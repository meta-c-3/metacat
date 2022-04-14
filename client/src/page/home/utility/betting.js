let bankerChoice = ['scissor', 'paper', 'stone'];
let previousNumber = null;
//Use to comparing player and banker choice
let weapon = {
    scissor: {weakto:'stone', strongto:'paper'},
    paper: {weakto:'scissor', strongto:'stone'},
    stone: {weakto:'paper', strongto:'scissor'},
}

export async function triggerRoll(playerChoice){
    return (await Roll(playerChoice))
};

let Roll = (playerChoice)=> 
    new Promise ((resolve)=>{
        if (playerChoice != ""){
            let randomNumber=0;
            let compareResult=null;
            console.log("prev: " + previousNumber);
            //Math.Floor, round of decimal to lowest integer
            //Math.random, random number between 0 (inclusive) and 1 (exclusive)
            //include 0 but not include 1, means randoom between 0 - 0.99
            //So we time Math.random with array length
            //to generate from 0 - array.length(exclusive)
            // Set the previousnumber as current randomnumber
            //to prevent new random number same as previous
            //console.log("prev: " + previousNumber);
            do{
                randomNumber = Math.floor(Math.random() * bankerChoice.length);
                console.log("ran: " + randomNumber);
                if (previousNumber != randomNumber){
                    compareResult = compareRoll(playerChoice,bankerChoice[randomNumber]);
                }
            }while(previousNumber === randomNumber);
            previousNumber = randomNumber;
            resolve([bankerChoice[randomNumber], compareResult]);
        }
    });

let compareRoll = (playerChoice, bankerChoice)=>{
    console.log("player: "+playerChoice);
    console.log("banker: " + bankerChoice);

    //Ex: Player choose scissor, scissor is strong to paper
    //If the scissor strongTo match banker choice, then player win
    if (weapon[playerChoice].strongto === bankerChoice){
        //player win
        console.log("Player win: " + weapon[playerChoice] + " > " + bankerChoice);
        return "win";
    }else if (weapon[playerChoice].weakto === bankerChoice){
        //player lose
        console.log("Player lose: " + weapon[playerChoice] + " < " + bankerChoice);
        return "lose";
    }else{
        //tie
        console.log("Tie: " + weapon[playerChoice] + " = " + bankerChoice);
        return "tie";
    }

}
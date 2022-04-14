const monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayName=["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

//format 17:58 12/3/2022
export const getFulldateAndTime = ()=>{
    let now = new Date();
    let currHour = now.getHours();
    let currMin = now.getMinutes();
    if (currMin.toString().length == 1){
        currMin = "0" + currMin;
    }

    let currDate = now.getDate();
    let currMonth = now.getMonth();
    let currYear = now.getFullYear();

    return (currHour + ":" + currMin + ", " + currDate + "/" + currMonth + "/" +currYear);
}
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

//load middleware module first before route
app.use(cors());
app.use(express.json());

//connect to mongoose
mongoose.connect("mongodb+srv://<YOUR MONGODB ATLAS URL>");

//route
app.use("/", require("./routes/betRecordRoute"));


app.listen(3001, ()=>{
    console.log("Listening to port 3001");
});
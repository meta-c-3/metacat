const mongoose = require("mongoose");

//betRecord schema

const betRecordSchema = new mongoose.Schema({
    gid: String,
    game: String,
    user: String,
    time: String,
    wager: Number,
    mult: String,
    payout: Number,
    result: String
});

const BetRecord = mongoose.model('BetRecord', betRecordSchema);

module.exports = BetRecord;
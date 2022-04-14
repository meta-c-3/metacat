const express = require('express');
const router = express.Router();
const BetRecord = require('../model/betRecordModel');

router.route("/create").post((req, res)=>{
    const gid = req.body.gid;
    const game = req.body.game;
    const user = req.body.user;
    const time = req.body.time;
    const wager = req.body.wager;
    const mult = req.body.mult;
    const payout = req.body.payout;
    const result = req.body.result;

    const newBetRecord = new BetRecord({
        gid: gid,
        game: game,
        user: user,
        time: time,
        wager: wager,
        mult: mult,
        payout: payout,
        result: result
    });

    saveRecord(newBetRecord, res);
});

async function saveRecord(newBetRecord, res){
    await newBetRecord.save()
    .then((result)=>{
        console.log(result);
        res.send(result);
    })
    .catch((err)=>{
        console.log(err);
        res.send(err);
    });
}

module.exports = router;
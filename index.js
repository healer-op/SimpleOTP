const express = require('express')
const cors = require('cors')
const {
    readFileSync,
    writeFileSync
} = require('fs');
const fs = require("fs");
const app = express()
const delay = ms => new Promise(res => setTimeout(res, ms));
const port = process.env.PORT || 3000;

const otpTimerinMilSec = 10000

let rep;

app.use(cors()); 

app.get("/", async function (req, res) {
    let raw = readFileSync('db/otp.json', 'utf8');
    let data = JSON.parse(raw);
    let otp = 1000;
    let findotpIndex = 1;

    while (findotpIndex != -1) {
        otp = Math.floor(Math.random() * 9998) + 1000;
        findotpIndex = data.findIndex(element => element.otp == otp);
    }

    let newOtp = {
        "otp": otp
    }
    data.push(newOtp);
    var newOtpData = JSON.stringify(data);
    fs.writeFile("db/otp.json", newOtpData, (err) => {
        if (err) throw err;
        console.log(`>>> OTP GENERATED ${otp}`)
        res.redirect(`/delete/${otp}`);
    })   
});

app.get("/delete/:otp", async function (req, res) {
    await delay(otpTimerinMilSec);
    let otp = req.params.otp;
    console.log(`>>> Deleting ${otp}`)
    let raw = readFileSync('db/otp.json', 'utf8');
    let data = JSON.parse(raw);
    findotpIndex = data.findIndex(element => element.otp == otp);
    if(findotpIndex !=-1){
        data.splice(findotpIndex, 1);
        var newData2 = JSON.stringify(data);
        fs.writeFile("db/otp.json", newData2, (err) => {
            // Error checking 
            if (err) throw err;
            rep = [{
                "response": true
            }]
            res.send(rep);
        });
    }else {
        rep = [{
            "response": false
        }]
        res.send(rep);
    }
    

});

app.get("/check/:otp", async function (req, res) {
    let otp = req.params.otp;
    let raw = readFileSync('db/otp.json', 'utf8');
    let data = JSON.parse(raw);
    findotpIndex = data.findIndex(element => element.otp == otp);
    if(findotpIndex !=-1){ 
        rep = [{
            "response": true
        }]
        res.send(rep);
    }else {
        rep = [{
            "response": false
        }]
        res.send(rep);
    }
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
})
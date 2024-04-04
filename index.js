const axios = require('axios');
const { username, endpoint } = require('./config.json');
let minersdata;
let minerslog;
let duinoprice;
let minerserver;
let serverstatus;

axios.get(`https://${endpoint}/api.json`, { timeout: 10000 })
    .then(function (response) {
        let rawdata = response.data
        duinoprice = `${rawdata['Duco price']}`
    })
    .catch(function (error) {
        duinoprice = `Not available`
        //serverstatus = error.response.status
        //console.log(`Api error : ${error}`);
    })

/*
    axios.get(`https://${endpoint}/miners/${username}`)
    .then(function (response) {
        if (response.data.hasOwnProperty('result')) {
            minersdata = response.data.result
            minerslog = ObjectMinerData(minersdata);
        } else {
            minerslog = '➥ All miner is offline'
        }
    })
    .catch(function (error) {
        console.log(`Api error : ${error}`);
    })
*/

axios.get(`https://${endpoint}/users/${username}`, { timeout: 10000 })
    .then(function (response) {
        let rawdata = response.data.result
        let checkdata = response.data
        if (checkdata.success == false) {
            console.log(`===========【⛏️ DuinoMiner : USER】===========\n◈ Please check that user is exist (${username})\n◈ Please update your config in config.json\n◈ Lastest check : ${GetTime()}`)
        } else {
            if (rawdata.miners.length === 0) {
                minerslog = '➥ All miner is offline'
            } else {
                minerslog = ObjectMinerData(rawdata.miners);
            }
            console.log(`===========【⛏️ DuinoMiner : ${rawdata.balance.username}】===========\n◈ Balance : ᕲ ${rawdata.balance.balance.toFixed(12)} (${IsUndefined((rawdata.balance.balance * duinoprice).toFixed(4), 'Balance')})\n◈ DUCO Price : ${IsUndefined(duinoprice, 'Price')}\n◈ Lastet fetch : ${GetTime()}\n◈ Miner : ${rawdata.miners.length}/${rawdata.balance.max_miners} (${IsUndefined(minerserver, 'Server')})\n${IsUndefined(minerslog, 'Miners')}`);
        }
    })
    .catch(function (error) {
        console.log(`===========【⛏️ DuinoMiner : USER】===========\n◈ Api error : ${error.code}\n◈ Status code : 408\n◈ Lastest check : ${GetTime()}`)
        //console.log(`Api error : ${error}`);
    })

function ObjectMinerData(RawData) {
    let log = '';

    RawData.forEach((logs, index) => {
        if (index < RawData.length - 1) {
            log += `➥ ${logs.identifier} : ${HashRate(logs.hashrate)} (${logs.accepted}) | Difficulty [${logs.diff}]\n`;
            minerserver = `${logs.pool}`;
        } else {
            log += `➥ ${logs.identifier} : ${HashRate(logs.hashrate)} (${logs.accepted}) | Difficulty [${logs.diff}]`;
            minerserver = `${logs.pool}`;
        }
    });


    return log;
}

function IsUndefined(Object, Action) {
    if (Object === undefined || Object == "undefined" || Object === NaN || Object == "NaN") {
        if (Action == "Miners") {
            return `➥ ${Action} status not available or ${Action} is offline`
        } else if (Action == "Price") {
            return 'Not available'
        } else if (Action == "Server") {
            return 'Offline'
        } else if (Action == "Balance") {
            return 'Calculating'
        }
    } else {
        if (Action == "Price") {
            return `$${Object}`
        } else if (Action == "Balance") {
            return `~ $${Object}`
        }
        return Object
    }
}

function GetTime() {
    let DateNow = new Date(Date.now());

    let Hour = DateNow.getHours();
    let Minutes = DateNow.getMinutes();
    let Seconds = DateNow.getSeconds();

    return `${Hour}:${Minutes}:${Seconds}`
}

function HashRate(Rate) {
    if (Number.isInteger(Rate)) {
        return `${Rate / 1000} KH/s`
    } else {
        return `${Rate} H/s`
    }
}

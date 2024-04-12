const axios = require('axios');
const { username, endpoint, backupendpoint, showminers } = require('./config.json');
let minersdata;
let minerslog;
let duinoprice;
let minerserver;
let serverstatus;
let totalhashrate;
let totalhashratesec;

console.log(`◈ Fetching data from server (${endpoint})`)

axios.get(`https://${endpoint}/api.json`, { timeout: 15000 })
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

axios.get(`https://${endpoint}/users/${username}`, { timeout: 15000 })
    .then(function (response) {
        let rawdata = response.data.result
        let checkdata = response.data
        if (checkdata.success == false) {
            console.clear();
            console.log(`===========【⛏️ DuinoMiner : USER】===========\n◈ Please check that user is exist (${username})\n◈ Please update your config in config.json\n◈ Lastest check : ${GetTime()}`)
        } else {
            if (rawdata.miners.length === 0) {
                minerslog = '➥ All miner is offline'
            } else if (showminers == false) {
                minerslog = '➥ Show miners disable'
            } else {
                minerslog = ObjectMinerData(rawdata.miners);
            }
            console.clear();
            console.log(`===========【⛏️ DuinoMiner : ${rawdata.balance.username}】===========\n◈ Balance : ᕲ ${rawdata.balance.balance.toFixed(12)} (${IsUndefined((rawdata.balance.balance * duinoprice).toFixed(4), 'Balance')})\n◈ DUCO Price : ${IsUndefined(duinoprice, 'Price')}\n◈ Stake : ᕲ ${rawdata.balance.stake_amount}\n◈ Lastet fetch : ${GetTime()}\n◈ Miner : ${rawdata.miners.length}/${rawdata.balance.max_miners} (${IsUndefined(totalhashrate, 'Hashrate')})\n${IsUndefined(minerslog, 'Miners')}`);
        }
    })
    .catch(function (error) {
        console.clear();
        console.log(`===========【⛏️ DuinoMiner : USER】===========\n◈ Api error : ${error.code}\n◈ Reason : ${error.message}\n◈ Lastest check : ${GetTime()}`)
        //console.log(`Api error : ${error}`);
    })

function ObjectMinerData(RawData) {
    let log = '';
    totalhashrate = 0;

    RawData.forEach((logs, index) => {
        if (index < RawData.length - 1) {
            log += `➥ ${logs.identifier} : ${RateCount(logs.hashrate, 'Hash')} (${logs.accepted}) | Difficulty [${RateCount(logs.diff, 'Difficulty')}]\n`;
            minerserver = `${logs.pool}`;
            totalhashrate = totalhashrate + logs.hashrate
        } else {
            log += `➥ ${logs.identifier} : ${RateCount(logs.hashrate, 'Hash')} (${logs.accepted}) | Difficulty [${RateCount(logs.diff, 'Difficulty')}]`;
            minerserver = `${logs.pool}`;
            totalhashrate = totalhashrate + logs.hashrate
        }
    });

    totalhashratesec = RateCount(totalhashrate, 'Hash', false)
    totalhashrate = `~ ${parseFloat(RateCount(totalhashrate, 'Hash')).toFixed(2)} ${totalhashratesec}`
    return log;
}

function IsUndefined(Object, Action) {
    if (Action == "Hashrate" && showminers == false) {
        return 'Disable'
    }

    if (Object === undefined || Object == "undefined" || Object === NaN || Object == "NaN") {
        if (Action == "Miners") {
            return `➥ ${Action} status not available or ${Action} is offline`
        } else if (Action == "Price") {
            return 'Not available'
        } else if (Action == "Hashrate") {
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

function RateCount(Rate, Action, Opt) {
    if (Action == 'Hash') {
        if (Opt == false) {
            if (parseInt(Rate) >= 1000) {
                return `KH/s`
            } else {
                return `H/s`
            }
        } else {
            if (parseInt(Rate) >= 1000) {
                return `${Rate / 1000} KH/s`
            } else {
                return `${Rate} H/s`
            }
        }
    } else if (Action == 'Difficulty') {
        if (Rate >= 1000) {
            return `${Rate / 1000}k`
        } else {
            return `${Rate}`
        }
    }
}

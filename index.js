const axios = require('axios');
const { username, endpoint } = require('./config.json');
let minersdata;
let minerslog;
let duinoprice;

axios.get(`https://${endpoint}/api.json`)
    .then(function (response) {
        let rawdata = response.data
        duinoprice = `$${rawdata['Duco price']}`
    })
    .catch(function (error) {
        console.log(`Api error : ${error}`);
    })

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

axios.get(`https://${endpoint}/users/${username}`)
    .then(function (response) {
        let rawdata = response.data
        if (rawdata.success == false) {
            console.log(`======== DuinoMiner Status : USER ========\n◈ Please check that user is exist (${username})`)
        } else {
            console.log(`======== DuinoMiner Status : ${rawdata.result.balance.username} ========\n◈ Balance : ${rawdata.result.balance.balance} (DUCO)\n◈ DUCO Price : ${IsUndefined(duinoprice, 'Price')}\n◈ Lastet fetch : ${GetTime()}\n◈ Miner : ${rawdata.result.miners.length}/${rawdata.result.balance.max_miners} (Rig)\n${IsUndefined(minerslog, 'Miners')}`);
        }
    })
    .catch(function (error) {
        console.log(`Api error : ${error}`);
    })

function ObjectMinerData(RawData) {
    let log = '';

    RawData.forEach(logs => {
        log += `➥ ${logs.identifier} : ${logs.hashrate} ${HashRate(logs.hashrate)} (${logs.accepted}) | Difficulty [${logs.diff}]\n`;
    });

    return log;
}

function IsUndefined(Object, Action) {
    if (Object === undefined || Object == "undefined") {
        if (Action == "Miners") {
            return `➥ ${Action} status not available or ${Action} is offline`
        } else if (Action == "Price") {
            return 'Not available'
        }
    } else {
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
        return 'KH/s'
    } else {
        return 'H/s'
    }
}
const axios = require('axios');
const { soloaddress, soloendpoint } = require('../config.json');
let minerslog;

axios.get(`https://${soloendpoint}${soloaddress}`, { timeout: 5000 })
    .then(function (response) {
        let rawdata = response.data
        if (rawdata.workersCount == 0) {
            console.log(`============【⛏️ Solo Miner (Public-pool)】============\n◈ No active worker for : ${soloaddress.slice(0, 12)}*****\n◈ Lastest check : ${GetTime()}`)
        } else {
            minerslog = ObjectMinerData(rawdata.workers);
            console.log(`============【⛏️ Solo Miner (Public-pool)】============\n◈ Best difficulty : ${rawdata.bestDifficulty}\n◈ Address : ${soloaddress.slice(0, 12)}*****\n◈ Lastet fetch : ${GetTime()}\n◈ Worker : ${rawdata.workersCount}\n${minerslog}`);
        }
    })
    .catch(function (error) {
        console.log(`============【⛏️ Solo Miner (Public-pool)】============\n◈ Api error : ${error}\n◈ Status code : 408\n◈ Lastest check : ${GetTime()}`)
        //console.log(`Api error : ${error}`);
    })

function ObjectMinerData(RawData) {
    let log = '';

    RawData.forEach((logs, index) => {
        if (index < RawData.length - 1) {
            log += `➥ ${logs.name} : ${(logs.hashRate / 1000).toFixed(2)} KH/s (${logs.sessionId}) | Difficulty [${logs.bestDifficulty}]\n`;
        } else {
            log += `➥ ${logs.name} : ${(logs.hashRate / 1000).toFixed(2)} KH/s (${logs.sessionId}) | Difficulty [${logs.bestDifficulty}]`;
        }
    });


    return log;
}

function GetTime() {
    let DateNow = new Date(Date.now());

    let Hour = DateNow.getHours();
    let Minutes = DateNow.getMinutes();
    let Seconds = DateNow.getSeconds();

    return `${Hour}:${Minutes}:${Seconds}`
}
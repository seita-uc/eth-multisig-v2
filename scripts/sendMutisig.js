const WalletSimple = artifacts.require("WalletSimple"); 
const delay = (time) => new Promise((res) => setTimeout(() => res(), time));
const fs = require('fs');

module.exports = async function(callback) {
    const wallet = await WalletSimple.deployed();

    web3.eth.getAccounts((err, accounts) => {
        if (err) {
            console.error(`Error: ${err}`);
            callback(err);
        }
        console.log(accounts);
        //web3.eth.getTransactionCount(accounts[0], async (err, num) => {
        //if (err) {
        //console.error(`Error: ${err}`);
        //callback(err);
        //}
        //let i = 0;
        //for (; i < repeatNum; i++) {
        //let participants = [];
        //for (j = splitNum * i ; j < splitNum * (i + 1); j++) {
        //participants.push(list[j]);
        //}
        //console.log(`transaction: ${i}`);
        //instance.registerAddresses(participants, {nonce:num + i, gas: 4000000});
        //await delay(1000);
        //}
        //if (remain > 0) {
        //let participants = [];
        //for (k = splitNum * repeatNum ; k < (splitNum * repeatNum) + remain; k++) {
        //participants.push(list[k]);
        //}
        //console.log(`transaction: ${i}`);
        //instance.registerAddresses(participants, {nonce:num + i, gas: 4000000});
        //}
        //});
    });
}

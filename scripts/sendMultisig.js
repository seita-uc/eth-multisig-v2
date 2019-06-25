const WalletSimple = artifacts.require("WalletSimple"); 
const delay = (time) => new Promise((res) => setTimeout(() => res(), time));
const util = require('ethereumjs-util');
const helpers = require('../test/helpers.js');
const accounts = require("../testrpc/accounts.js").accounts;
const NewWeb3 = require("web3");
const newWeb3 = new NewWeb3(web3.currentProvider);

// Helper to get the operation hash, sign it, and then send it using sendMultiSig
const sendMultiSigTestHelper = async function(params) {
    assert(params.msgSenderAddress);
    assert(params.otherSignerAddress);
    assert(params.wallet);

    assert(params.toAddress);
    assert(params.amount);
    assert(params.data === '' || params.data);
    assert(params.expireTime);
    assert(params.sequenceId);

    // For testing, allow arguments to override the parameters above,
    // as if the other signer or message sender were changing them
    const otherSignerArgs = _.extend({}, params, params.otherSignerArgs);
    const msgSenderArgs = _.extend({}, params, params.msgSenderArgs);

    // Get the operation hash to be signed
    const operationHash = helpers.getSha3ForConfirmationTx(
        otherSignerArgs.toAddress,
        otherSignerArgs.amount,
        otherSignerArgs.data,
        otherSignerArgs.expireTime,
        otherSignerArgs.sequenceId
    );
    const sig = util.ecsign(operationHash, privateKeyForAccount(params.otherSignerAddress));

    await params.wallet.sendMultiSig(
        msgSenderArgs.toAddress,
        web3.toWei(msgSenderArgs.amount, 'ether'),
        msgSenderArgs.data,
        msgSenderArgs.expireTime,
        msgSenderArgs.sequenceId,
        helpers.serializeSignature(sig),
        { from: params.msgSenderAddress }
    );
};

//function getAccounts() {
    ////TODO 最新版のtruffleでasync/awaitを導入
    //return new Promise((resolve, reject) => {
        //web3.eth.getAccounts((err, accounts) => {
            //if(err) {
                //reject(err);
            //}
            //resolve(accounts);
        //});
    //});
//}

//function getTransactionCount(account) {
    //return new Promise((resolve, reject) => {
        //web3.eth.getTransactionCount(account, (err, count) => {
            //if(err) {
                //reject(err);
            //}
            //resolve(count);
        //});
    //});
//}

//function signTransaction(tx) {
    //return new Promise((resolve, reject) => {
        //web3.eth.signTransaction(tx, (err, receipt) => {
            //if(err) {
                //reject(err);
            //}
            //resolve(receipt);
        //});
    //});
//}

module.exports = async (callback) => {
    const wallet = await WalletSimple.deployed();
    let signers = new Array();
    for (let i = 0; i < 3; i++) {
        const signer = newWeb3.eth.accounts.privateKeyToAccount("0x" + accounts[i].privkey.toString("hex"));
        signers.push(signer);
    }
    const tx = await signers[0].signTransaction({
        value: 0,
        to: wallet.address,
        chainId: 1337,
        gasLimit: web3.toWei(1, "ether"),
    }).catch((err) => {
        console.error(err);
    });
    console.log(tx);
    return callback();
}

const WalletSimple = artifacts.require("WalletSimple"); 
const helpers = require('../test/helpers.js');
const delay = (time) => new Promise((res) => setTimeout(() => res(), time));
const util = require('ethereumjs-util');
const abi = require('ethereumjs-abi');
const BN = require('bn.js');
const accountsHelper = require("../testrpc/accounts.js");
const NewWeb3 = require("web3");
const newWeb3 = new NewWeb3(web3.currentProvider);

// Helper to get the operation hash, sign it, and then send it using sendMultiSig
const sendMultiSigTestHelper = async (params) => {
    console.log(params.msgSenderAddress);
    console.log(params.otherSignerAddress);
    console.log(params.wallet);

    console.log(params.toAddress);
    console.log(params.amount);
    console.log(params.data);
    console.log(params.expireTime);
    console.log(params.sequenceId);

    // For testing, allow arguments to override the parameters above,
    // as if the other signer or message sender were changing them
    const otherSignerArgs = Object.assign({}, params.otherSignerArgs);
    const msgSenderArgs = Object.assign({}, params.msgSenderArgs);

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

const getSha3ForConfirmationTx = (toAddress, amount, data, expireTime, sequenceId) => {
    return abi.soliditySHA3(
        ['string', 'address', 'uint', 'string', 'uint', 'uint'],
        ['ETHER', new BN(toAddress.replace('0x', ''), 16), web3.toWei(amount, 'ether'), data, expireTime, sequenceId]
    );
};

const getAccounts = () => {
    //TODO 最新版のtruffleでasync/awaitを導入
    return new Promise((resolve, reject) => {
        web3.eth.getAccounts((err, accounts) => {
            if(err) {
                reject(err);
            }
            resolve(accounts);
        });
    });
}

module.exports = async (callback) => {
    const accounts = await getAccounts();
    const wallet = await WalletSimple.deployed();

    //console.log(wallet.address);
    //console.log(accounts[0]);
    //console.log((await wallet.signers.call(0)));

    let signers = new Array();
    for (let i = 0; i < 3; i++) {
        const privkey = accountsHelper.accounts[i].privkey.toString("hex");
        const signer = newWeb3.eth.accounts.privateKeyToAccount("0x" + privkey);
        signers.push(signer);
    }

    await wallet.send(web3.toWei(50, "ether"))
        .catch((err) => {
            console.error(err);
        });

    const sequenceIdString = await wallet.getNextSequenceId.call();
    const sequenceId = parseInt(sequenceIdString);
    const destinationAccount = accounts[5];
    const amount = 5;
    const expireTime = Math.floor((new Date().getTime()) / 1000) + 60; // 60 seconds
    const data = 'abcde35f123'; //sendMultiSig
    const operationHash = getSha3ForConfirmationTx(
        destinationAccount,
        amount,
        data,
        expireTime,
        sequenceId
    );
    const sig = util.ecsign(operationHash, accountsHelper.privateKeyForAccount(accounts[0]));

    console.log("sequenceId: " + sequenceId);
    console.log("destinationAccount: " + destinationAccount);
    console.log("amount: " + amount);
    console.log("expireTime: " + expireTime);
    console.log("data: " + data);
    console.log("operationHash: " + operationHash);
    console.log("sig: " + helpers.serializeSignature(sig));

    await wallet.sendMultiSig(
        destinationAccount,
        web3.toWei(amount, 'ether'),
        data,
        expireTime,
        sequenceId,
        helpers.serializeSignature(sig),
        { from: accounts[1] }
    ).catch((err) => {
        console.error(err);
    });

    //const tx = await signers[0].signTransaction({
        //value: 0,
        //to: wallet.address,
        //chainId: 1337,
        //gasLimit: web3.toWei(1, "ether"),
    //}).catch((err) => {
        //console.error(err);
    //});
    return callback();
}

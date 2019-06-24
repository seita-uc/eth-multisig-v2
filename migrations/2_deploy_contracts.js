const WalletSimple = artifacts.require("./WalletSimple.sol");

function getBlock(blockInfo) {
    return new Promise((resolve, reject) => {
        web3.eth.getBlock(blockInfo, (err, block) => {
            if (err) {
                console.error(err);
                reject(err);
            }
            resolve(block);
        });
    });
}

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        console.log(`accounts: ${accounts}`);
        //await deployer.deploy(WhiteList, whiteListParams.whiteList, { gas: 500000 });

        const allowedSigners = [
            accounts[0],
            accounts[1],
            accounts[2],
        ];

        console.log('------------constructor-arguments------------');
        console.log(`allowedSigners: ${ allowedSigners }`);
        console.log('---------------------------------------------');

        //const constructorArguments = JSON.stringify({
        //network: network,
        //deploymentTime: timestamp,
        //startTime: startTime,
        //endTime: endTime,
        //rate: rate,
        //wallet: wallet,
        //cap: cap,
        //goal: goal,
        //CoinAddress: Coin.address,
        //WhiteListAddress: WhiteList.address
        //});

        //let paths = process.cwd().split('/');
        //let path = `${paths.slice(0, paths.indexOf('ICO')+1).join('/')}/config/constructorArguments.txt`;
        //console.log(`Recording constructor arguments to: ${path} ...`)
        //fs.appendFile(path, constructorArguments + '\n', (err) => {
        //if (err) {
        //console.error(err);
        //}
        //});

        await deployer.deploy(
            WalletSimple,
            allowedSigners,
            //{ gas: 1500000 }
        );

        //const coin = await Coin.deployed();
        //return coin.transferOwnership(Ico.address);
    })
}

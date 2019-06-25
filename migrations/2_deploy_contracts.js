const WalletSimple = artifacts.require("./WalletSimple.sol");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        console.log(`accounts: ${accounts}`);
        const allowedSigners = [
            accounts[0],
            accounts[1],
            accounts[2],
        ];
        console.log('------------constructor-arguments------------');
        console.log(`allowedSigners: ${ allowedSigners }`);
        console.log('---------------------------------------------');
        await deployer.deploy(
            WalletSimple,
            allowedSigners,
            //{ gas: 1500000 }
        );
    })
}

require('babel-register');
require('babel-polyfill');

module.exports = {
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            network_id: '*', // Match any network id
            // https://github.com/trufflesuite/truffle/issues/271#issuecomment-341651827
            gas: 2900000
        },
        develop: {
            port: 8545,
            network_id: 20,
            accounts: 5,
            defaultEtherBalance: 500,
            blockTime: 3
        }
    }
};

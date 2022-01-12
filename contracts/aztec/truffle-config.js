require('@babel/register');

module.exports = {
  compilers: {
    solc: {
      version: '0.5.17',
      settings: {
        optimizer: {
          enabled: true,
          runs: 500,
        },
        evmVersion: 'istanbul',
      },
    },
  },
  networks: {
    development: {
      host: 'localhost',
      network_id: '33',
      port: 4444,
      gasPrice: 130000000,
      from: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826"
    }
  },
};

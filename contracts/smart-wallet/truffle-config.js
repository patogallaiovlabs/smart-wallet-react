require('@babel/register');

module.exports = {
  compilers: {
    solc: {
      version: '0.6.12',
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
      host: '3.126.146.126',
      network_id: '31',
      port: 4444,
      gasPrice: 130000000,
      from: "0x20f51908c8ce306ee805abea650c2f23a1148908"
    }
  },
};

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
      host: '35.159.53.139',
      network_id: '31',
      port: 4444,
      gasPrice: 59240000,
      from: "0xd4bd721748adcbf6c48a55b590b9bf5bf70a7dfb"
    }
  },
};

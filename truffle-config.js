require('@babel/register');

module.exports = {
  compilers: {
    solc: {
      version: '0.5.4',
      settings: {
        optimizer: {
          enabled: true,
          runs: 500,
        },
        evmVersion: 'constantinople',
      },
    },
  },
  networks: {
    development: {
      host: '3.121.224.242',
      network_id: '31',
      port: 4444,
      gasPrice: 130000000,
      from: "0x20F51908C8CE306eE805AbEA650c2F23a1148908"
    },
    test: {
      host: '127.0.0.1',
      network_id: '*',
      port: 8544,
    },
  },
};

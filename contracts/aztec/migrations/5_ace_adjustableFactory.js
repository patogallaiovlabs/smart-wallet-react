/* global artifacts */
const { isUndefined } = require('lodash');

const ACE = artifacts.require('./ACE.sol');
const AdjustableFactory = artifacts.require('./noteRegistry/epochs/201907/adjustable/FactoryAdjustable201907.sol');

module.exports = (deployer) => {
    if (isUndefined(ACE) || isUndefined(ACE.address)) {
        console.log('Please deploy the ACE contract first');
        process.exit(1);
    }

    /* eslint-disable no-new */
    new Promise(() => {
        return deployer.deploy(AdjustableFactory, ACE.address).then(async ({ address }) => {
            const ace = await ACE.at(ACE.address);
            await ace.setFactory(1 * 256 ** 2 + 1 * 256 ** 1 + 2 * 256 ** 0, address);
        });
    });
};

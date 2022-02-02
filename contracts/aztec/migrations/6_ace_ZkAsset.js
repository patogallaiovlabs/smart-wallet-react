//const TestERC20 = require('../../erc20test/build/contracts/TestERC20.json');

const ACE = artifacts.require('./ACE.sol');
const JoinSplitFluid = artifacts.require('./JoinSplitFluid.sol');
const Swap = artifacts.require('./Swap.sol');
const Dividend = artifacts.require('./Dividend.sol');
const PrivateRange = artifacts.require('./PrivateRange.sol');
const JoinSplit = artifacts.require('./JoinSplit.sol');
const BaseFactory = artifacts.require('./noteRegistry/epochs/201907/base/FactoryBase201907');
const AdjustableFactory = artifacts.require('./noteRegistry/epochs/201907/adjustable/FactoryAdjustable201907.sol');
const ZkAsset = artifacts.require('./ZkAsset.sol');

const DOC_TESTNET = '0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0';
module.exports = async (deployer, network) => {

  let aceContract;
  if (network === 'development' || network == 'testnet') {
    aceContract = await ACE.deployed();
    await deployer.deploy(
      ZkAsset,
      aceContract.address, // address _aceAddress,
      DOC_TESTNET,//TestERC20.networks[33].address, 
      '0x16345785D8A0000'//1000000000000000
    );
  }

  console.log('Done! Summary:')

  console.log('|===================================|============================================|')
  console.log('| Contract                          | Address                                    |')
  console.log('|===================================|============================================|')
  console.log('| AZTEC Contracts ===============================================================|')
  console.log(`     ACE: "${ACE.address}",`);
  console.log(`     JoinSplitFluid: "${JoinSplitFluid.address}",`);
  console.log(`     Swap: "${Swap.address}",`);
  console.log(`     Dividend: "${Dividend.address}",`);
  console.log(`     PrivateRange: "${PrivateRange.address}",`);
  console.log(`     JoinSplit: "${JoinSplit.address}",`);
  console.log(`     FactoryBase201907: "${BaseFactory.address}",`);
  console.log(`     FactoryAdjustable201907: "${AdjustableFactory.address}",`);
  console.log(`     ZkAsset: "${ZkAsset.address}"`);
  console.log('|===================================|============================================|\n');
};

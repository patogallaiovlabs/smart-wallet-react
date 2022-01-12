
const TestERC20 = artifacts.require('./TestERC20.sol');

module.exports = async function (deployer) {
  await deployer.deploy(TestERC20)

  console.log('|===================================|============================================|')
  console.log('| Contract                          | Address                                    |')
  console.log('|===================================|============================================|')
  console.log(`     DOC: "${SmartWallet.address}"`);
  console.log('|===================================|============================================|\n')

}

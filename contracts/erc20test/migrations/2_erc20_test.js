
const TestERC20 = artifacts.require('./TestERC20.sol');

module.exports = async function (deployer) {
  await deployer.deploy(TestERC20)

  console.log('|===================================|============================================|')
  console.log('| Contract                          | Address                                    |')
  console.log('|===================================|============================================|')
  console.log(`| TestERC20                         | ${TestERC20.address} |`)
  console.log('|===================================|============================================|\n')

}

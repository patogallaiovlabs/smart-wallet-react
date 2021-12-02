// Primary contracts
const SmartWallet = artifacts.require('SmartWallet')
const SmartWalletFactory = artifacts.require('SmartWalletFactory')

// For CustomSmartWallet support
const CustomSmartWallet = artifacts.require('CustomSmartWallet')
const CustomSmartWalletFactory = artifacts.require('CustomSmartWalletFactory')

module.exports = async function (deployer) {
  await deployer.deploy(SmartWallet)
  await deployer.deploy(SmartWalletFactory, SmartWallet.address)

  await deployer.deploy(CustomSmartWallet)
  await deployer.deploy(CustomSmartWalletFactory, CustomSmartWallet.address)

  console.log('|===================================|============================================|')
  console.log('| Contract                          | Address                                    |')
  console.log('|===================================|============================================|')
  console.log('| Smart Wallet Contracts ========================================================|')
  console.log(`| SmartWallet                       | ${SmartWallet.address} |`)
  console.log(`| SmartWalletFactory                | ${SmartWalletFactory.address} |`)
  console.log('| Custom Smart Wallet Contracts =================================================|')
  console.log(`| CustomSmartWallet                 | ${CustomSmartWallet.address} |`)
  console.log(`| CustomSmartWalletFactory          | ${CustomSmartWalletFactory.address} |`)
  console.log('|===================================|============================================|\n')

}

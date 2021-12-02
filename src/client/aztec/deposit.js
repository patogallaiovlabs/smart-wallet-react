import utils from "@aztec/dev-utils";

const aztec = require("aztec.js");
const dotenv = require("dotenv");
dotenv.config();
const secp256k1 = require("@aztec/secp256k1");

const ZkAssetMintable = artifacts.require("./ZkAssetMintable.sol");
const ERC20Mintable = artifacts.require("ERC20Mintable");
const ZkAsset = artifacts.require("ZkAsset");
const ACE = artifacts.require("ACE");

const {
  proofs: { MINT_PROOF }
} = utils;

const customMetaData = {
  data:
      // eslint-disable-next-line max-len
      '0x00000000000000000000000000000000000000000000000000000000000000c1000000000000000000000000000000000000000000000000000000000000014100000000000000000000000000000000000000000000000000000000000003d7000000000000000000000000000000000000000000000000000000000000000300000000000000000000000041680f6037b257d0f6313038b3dac0102f4fd324000000000000000000000000ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1a000000000000000000000000ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2a0000000000000000000000000000000000000000000000000000000000000003c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c20000000000000000000000000000000000000000000000000000000000000001dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
  dataWithNewEphemeral:
      // eslint-disable-next-line max-len
      '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa00000000000000000000000000000000000000000000000000000000000000c1000000000000000000000000000000000000000000000000000000000000014100000000000000000000000000000000000000000000000000000000000003d7000000000000000000000000000000000000000000000000000000000000000300000000000000000000000041680f6037b257d0f6313038b3dac0102f4fd324000000000000000000000000ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1a000000000000000000000000ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2a0000000000000000000000000000000000000000000000000000000000000003c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c1c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c2c20000000000000000000000000000000000000000000000000000000000000001dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
  addresses: [
      '0x41680f6037B257d0f6313038b3dac0102f4fd324',
      '0xad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1ad1a',
      '0xad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2ad2a',
  ],
};

const { JoinSplitProof, MintProof, note } = aztec;

contract("Private payment", accounts => {
  const bob = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_0
  );

  const sally = secp256k1.accountFromPrivateKey(
    process.env.GANACHE_TESTING_ACCOUNT_1
  );

  let erc20;
  let zkAsset;
  let ace;

  before(async () => {
    erc20 = await ERC20Mintable.deployed();
    zkAsset = await ZkAsset.deployed();
    ace = await ACE.deployed();
    console.log("ERC20Mintable address:", erc20.address);
    console.log("ZkAsset address:", zkAsset.address);
    let totalSupply = await erc20.totalSupply();
    await erc20.mint(bob.address, 100);
    console.log("Bob address(100):", bob.address);
    await erc20.mint(sally.address, 200);
    console.log("Sally address(200):", sally.address);
    totalSupply = await erc20.totalSupply();
    console.log("Total supply:", totalSupply.toNumber());
    
    // Approve ACE contract, to interact with bob tokens.
    const approved = await erc20.approve(ace.address, 100, { from: bob.address });
    //console.log("Approved result:", JSON.stringify(approved));
  });

  it("test check bob balance of ERC20 token", async () => {
    const totalBob = await erc20.balanceOf(bob.address);
    expect(totalBob.toNumber()).to.equal(100);
  });

  it("test zkAzzet token linked to valid ERC20 token", async () => {
    const result = await zkAsset.linkedToken();
    expect(result).to.equal(erc20.address);
  });

  it("test transfer from ERC20 to zkAsset", async () => {
    // Bob Deposit
    let totalBob = await erc20.balanceOf(bob.address);
    expect(totalBob.toNumber()).to.equal(100);

    const depositInputNotes = [];
    const depositInputOwnerAccounts = [];
    const depositPublicValue = 20;
    const publicOwner = bob.address;
    const sender = bob.address;

    const depositOutputNotes = [await note.create(bob.publicKey, depositPublicValue)];
    const publicValue = depositPublicValue * -1;

    const depositProof = new JoinSplitProof(depositInputNotes, depositOutputNotes, sender, publicValue, publicOwner);
    const depositData = depositProof.encodeABI(zkAsset.address);
    const depositSignatures = depositProof.constructSignatures(zkAsset.address, depositInputOwnerAccounts);

    await ace.publicApprove(zkAsset.address, depositProof.hash, 20, { from: bob.address });
    let result = await zkAsset.methods['confidentialTransfer(bytes,bytes)'](depositData, depositSignatures, { from: bob.address });
    debugger
    expect(result.logs[0].event).to.equal('CreateNote');
    expect(result.logs[0].args.owner).to.equal(bob.address);
    expect(result.logs[1].event).to.equal('ConvertTokens');
    expect(result.logs[1].args.owner).to.equal(bob.address);
    expect(result.logs[1].args.value.toNumber()).to.equal(20);

    //console.log("Result:", result.logs);

    totalBob = await erc20.balanceOf(bob.address);
    expect(totalBob.toNumber()).to.equal(80);

    let allowance = await erc20.allowance(bob.address, ace.address);
    expect(allowance.toNumber()).to.equal(80);


    // bob needs to pay sally for a taxi
    // the taxi is 5
    // if bob pays with his note worth 20 he requires 15 change
    console.log("Bob takes a taxi, Sally is the driver");
    const sallyTaxiFee = await aztec.note.create(sally.publicKey, 5);

    console.log("The fare comes to 15");
    const bobNote2 = await aztec.note.create(bob.publicKey, 15);
    const sendProofSender = accounts[0];
    const withdrawPublicValue = 0;

    const sendProof = new JoinSplitProof(
      depositOutputNotes,
      [sallyTaxiFee, bobNote2],
      sendProofSender,
      withdrawPublicValue,
      publicOwner
    );
    const sendProofData = sendProof.encodeABI(zkAsset.address);
    const sendProofSignatures = sendProof.constructSignatures(
      zkAsset.address,
      [bob]
    );
    let result_payment = await zkAsset.methods["confidentialTransfer(bytes,bytes)"](
      sendProofData,
      sendProofSignatures,
      {
        from: accounts[0]
      }
    );

    const event_destroy = result_payment.receipt.logs[0];
    expect(event_destroy.event).to.equal('DestroyNote');
    expect(event_destroy.args.owner).to.equal(bob.address); //0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826 - Bob
    //expect(event_destroy.args.noteHash).to.equal(note_hash);

    const event_create1 = result_payment.receipt.logs[1];
    expect(event_create1.event).to.equal('CreateNote');
    expect(event_create1.args.owner).to.equal(sally.address); //0x7986b3DF570230288501EEa3D890bd66948C9B79 - Sally
    //expect(event_create1.args.noteHash).to.equal(note_hash);
    //expect(event_create1.args.metadata).to.equal(note_hash);

    const event_create2 = result_payment.receipt.logs[2];
    expect(event_create2.event).to.equal('CreateNote');
    expect(event_create2.args.owner).to.equal(bob.address); //0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826 - Bob
    //expect(event_create2.args.noteHash).to.equal(note_hash);
    //expect(event_create2.args.metadata).to.equal(note_hash);


    console.log("Bob paid sally 5 for the taxi and gets 15 back");//, JSON.stringify(result_payment, null, 4));
  });

});

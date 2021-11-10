import { ethers, BigNumber } from 'ethers';
import ISmartWalletFactory from './contracts/ISmartWalletFactory.json'
import EtherClient from './EtherClient';
import web3 from 'web3';

const config = {
    "contracts": {
        "smartWalletFactory": "0x7FE04eA23F7d6765E022792207F11Cb3bE343355",
        "smartWalletTemplate": "0x76F662bdd3dB0afBef24aA4EebacbD37feCED26B",
        "rifToken": "0x1122334455667788990000998877665544332211",
        "testRecipient": "only if needed, used during the webinar presentation"
    }
}

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

export default class SmartWalletClient {


    static async getFactory(): Promise<ethers.Contract> {
        let client = EtherClient.instance();
        return await new ethers.Contract(
            config.contracts.smartWalletFactory,
            ISmartWalletFactory.abi,
            client.getProvider()
        ).connect(client.getSigner());
    }

    static async getEOA() {
        let client = EtherClient.instance();
        return await client.getAddress();
    }

    static async getAddress(index:number) {
        let contract = await SmartWalletClient.getFactory();
        return contract.getSmartWalletAddress(
            await SmartWalletClient.getEOA(), 
            ZERO_ADDR,
            index);
    }


    static async isSmartWalletDeployed(address:string) {
        let client = EtherClient.instance();
        let result = await client.getCode(address);
        return (result !== '0x' && result !== '0x00');
    }

    static async nonce(): Promise<BigNumber> {
        return (await SmartWalletClient.getFactory())
            .nonce(await SmartWalletClient.getEOA());
    }

    static async deploy(index: number) {
        
        let client = EtherClient.instance();
        let owner = await client.getAddress();
        let signer = client.getSigner();
        let factory = await SmartWalletClient.getFactory();
        const message: string =  web3.utils.encodePacked(
            owner, ZERO_ADDR, index
        ) ?? '';
        console.log('message', message);
        
        const hash = ethers.utils.keccak256(message);
        console.log('hash', hash);   
        const digest = ethers.utils.arrayify(hash);
        const signature = await signer.signMessage(digest);
        console.log('signer', owner);
        console.log('signature', signature);
        console.log('index', index);
        
        console.log('ready to send tx: createUserSmartWallet', owner, ZERO_ADDR, index, signature);
        //const result = 'ok';
        const result = await factory.createUserSmartWallet(owner, ZERO_ADDR,
            index, signature);
        console.log('result', result);

        return result;
    }

    public static async test() {
        let client = EtherClient.instance();
        let owner = await client.getAddress();
        let signer = client.getSigner();
        let hash = "0x3ea2f1d0abf3fc66cf29eebb70cbd4e7fe762ef8a09bcc06c8edf641230afec0";
        
        let bhash = ethers.utils.arrayify(hash);
        //Sign
        let signature = await signer.signMessage(bhash);
        console.log('signature', signature);
        
        //Recover
        let encoded = web3.utils.encodePacked(
            String.fromCharCode(25)+'Ethereum Signed Message:\n32', hash)??'';
        console.log('encoded', encoded);
        
        let hashRecover = ethers.utils.keccak256(encoded);
        console.log('hashRecover', hashRecover);
        let binaryData = ethers.utils.arrayify(hashRecover);
        console.log('binaryData', binaryData);
        const recovered = await ethers.utils.recoverAddress(hashRecover, signature);
        console.log('recovered/address', recovered, owner);
 
    }
}
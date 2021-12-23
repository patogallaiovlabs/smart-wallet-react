import { ethers, Contract } from 'ethers';
import ISmartWalletFactory from './contracts/ISmartWalletFactory.json';
import SmartWallet from './contracts/SmartWallet.json';
import EtherClient from './EtherClient';
import web3 from 'web3';
import appconfig from '../config/config'
import WalletClient from './WalletClient';

const ZERO_ADDR = '0x0000000000000000000000000000000000000000';

const config = appconfig.testnet;

export default class SmartWalletClient extends WalletClient {

    static async getFactory(): Promise<ethers.Contract> {
        let client = EtherClient.instance();
        return new ethers.Contract(
            config.contracts.smartWallet.factory,
            ISmartWalletFactory.abi,
            client.getProvider()
        ).connect(client.getSigner());
    }

    static async getInstance(index: number): Promise<WalletClient> {
        let address = await this.getAddress(index);
        return this.getInstanceByAddress(index, address);
    }

    static async getInstanceByAddress(index:number, address: string): Promise<SmartWalletClient> {
        let client = EtherClient.instance();
        const contract = new ethers.Contract(
            address,
            SmartWallet.abi,
            client.getProvider()
        ).connect(client.getSigner());
        return new SmartWalletClient(index, contract, await WalletClient.getInstance());
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

    static async deploy(index: number) {
        
        let client = EtherClient.instance();
        let owner = await client.getAddress();
        let signer = client.getSigner();
        let factory = await SmartWalletClient.getFactory();

        // 1. Sign a message, for contract owner validation
        // encode (validator, owner, recoverer, index)
        let message: string =  web3.utils.encodePacked(
            factory.address, owner, ZERO_ADDR, index
        ) ?? '';
        // hash and sign the message.
        const hash = ethers.utils.keccak256(message);
        const toSignAsBinaryArray = ethers.utils.arrayify(hash)
        const signature = await signer.signMessage(toSignAsBinaryArray);

        //Call factory contract
        console.log('ready to send tx: {validator} createUserSmartWallet(owner, recoverer, index, signature)', factory.address, owner, ZERO_ADDR, index, signature);
        const result = await factory.functions.createUserSmartWallet(
            owner, ZERO_ADDR, index, signature);
        
        console.log('result', result);
        return result;
    }

    /** INSTANCE */

    private index:number;
    private contract:Contract;
    private active:boolean;
    private parent:WalletClient;

    constructor(index:number, contract:Contract, parent:WalletClient){
        super(EtherClient.instance(), contract.address);
        this.index = index;
        this.parent = parent;
        this.contract = contract;
        this.active = false;
    }

    async init() {
        let result = await super.getClient().getCode(this.address);
        this.active = (result !== '0x' && result !== '0x00');
    }

    get mainAddress() : string {
        return this.parent.address;
    }

    getIndex(): number{
        return this.index;
    }

    get nonce(): Promise<number> {
        return this.contract.nonce();
    }

    isActive() : boolean {
        return this.active;
    }

    async execute(to: string, calldata: string): Promise<any> {
        console.log('Using wallet {#} with addresss {#}', this.index, this.contract.address);
        //Call factory contract
        console.log('Send tx: directExecute(to, calldata)', to, calldata);
        return this.contract.directExecute(to, calldata);
    }

    async signTypedData(msg:any): Promise<any> {
        console.log('SW:signTypedData', msg);
        return Promise.resolve('0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    }

}
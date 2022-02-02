import { ethers } from 'ethers';
import EtherClient from './EtherClient';
import ERC20Client from './ERC20Client';
import { TransactionResponse } from '@ethersproject/providers';
import AztecClient from '../aztec/AztecClient';
import Note from '../aztec/note';

export default class WalletClient {

    static async getInstance(index?: number): Promise<WalletClient> {
        let client = EtherClient.instance();
        return new WalletClient(client, await client.getAddress());
    }

    /** INSTANCE */
    protected client:EtherClient;
    _address:string;
    config:{encryptionPK:string, defaultPrivate:boolean} = {
        encryptionPK: '',
        defaultPrivate: true
    };

    constructor(client:EtherClient, address: string){
        this.client = client;
        this._address = address;
    }

    async init() {
        const key = 'wallet-config-' + this.address;
        const configStr = window.localStorage.getItem(key);
        if (!configStr) {
            this.config.encryptionPK = await this.getEncryptionPK();
            window.localStorage.setItem(key, JSON.stringify(this.config));
        } else {
            this.config = JSON.parse(configStr);
        }
    }

    getDefaultPrivate(): boolean {
        return this.config.defaultPrivate;
    }

    setDefaultPrivate(defaultPrivate:boolean) {
        const key = 'wallet-config-' + this.address;
        this.config.defaultPrivate = defaultPrivate;
        window.localStorage.setItem(key, JSON.stringify(this.config));
    }

    getConfig() {
        return this.config;
    }

    getIndex(): number{
        return -1;
    }

    get address() : string {
        return this._address;
    }

    get mainAddress() : string {
        return this._address;
    }

    getPK() {
        return this.client.getPK();
    }

    getEncryptionPK() {
        return this.client.getEncryptionPK();
    }

    async decryptMessage(encrypted:string) {
        const cache = window.localStorage.getItem(encrypted);
        if(cache) {
            return cache;
        } else {
            const result = await this.client.send({
                method: 'eth_decrypt',
                params: [encrypted, this.mainAddress]
            });
            window.localStorage.setItem(encrypted, '' + result);
            return Promise.resolve(result);
        }
    }

    get nonce() : Promise<number> {
        return this.client.getNonce();
    }

    protected getClient(): EtherClient {
        return this.client;
    }

    async signTypedData(msg:any): Promise<any> {
        return this.getClient().getProvider().send('eth_signTypedData_v4', [ this.address, JSON.stringify(msg) ]);
    }

    signMessage(msg:string): Promise<string> {
        return this.getClient().getSigner().signMessage(msg);
    }

    isActive() : boolean {
        return true;
    }

    async approve(erc20: ERC20Client, approvee:string, amount:any): Promise<void | TransactionResponse> {
        const encoded = erc20.encodeApprove(approvee, amount);
        console.log('approving...');
        return await this.execute(erc20.getAddress(), encoded);
    }

    async executeRaw(abi:any, contractAddress: string, call: string, params: string[]): Promise<void | TransactionResponse> {
        const contract = new ethers.Contract(
            contractAddress,
            abi,
            this.getClient().getProvider()
        );
        const encoded = EtherClient.encode(contract, call, params);
        return await this.execute(contractAddress, encoded);
    }

    async execute(to: string, calldata: string): Promise<void | TransactionResponse> {
        const tx : ethers.providers.TransactionRequest = {
            from: await this.address,
            to: to,
            value: ethers.utils.parseEther('0.0'),
            nonce: await this.nonce,
            data: calldata
        }
        const result = await this.client.sendTransaction(tx);
        return result;
    }

    async confidentialTransfer(proof: any) {
        try {
            const zkAsset = AztecClient.getZkAsset();
            const encoded2 = await AztecClient.confidentialTransfer(zkAsset, proof, []);
            const txConfidentialTransfer = await this.execute(zkAsset.address, encoded2);
            return await txConfidentialTransfer?.wait();
        } catch (e) {
            console.log('confidential transfer error', e);
            throw e;
        }
    }

    async createDepositProof(amountFormatted: number) {
        const myaddress = this.address;
        const PK = this.getPK();
        const encryptionPK = this.getEncryptionPK();
        return await AztecClient.createDepositProof(PK, encryptionPK, myaddress, myaddress, amountFormatted);
    }

    async erc20Approve(amountFormatted: number) {
        try {
            const doc = ERC20Client.getDOC();
            const ace = AztecClient.getACE();
            const txApprove = await this.approve(doc, ace.address, this.amountToHex(amountFormatted));
            return await txApprove?.wait();
        } catch (e) {
            console.log('erc20Approve error', e);
            throw e;
        }
    }

    async aztecPublicApprove(amountFormatted: number, proof: any, ) {
        try {
            const zkAsset = AztecClient.getZkAsset();
            const ace = AztecClient.getACE();
            const encoded = await AztecClient.publicApprove(zkAsset.address, proof, this.amountToHex(amountFormatted));
            const txPublicApprove = await this.execute(ace.address, encoded);
            return await txPublicApprove?.wait();
        } catch (e) {
            console.log('aztecPublicApprove error', e);
            throw e;
        }
    }

    async sendNote(note: Note, to:string, encryptionPK:string) { 
        const encryptionPKString = ethers.utils.toUtf8String(encryptionPK);
        const myaddress = this.address;
        const PK = this.getPK();
        const proof = await AztecClient.createJoinProof(PK, encryptionPKString, to, myaddress, [note], note.k.toNumber());
        const zkAsset = AztecClient.getZkAsset();
        console.log('--------------------');
        
        const wallet = this;

        const signTypedData = async (msg:any) => {
            return await wallet.signTypedData(msg);
        }

        const sendProofData = proof.encodeABI(zkAsset.address);
        const sendProofSignatures = await proof.constructSignaturesMetamask(
          zkAsset.address,
          signTypedData
        );


        // ZKAsset confidential transfer (deposit)
        // TO-DO agregar el firmado de manera externa. Creo que ya esta implementado, checkear.
        const encoded2 = await AztecClient.encodeConfidentialTransfer(zkAsset, sendProofData, sendProofSignatures);
        const txConfidentialTransfer = await this.execute(zkAsset.address, encoded2);
        console.log('confidentialTransfer sent...',txConfidentialTransfer);
        return txConfidentialTransfer;
    }


    async withdrawNote(note: any): Promise<void | TransactionResponse> {
        const myaddress = this.address;
        const proof = await AztecClient.createWithdrawProof(myaddress, myaddress, [note]);
        const zkAsset = AztecClient.getZkAsset();
        console.log('--------------------');

        // ZKAsset confidential transfer (deposit)
        const encoded2 = await AztecClient.confidentialTransfer(zkAsset, proof, []);
        const txConfidentialTransfer = await this.execute(zkAsset.address, encoded2);
        console.log('confidentialTransfer sent...',txConfidentialTransfer);
        const txConfidentialTransferResult = await txConfidentialTransfer?.wait()
        console.log('confidentialTransfer result', txConfidentialTransferResult);
        console.log('--------------------');
        return txConfidentialTransfer;
    }

    async decodeMetadata(data:string, decrypt?:boolean):Promise<any> {
        return await AztecClient.decodeMetadata(data, this, decrypt);
    }

    amountToHex(amountFormatted: number) {
        return ethers.BigNumber.from(amountFormatted).mul(ethers.BigNumber.from('0x16345785D8A0000')).toHexString();
    }

}
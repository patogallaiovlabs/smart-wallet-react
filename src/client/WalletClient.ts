import { ethers } from 'ethers';
import EtherClient from './EtherClient';
import ERC20Client from './ERC20Client';
import { TransactionResponse } from '@ethersproject/providers';
import AztecClient from './aztec/AztecClient';

export default class WalletClient {

    static async getInstance(index: number): Promise<WalletClient> {
        let client = EtherClient.instance();
        return new WalletClient(client, await client.getAddress());
    }

    /** INSTANCE */

    protected client:EtherClient;
    _address:string;

    constructor(client:EtherClient, address: string){
        this.client = client;
        this._address = address;
    }

    async init() {

    }

    getIndex(): number{
        return -1;
    }

    get address() : string {
        return this._address;
    }

    getPK() {
        return this.client.getPK();
    }

    get nonce() : Promise<number> {
        return this.client.getNonce();
    }

    protected getClient(): EtherClient {
        return this.client;
    }

    signMessage(msg:string): Promise<string> {
        return this.getClient().getSigner().signMessage(msg);
    }

    isActive() : boolean {
        return true;
    }

    async approve(erc20: ERC20Client, approvee:string, amount:number): Promise<void | TransactionResponse> {
        const encoded = erc20.encodeApprove(approvee, amount);
        return await this.execute(erc20.getAddress(), encoded);
    }

    async execute(to: string, calldata: string): Promise<void | TransactionResponse> {
        const tx : ethers.providers.TransactionRequest = {
            from: await this.address,
            to: to,
            value: ethers.utils.parseEther('0.0'),
            nonce: await this.nonce,
            data: calldata
        }
        console.log('Send tx:', to, calldata);
        const result = await this.client.sendTransaction(tx);
        console.log('result', result);
        return result;
    }

    async convertDocs(amountFormatted: number) {
        const doc = ERC20Client.getDOC();
        const myaddress = this.address;
        const PK = this.getPK();
        const proof = await AztecClient.createDepositProof(PK, myaddress, myaddress, amountFormatted);
        const ace = AztecClient.getACE();
        const zkAsset = AztecClient.getZkAsset();

        console.log('--------------------');
        // ERC20 approve
        const txApprove = await this.approve(doc, ace.address, amountFormatted);
        console.log('approve sent...', txApprove);
        const txApproveResult = await txApprove?.wait();
        console.log('approve result:', txApproveResult);
        console.log('--------------------');

        // Aztec/ZKAsset public approve
        const encoded = await AztecClient.publicApprove(zkAsset.address, proof, amountFormatted);
        const txPublicApprove = await this.execute(ace.address, encoded);
        console.log('publicApprove sent...',txPublicApprove);
        const txPublicApproveResult = await txPublicApprove?.wait();
        console.log('publicApprove result', txPublicApproveResult);
        console.log('--------------------');

        // ZKAsset confidential transfer (deposit)
        const encoded2 = await AztecClient.confidentialTransfer(zkAsset, proof, []);
        const txConfidentialTransfer = await this.execute(zkAsset.address, encoded2);
        console.log('confidentialTransfer sent...',txConfidentialTransfer);
        const txConfidentialTransferResult = await txConfidentialTransfer?.wait()
        console.log('confidentialTransfer result', txConfidentialTransferResult);
        console.log('--------------------');
    }

}
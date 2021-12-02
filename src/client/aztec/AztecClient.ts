
import appconfig from "../../config/config";
import { ethers, Contract, BigNumber } from 'ethers';
import IACE from '../contracts/ACE.json';
import IZkAsset from '../contracts/ZkAsset.json';
import * as aztec from 'aztec.js';
console.log('aztec', aztec);
const { JoinSplitProof, note } = aztec;

const config = appconfig.testnet;
const ACE = new ethers.Contract(
    config.contracts.aztec.ACE,
    IACE.abi
);

const ZkAsset = new ethers.Contract(
    config.contracts.aztec.ZkAsset,
    IZkAsset.abi
);

export default class AztecClient {
    
    static async createDepositProof(PK:string, publicOwner:string, sender:string, value:number) {
        const inputs:any[] = [];

        const depositOutputNotes = [await note.create(PK, value)];
        const publicValue = value * -1;

        return new JoinSplitProof(inputs, depositOutputNotes, sender, publicValue, publicOwner);
    }

    static async publicApprove(approvee:string, depositProof: typeof JoinSplitProof, amount:number) {
        return  this._encode(ACE, "publicApprove", [approvee, depositProof.hash, amount]);
    }

    static async confidentialTransfer(zkAsset:Contract, depositProof: typeof JoinSplitProof, inputOwners:any[]) {
        const depositData = depositProof.encodeABI(zkAsset.address);
        const depositSignatures = depositProof.constructSignatures(zkAsset.address, inputOwners);
        return  this._encode(zkAsset, "confidentialTransfer(bytes,bytes)", [depositData, depositSignatures]);
    }

    static getACE() {
        return ACE;
    }

    static getZkAsset() {
        return ZkAsset;
    }

    private static _encode(contract:ethers.Contract, call: string, params: any): string {
        return contract.interface.encodeFunctionData(call, params);
    }

}
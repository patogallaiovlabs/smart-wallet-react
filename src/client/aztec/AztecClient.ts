
import appconfig from "../../config/config";
import { ethers, Contract } from 'ethers';
import IACE from '../contracts/ACE.json';
import IZkAsset from '../contracts/IZkAsset.json';
import * as aztec from 'aztec.js';
import * as notelib from '@aztec/note-access';
import WalletClient from '../WalletClient';
import EtherClient from '../EtherClient';
const { JoinSplitProof, note } = aztec;

const sigUtil = require('eth-sig-util');
const ethUtil = require('ethereumjs-util');

const config = appconfig.testnet;
const ACE = new ethers.Contract(
    config.contracts.aztec.ACE,
    IACE.abi
);

const ZkAsset = new ethers.Contract(
    config.contracts.aztec.ZkAsset,
    IZkAsset.abi
);

const ENCRYPTION_ALGO = 'x25519-xsalsa20-poly1305';
const UTF8 = 'utf8';

export default class AztecClient {
    
    static async createDepositProof(PK:string, encryptionPK:any, publicOwner:string, sender:string, value:number) {
        const inputs:any[] = [];
        const access = null;
        const newNote = await note.create(PK, value, access, sender);
        this.grantViewAccess([{address: sender, encryptionPK}], newNote);
        const depositOutputNotes = [newNote];
        const publicValue = value * -1;

        return new JoinSplitProof(inputs, depositOutputNotes, sender, publicValue, publicOwner);
    }

    static async createWithdrawProof(publicOwner:string, sender:string, wnotes:[any]) {
        let publicValue = 0;
        const outputs:any[] = [];
        wnotes.forEach((n:any) => {
            publicValue += n.k.toNumber();
        });

        return new JoinSplitProof(wnotes, outputs, sender, publicValue, publicOwner);
    }
     
    static async createJoinProof(PK:string, encryptionPK:any, toAddress:string, fromAddress:string, inputs:any[], value:number) {
        const access = null;
        const newNote = await note.create(PK, value, access, toAddress);
        this.grantViewAccess([{address: toAddress, encryptionPK}], newNote);
        const depositOutputNotes = [newNote];
        const publicValue = 0;
        return new JoinSplitProof(inputs, depositOutputNotes, fromAddress, publicValue, toAddress);
    }

    static async publicApprove(approvee:string, depositProof: typeof JoinSplitProof, amount:any) {
        return  EtherClient.encode(ACE, "publicApprove", [approvee, depositProof.hash, amount]);
    }

    static async confidentialTransfer(zkAsset:Contract, jsProof: typeof JoinSplitProof, inputOwners:any[]) {
        const data = jsProof.encodeABI(zkAsset.address);
        const inputSignatures = jsProof.constructSignatures(zkAsset.address, inputOwners);
        return  EtherClient.encode(zkAsset, "confidentialTransfer(bytes,bytes)", [data, inputSignatures]);
    }

    static async encodeConfidentialTransfer(zkAsset:Contract, data:string, signatures:string) {
        return EtherClient.encode(zkAsset, "confidentialTransfer(bytes,bytes)", [data, signatures]);
    }

    static getACE() {
        return ACE;
    }

    static getZkAsset() {
        return ZkAsset;
    }

    // ---- ENCRYPTION ----

    /**
     * Grant an Ethereum address access to the viewing key of a note
     *
     * @param {Array} access mapping between an Ethereum address and the linked publickey
     * @returns {string} customData - customMetaData which will grant the specified Ethereum address(s)
     * access to a note
     */
     static grantViewAccess(access:any, note:any) {
        const noteViewKey = note.getView();
        const metaData = this.generateAccessMetaData(access, noteViewKey);
        note.setMetaData(metaData);
    }
    /**
     * @method generateAccessMetaData - grant an Ethereum address view access to a note
     * @param {Array} access - mapping between an Ethereum address and the linked public key. The specified address
     * is being granted access to the note
     * @param {String} noteViewKey - viewing key of the note
     */
     static generateAccessMetaData(access:any, noteViewKey:any) {
        const noteAccess = access.map(({ address, encryptionPK }:any) => {
            const viewingKey = this.encryptMessage(noteViewKey, encryptionPK);
            return {
                address,
                viewingKey: this.toHexString(viewingKey),
            };
        });
        let metadata = notelib.metadata('');
        metadata.addAccess(noteAccess);
        return metadata;
    }

    static async decodeMetadata(data:string, wallet:WalletClient, decrypt?:boolean):Promise<any> {

        let eventLog = data.substring(0,196);
        const noteLog = await aztec.note.fromEventLog(eventLog);
        let filtered = data.substring(196);
        const metadata = notelib.metadata(filtered);
        metadata.note = noteLog;
        if(decrypt) {
            const viewKey = metadata.getAccess(wallet.address);
            const encryptedObjt = notelib.fromHexString(viewKey.viewingKey).export();
            encryptedObjt.ciphertext = this.hexToString(encryptedObjt.ciphertext);
            encryptedObjt.ephemPublicKey = this.hexToString(encryptedObjt.ephemPublicKey);
            encryptedObjt.nonce = this.hexToString(encryptedObjt.nonce);
            encryptedObjt.version = ENCRYPTION_ALGO;
            metadata.encrypted = this._encodeData(encryptedObjt);
            metadata.decrypted = await wallet.decryptMessage(metadata.encrypted);
            metadata.note = await aztec.note.fromViewKey(metadata.decrypted);
        }
        return metadata;
    }
    
    static encryptMessage(msg:string, encryptionPK:any) {
        return this._encryptMessage(encryptionPK, msg);
    };

    static _encryptMessage(publicKey:any, msg:any) {
        const encrypted =  ethUtil.bufferToHex(
            Buffer.from(
                JSON.stringify(
                    sigUtil.encrypt(
                        publicKey,
                        { data: msg },
                        ENCRYPTION_ALGO
                    )
                ),
                UTF8
            )
        );
        const buff = Buffer.from(encrypted.slice(2), 'hex');
        const buffurf8 = buff.toString(UTF8);
        const result = JSON.parse(buffurf8);
        return result;
    };

    static hexToString(hex:string) {
        const buff = Buffer.from(hex.slice(2), 'hex');
        return buff.toString(UTF8);
    }

    static _toHex(data:string) { 
        return ethUtil.bufferToHex(
            Buffer.from(data)
        );
    }

    static _encodeData(data:any) {
        return ethUtil.bufferToHex(
            Buffer.from(
                JSON.stringify(
                    data
                ),
                UTF8
            )
        );
    };

    /**
     * Receives an encrypted object (returned by metamask) and serialize into Hex format
     * Where result: 0x + nonce + ephemPublicKey + ciphertext
     * @param encryptedData 
     * @returns 
     */
    static toHexString(encryptedData:any) {
        let { ciphertext, ephemPublicKey, nonce } = encryptedData;
        nonce = this._toHex(nonce);
        ciphertext = this._toHex(ciphertext);
        ephemPublicKey = this._toHex(ephemPublicKey);
        const result = [nonce, ephemPublicKey.slice(2), ciphertext.slice(2)].join('');
        return result;
    }

}
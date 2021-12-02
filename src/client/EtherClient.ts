import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import { ethers } from 'ethers';

declare const window: any;

interface EtherRequest {
    method:string;
    params:any;
}

export default class EtherClient {

    static instance() {
        return INSTANCE;
    }
    
    private provider:Web3Provider;
    private ethereum: ethers.providers.JsonRpcProvider;
    private events: any = {};
    private PK:string = '';

    constructor(window:any) {
        this.ethereum = window.ethereum;
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.initialize();
    }

    private async initialize() {
        this.on('accountsChanged', (accounts:any) => {
            console.log('accounts changed', accounts);
            if (accounts.length === 0) {
                return this.close();
            }
            this.close();
            this.provider = new ethers.providers.Web3Provider(window.ethereum);    
            this.initialize();
            this.events['accountsChanged'].forEach((callback:()=>void) => {
                callback()
            });
        });

        this.on("networkChanged", () => {
            console.log('network');
            this.close();
            this.initialize();
        });

        this.on('chainChanged', () => {
            console.log('chainChanged');
            this.close();
            this.initialize();
        });

        this.on('disconnect', () => {
            console.log('disconnect');
            this.close();
            this.initialize();
        });

        this.on('block', (e) => {
            console.log('block', e);
        });
        const msg = 'Connect to Aztec Dapp';
        const signature = await this.getSigner().signMessage(msg);
        this.PK = ethers.utils.recoverPublicKey(ethers.utils.hashMessage(msg), signature);
    }

    async sendTransaction(tx:ethers.providers.TransactionRequest): Promise<void | ethers.providers.TransactionResponse> {
        return await this.getSigner().sendTransaction(tx);
    }

    send(req:EtherRequest):Promise<any> {
        return this.provider.send(req.method, req.params);
    }

    getSigner():JsonRpcSigner {
      return this.provider.getSigner();
    }

    getAddress() : Promise<string> {
        return this.getSigner().getAddress();
    }

    getPK() : string {
        return this.PK;
    }

    getNonce() : Promise<number> {
        return this.getSigner().getTransactionCount('latest');
    }

    getChainId(): Promise<number> {
        return this.getSigner().getChainId();
    }

    on(event: string, callback: ethers.providers.Listener) {
        let events = this.events[event] || []
        events.push(callback);
        this.events[event] = events;
    }

    getProvider(): Web3Provider{
        return this.provider;
    }

    getCode(address: string) {
        return this.getProvider().getCode(address, "pending");
    }

    close(): void {
        this.ethereum.removeAllListeners();
    }
}

const INSTANCE:EtherClient = new EtherClient(window);
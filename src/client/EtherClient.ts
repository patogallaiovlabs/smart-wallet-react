import { Web3Provider, JsonRpcSigner } from '@ethersproject/providers';
import { ethers  } from 'ethers';

declare const window: any;

//RSK Test
const pk = '991a61c28759e9586ee6d065f2124e1c922fdd50d9f9bc68a2a6e27fdebe7c00';

interface EtherRequest {
    method:string;
    params:any;
}

export default class EtherClient {

    static instance() {
        return INSTANCE;
    }
    
    provider:Web3Provider;
    ethereum: ethers.providers.JsonRpcProvider;
    events: any = {};

    constructor(window:any) {
        this.ethereum = window.ethereum;
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.initialize();
    }

    private initialize(): void {
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
        });

        this.on('chainChanged', () => {
            console.log('chainChanged');
            this.close();
        });

        this.on('disconnect', () => {
            console.log('disconnect');
            this.close();
        });
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
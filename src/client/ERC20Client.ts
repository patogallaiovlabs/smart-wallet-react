import { BigNumber, ethers, Contract } from 'ethers';
import ERC20 from './contracts/ERC20.json';
import EtherClient from './EtherClient';
import appconfig from '../config/config'

const config = appconfig.testnet;

export default class ERC20Client {

    static getDOC(): ERC20Client {
        let client = EtherClient.instance();
        return this._getInstance(
            config.contracts.erc20.DOC,
            client
        )
    }
    
    static getRDOC(): ERC20Client {
        let client = EtherClient.instance();
        return this._getInstance(
            config.contracts.erc20.RDOC,
            client
        )
    }

    private static _getInstance(address:string, client?: EtherClient): ERC20Client {
        let result = new ethers.Contract(
            address,
            ERC20.abi
        );
        if (client) {
            result = result.connect(client.getSigner());
        }
        return new ERC20Client(result);
    }

    /** INSTACE */
    
    contract: Contract;

    constructor(contract: Contract) {
        this.contract = contract;
    }

    getAddress(): string {
        return this.contract.address;
    }

    balanceOf(address: string): Promise<BigNumber> {
        return this.contract.balanceOf(address);
    }

    encodeApprove(...params:any): string {
        return this._encode("approve", params);
    }

    encodeTransfer(...params:any): string {
        return this._encode("transfer", params);
    }

    private _encode(call: string, params: any): string {
        return this.contract.interface.encodeFunctionData(call, params);
    }
}


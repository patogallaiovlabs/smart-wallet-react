
const appconfig = {
    testnet : {
        contracts: {
            smartWallet: {
                factory: "0x289d8790A0cd8441F0b3b5b99E482341040B44A6",
                template: "0xEb6E7C9b5C46F878664b0DDC5FE026Bf65DbEe5f"
            },
            erc20: {
                DOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0",
                RDOC: "0xC3De9F38581f83e281f260d0DdbaAc0e102ff9F8"
            },
            aztec: {
                ACE: "0xEF13B24F317595ef564DC1B65c1A28963162127C",
                JoinSplitFluid: "0x63De3f69915073Eb59E9c7b74df9Fb8fB7CbcD6f",
                Swap: "0x201C95E9e90076304fc67e04eFc5737582922A1e",
                JoinSplit: "0x093370fa6AdB406887773a3409d2986C2f1b1e65",
                PrivateRange: "0x2773815f80CD1c0F4b68040667e79b9919CfFc5F",
                Dividend: "0xBa90D40a314ee10671E45d69c5A1644412C4a0E2",
                FactoryBase201907: "0x6b30d50401DEC7361549446EAe9dd7a1BFA57E96",
                FactoryAdjustable201907: "0x1f35de5d26Cc4A1687C9e1cE7634112C8eAcc216",
                ZkAsset: "0xC046559F6EEB47D4560949046236e6d12482181F"
            }
        }
    },
    mainnet : {
        contracts: {
            smartWallet: {
                factory: "",
                template: ""
            },
            erc20: {
                DOC: "",
                RDOC: ""
            }
        }
    }
};

export default appconfig;
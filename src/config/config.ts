
/*
|===================================|============================================|
| Smart Wallet Contracts ========================================================|
| SmartWallet                       | 0x20b87390b030717Af53aFB09C98D86e1EB74C11f |
| SmartWalletFactory                | 0x4b1bFCd7ee2c457c35DE6351D90072C3893D50a5 |
| Custom Smart Wallet Contracts =================================================|
| CustomSmartWallet                 | 0xBFB42b5F390FAc806eF0787787aAd9a6F85E10F3 |
| CustomSmartWalletFactory          | 0xB5A2dFeAB8C04374AE160BB83CC74F3E29C4189f |
|===================================|============================================|
DOC:
- TESTNET: 0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0
- Regtest: 0xC591D6b9238444A2ec22c8F1b54Eb995Ec2D4121
*/
const appconfig = {
    regtest : {
        contracts: {
            smartWallet: {
                template: "0x83C5541A6c8D2dBAD642f385d8d06Ca9B6C731ee",
                factory: "0xE0825f57Dd05Ef62FF731c27222A86E104CC4Cad"
            },
            erc20: {
                DOC: "0x0e19674ebc2c2B6Df3e7a1417c49b50235c61924",
                RDOC: "0x0e19674ebc2c2B6Df3e7a1417c49b50235c61924"
            },
            aztec: {
                ACE: "0x320c72614222bD0C615e52eac5B23900cEf2b889",
                JoinSplitFluid: "0x37d2e83C04a4be0a6c577B3f091a41eb21f7dFBb",
                Swap: "0x24307fAF57D235783582F1912Ef6A384ab456568",
                Dividend: "0x13cF0a53b6102b518e8b547d5E50b38C1b089E08",
                PrivateRange: "0x848FD4E195dBb156F245E3E5FaB5b36706776Ba5",
                JoinSplit: "0xd6681FD2d471c044BDdDc9DF00D1Af195Bd58bfa",
                FactoryBase201907: "0x8650B271F7cC565aa604F9f98Aa1A5B723B5b2f3",
                FactoryAdjustable201907: "0xb887D5B504028f88e21dfC042648C379AF3f1F20",
                ZkAsset: "0xB752c0a21553abA0BCd68f6B4e32E44c4b8B657e"
            }
        }
    },
    
    testnet : {
        contracts: {
            smartWallet: {
                template: "0x83C5541A6c8D2dBAD642f385d8d06Ca9B6C731ee",
                factory: "0xE0825f57Dd05Ef62FF731c27222A86E104CC4Cad"
            },
            erc20: {
                DOC: "0x0e19674ebc2c2B6Df3e7a1417c49b50235c61924",
                RDOC: "0x0e19674ebc2c2B6Df3e7a1417c49b50235c61924"
            },
            aztec: {
                ACE: "0x320c72614222bD0C615e52eac5B23900cEf2b889",
                JoinSplitFluid: "0x37d2e83C04a4be0a6c577B3f091a41eb21f7dFBb",
                Swap: "0x24307fAF57D235783582F1912Ef6A384ab456568",
                Dividend: "0x13cF0a53b6102b518e8b547d5E50b38C1b089E08",
                PrivateRange: "0x848FD4E195dBb156F245E3E5FaB5b36706776Ba5",
                JoinSplit: "0xd6681FD2d471c044BDdDc9DF00D1Af195Bd58bfa",
                FactoryBase201907: "0x8650B271F7cC565aa604F9f98Aa1A5B723B5b2f3",
                FactoryAdjustable201907: "0xb887D5B504028f88e21dfC042648C379AF3f1F20",
                ZkAsset: "0xB752c0a21553abA0BCd68f6B4e32E44c4b8B657e"
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
/*
| AZTEC Contracts ===============================================================|
| ACE                               | 0x65C500c4567C872D0101686E2e78ACE5218ad524 |
| JoinSplitFluid                    | 0x392E58728862AE06C70ab81f78Bf05533310Dec3 |
| Swap                              | 0x8cf8A513694fAfE644De43AA21e2987fBd2dd83B |
| Dividend                          | 0xB82D20BFF14D11DE19DEA6863Db080ce0Af58856 |
| PrivateRange                      | 0x5915ec5C3875c738376c2152A5EA04E02d592B3f |
| JoinSplit                         | 0x8a89362e1C50DEC278bbDf0B5d2399a0740Bb550 |
| BaseFactory                       | 0x40aA6BaC464944F062E68Fd6Da2Da08F473b42Dd |
| AdjustableFactory                 | 0x63Db624F6Eb4B50a081c9B89222Bd13B96609193 |
| ZkAsset                           | 0x9Fdfe0f1689991cCb834793BbF06Bb7613f52f78 |
|===================================|============================================|
*/
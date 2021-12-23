
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
    testnet : {
        contracts: {
            smartWallet: {
                template: "0x20b87390b030717Af53aFB09C98D86e1EB74C11f",
                factory: "0x4b1bFCd7ee2c457c35DE6351D90072C3893D50a5"
            },
            erc20: {
                DOC: "0xC591D6b9238444A2ec22c8F1b54Eb995Ec2D4121",
                RDOC: "0xC591D6b9238444A2ec22c8F1b54Eb995Ec2D4121"
            },
            aztec: {
                ACE: "0x65C500c4567C872D0101686E2e78ACE5218ad524",
                JoinSplitFluid: "0x392E58728862AE06C70ab81f78Bf05533310Dec3",
                Swap: "0x8cf8A513694fAfE644De43AA21e2987fBd2dd83B",
                Dividend: "0xB82D20BFF14D11DE19DEA6863Db080ce0Af58856",
                PrivateRange: "0x5915ec5C3875c738376c2152A5EA04E02d592B3f",
                JoinSplit: "0x8a89362e1C50DEC278bbDf0B5d2399a0740Bb550",
                FactoryBase201907: "0x40aA6BaC464944F062E68Fd6Da2Da08F473b42Dd",
                FactoryAdjustable201907: "0x63Db624F6Eb4B50a081c9B89222Bd13B96609193",
                ZkAsset: "0x9Fdfe0f1689991cCb834793BbF06Bb7613f52f78"
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
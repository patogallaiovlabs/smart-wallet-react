
/*
DOC:
- TESTNET: 0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0
*/
const appconfig = {
    regtest : {
        contracts: {
            smartWallet: {
                template: "0xCf11804B67222d4031B180EB70E3ef68318E73F5",
                factory: "0x6fA7b244F8c94FE5750B09D3c8FeDF6115fD747e"
            },
            erc20: {
                DOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0",
                RDOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0"
            },
            aztec: {
                ACE: "0xe2a85b7Cc30237aBFAaB2ea8bAE98978446Ae040",
                JoinSplitFluid: "0x384b3f33C97c1c83116d5de3eff0cecb96cE840f",
                Swap: "0xD5e314e9D43fd3eb687416d361Bdf399AA244D6F",
                Dividend: "0xD08d3e653AC1B14a4c53bfD11d544944f6457FBf",
                PrivateRange: "0xB91cC6cBA178a09B23430A1B402ff0F6726984B7",
                JoinSplit: "0x72dD04c78952D3E13E354F8bAE2a8b8302Cf3334",
                FactoryBase201907: "0x8001DF63fC16692d7E9C589Fc172d3afB8629BCe",
                FactoryAdjustable201907: "0xC30591B73fb0c1B97EdE564560B417AA9Df32d85",
                ZkAsset: "0xe94A57B896720F0e77d7AB7c573A9ecC886F093a"
            }
        }
    },
    
    testnet : {
        contracts: {
            smartWallet: {
                template: "0xCf11804B67222d4031B180EB70E3ef68318E73F5",
                factory: "0x6fA7b244F8c94FE5750B09D3c8FeDF6115fD747e"
            },
            erc20: {
                DOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0",
                RDOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0"
            },
            aztec: {
                ACE: "0xe2a85b7Cc30237aBFAaB2ea8bAE98978446Ae040",
                JoinSplitFluid: "0x384b3f33C97c1c83116d5de3eff0cecb96cE840f",
                Swap: "0xD5e314e9D43fd3eb687416d361Bdf399AA244D6F",
                Dividend: "0xD08d3e653AC1B14a4c53bfD11d544944f6457FBf",
                PrivateRange: "0xB91cC6cBA178a09B23430A1B402ff0F6726984B7",
                JoinSplit: "0x72dD04c78952D3E13E354F8bAE2a8b8302Cf3334",
                FactoryBase201907: "0x8001DF63fC16692d7E9C589Fc172d3afB8629BCe",
                FactoryAdjustable201907: "0xC30591B73fb0c1B97EdE564560B417AA9Df32d85",
                ZkAsset: "0xe94A57B896720F0e77d7AB7c573A9ecC886F093a"
            }
        }
    },
    mainnet : {
        contracts: {
            smartWallet: {
                template: "0xCf11804B67222d4031B180EB70E3ef68318E73F5",
                factory: "0x6fA7b244F8c94FE5750B09D3c8FeDF6115fD747e"
            },
            erc20: {
                DOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0",
                RDOC: "0xCB46c0ddc60D18eFEB0E586C17Af6ea36452Dae0"
            },
            aztec: {
                ACE: "0x848FD4E195dBb156F245E3E5FaB5b36706776Ba5",
                JoinSplitFluid: "0x13cF0a53b6102b518e8b547d5E50b38C1b089E08",
                Swap: "0xc3e75147D582fFc126590C537cEe894180aAcDDC",
                Dividend: "0xb2e09ab18a1792025D8505B5722E527d5e90c8e7",
                PrivateRange: "0x0Aa058aD63E36bC2f98806f2D638353AE89C3634",
                JoinSplit: "0x7aeCf73CE97Bb46193B1bD1c8E9a6dA2EE2101c9",
                FactoryBase201907: "0xc346A5F12388D254584C2bddd34816645D904F1d",
                FactoryAdjustable201907: "0x3056D0B2379c86e6Be6771C34f39F5AFfB65D855",
                ZkAsset: "0x3AFc8E02d35F6c64B24bAAD5B4097dcB49A488aE"
            }
        }
    }
};

export default appconfig;
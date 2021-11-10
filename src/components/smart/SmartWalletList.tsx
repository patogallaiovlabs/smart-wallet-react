import EtherClient from '../../client/EtherClient';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import SmartWalletClient from '../../client/SmartWalletClient';
import Address from '../account/Address';

interface ISmart {
  address:string;
  deployed:boolean;
}

export default function SmartWalletList() {
    
    let client = EtherClient.instance();

    const [address, setAddress] = useState<string>();
    const [smarts, setSmarts] = useState<ISmart[]>();
    const [nonce, setNonce] = useState<number>();
    
    const init = async ()=>{
        let tempNonce = (await SmartWalletClient.nonce()).toNumber();  
        setNonce(tempNonce);
        console.log('tempNonce', tempNonce);
        let addressTemp = await client.getAddress();
        setAddress(addressTemp);
        let temp:ISmart[] = [];
        for (let i = 0;i<tempNonce + 1;i++) {
          let tempAddress = await SmartWalletClient.getAddress(i)  
          let tempDeployed = await SmartWalletClient.isSmartWalletDeployed(tempAddress)  
          temp.push({
            address: tempAddress,
            deployed: tempDeployed
          });
        }
        setSmarts(temp);
        console.log('addresses', temp);
    }
    useEffect(()=>{
        init();
    }, []);


    const deploy = (i: number) => {
      SmartWalletClient.deploy(i);
    }

    const test = () => {
      SmartWalletClient.test();
    }

    return (
        
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            marginTop: '49px'
          }}>EOA: <Address value={address}/> Nonce: {nonce}
        {
          smarts?.map((a, i)=>{
            return <Box margin="10px" key={i}>
              <div> Wallet {i}: <Address value={a.address}/> </div> 
              <div>{(!a.deployed && 
                  <Button variant="contained"
                    onClick={() => deploy(i)}
                  >Deploy</Button>
              )}
              
              <Button variant="contained"
                    onClick={() => test()}
                  >Test</Button>
              </div>
            </Box>
          })
        }
        </Box>
    );
}


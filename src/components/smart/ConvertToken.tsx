import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField } from '@mui/material';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';
import AztecClient from '../../client/aztec/AztecClient';
import { TransactionResponse } from '@ethersproject/providers';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
}

export default function ConvertToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [amount, setAmount] = useState<string>('1');
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);


    const convertDoc = () => {
      let amountFormatted:number = amount?+amount:0; // ethers.utils.parseEther(amount??'0');
      if (wallet) {
        wallet.convertDocs(amountFormatted);
      }
    }

    return (
        <div>
            {(!loading && wallet && 
                <FormControl>
                    <TextField label="Amount $" variant="standard" margin="normal" name="dataInput" value={amount} onChange={evt => setAmount(evt.target.value)}></TextField>
                    <Button variant="contained"
                            onClick={() => convertDoc()}
                            >Convert DOC</Button>
                </FormControl>
            )}

            {/** LOADING */}
            {(loading && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ m: 1, position: 'relative' }}>
                    <CircularProgress color="inherit" placeholder="Loading..." />
                  </Box>
                </Box>
            )}
        </div>
    );
}


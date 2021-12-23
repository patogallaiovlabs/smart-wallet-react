import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField } from '@mui/material';
import WalletClient from '../../client/WalletClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
}

export default function ConvertToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [wallet, setWallet] = useState<WalletClient>();
    const [amount, setAmount] = useState<string>('1');
    const [error, setError] = useState<any>();
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
      }

    useEffect(()=>{
        init();
    }, []);


    const convertDoc = async () => {
      let amountFormatted:number = amount?+amount:0; // ethers.utils.parseEther(amount??'0');
      if (wallet) {
        setLoading(true);
        try {
          await wallet.convertDocs(amountFormatted);
        } catch (e) {
          console.warn(e);
          setError(e);
        }finally{
          setLoading(false);
        }
      }
    }

    return (
        <div>
            <h3>Convert DOC to ZkDOC</h3>
            {(wallet && 
                <FormControl>
                    <TextField 
                      label="Amount DOC$" 
                      variant="standard" 
                      margin="normal" 
                      name="dataInput" 
                      value={amount} 
                      onChange={evt => setAmount(evt.target.value)} 
                      inputProps={{min: 0, style: { textAlign: 'right' }}}
                    />
                    <Button variant="contained"
                            onClick={() => convertDoc()}
                            >Convert</Button>
                </FormControl>
            )}

            {/** LOADING */}
            {(loading && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ m: 1, position: 'relative' }}>
                    <div>Converting {amount} DOCs to ZkDOCs...</div>
                    <div>This could take several minutes, please don't close the window.</div>
                    <CircularProgress color="inherit" placeholder="Loading..." />

                  </Box>
                </Box>
            )}
            {(error && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {error.message}
                </Box>
            )}
        </div>
    );
}


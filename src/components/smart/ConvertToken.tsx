import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField, ButtonGroup, InputAdornment } from '@mui/material';
import WalletClient from '../../client/WalletClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  onUpdate: any;
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
      let amountFormatted:number = (amount?+amount:0) * 10; // ethers.utils.parseEther(amount??'0');
      if (wallet) {
        setLoading(true);
        try {
          await wallet.convertDocs(amountFormatted);
        } catch (e) {
          console.warn(e);
          setError(e);
        }finally{
          setTimeout(()=>{
            setLoading(false);
            prop.onUpdate();
          }, 5000);
        }
      }
    }

    return (
        <div>
            <h3>Convert Tokens to ZkTokens</h3>
            {(wallet && 
                <FormControl>
                    <TextField 
                      label="Amount" 
                      variant="standard" 
                      margin="normal" 
                      name="dataInput" 
                      value={amount} 
                      onChange={(e) => setAmount(parseFloat(e.target.value).toFixed(1))}
                      inputProps={{min: 0, style: { textAlign: 'right' }}}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    />
                    <ButtonGroup>
                      <Button variant="contained"
                            onClick={() => convertDoc()}
                            >Convert</Button>
                    </ButtonGroup>
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


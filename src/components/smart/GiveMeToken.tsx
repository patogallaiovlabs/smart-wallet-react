import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, ButtonGroup, InputAdornment } from '@mui/material';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  onUpdate:any;
}

export default function GiveMeToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [sendTo, setSendTo] = useState<string>();
    const [amount, setAmount] = useState<string>('1');
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setSendTo(w.address);
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);


    const sendDoc = async () => {
      setLoading(true);
      const doc = ERC20Client.getDOC();
      let amountFormatted = ethers.utils.parseEther(amount??'0');
      let result = await wallet?.execute(doc.contract.address, doc.encodeGiveMeTokens(sendTo, amountFormatted));
      if(result) {
        await result.wait();
        prop.onUpdate();
      }
      setLoading(false);
    }

    const onSendTo = (evt:any) => {
      setSendTo(evt.target.value);
    }

    return (
        <div>
            {(!loading && wallet && 
              <div> 
                <h3>Gimme Tokens</h3>
                <FormControl>
                    <InputLabel id="toLabel">To</InputLabel>
                    <Select 
                        labelId="toLabel"
                        id="demo-simple-select"
                        value={sendTo}
                        label="To"
                        onChange={onSendTo}
                    >
                        {prop.allwallets?.map((item:WalletClient,i)=> { 
                          return <MenuItem key={i} value={item.address}>Wallet {item.getIndex()<0?'(EOA)':item?.getIndex() + 1} - {item.address.substring(0, 5)}</MenuItem>;
                        })}
                    </Select>
                    <TextField label="Amount" variant="standard" margin="normal" name="dataInput" value={amount} 
                      onChange={(e) => setAmount(parseFloat(e.target.value).toFixed(1))}
                      inputProps={{min: 0, style: { textAlign: 'right' }}}
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                    ></TextField>
                    <ButtonGroup>
                      <Button variant="contained"
                              onClick={() => sendDoc()}
                              >Send</Button>
                    </ButtonGroup>
                </FormControl>
              </div> 
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


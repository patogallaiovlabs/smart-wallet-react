import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, ButtonGroup } from '@mui/material';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
}

export default function SendToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [sendTo, setSendTo] = useState<string>();
    const [amount, setAmount] = useState<string>();
    
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


    const sendDoc = () => {
      const doc = ERC20Client.getDOC();
      let amountFormatted = ethers.utils.parseEther(amount??'0');
      wallet?.execute(doc.contract.address, doc.encodeTransfer(sendTo, amountFormatted));
      console.log('send');
    }

    const onSendTo = (evt:any) => {
      setSendTo(evt.target.value);
    }

    return (
        <div>
            {(!loading && wallet && 
              <div> 
              <h3>Send DOCs</h3>
                <FormControl>
                    <Select 
                        labelId="toLabel"
                        id="demo-simple-select"
                        value={sendTo}
                        label="To"
                        onChange={onSendTo}
                    >
                        {prop.allwallets?.map((item:WalletClient,i)=>
                          <MenuItem key={i} value={item.address}>Wallet {item.getIndex()<0?'(EOA)':item?.getIndex() + 1} - {item.address.substring(0, 5)}</MenuItem>
                        )}
                    </Select>
                    <TextField label="$" variant="standard" margin="normal" name="dataInput" value={amount} onChange={evt => setAmount(evt.target.value)}></TextField>
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


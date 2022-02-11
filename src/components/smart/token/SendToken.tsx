import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, ButtonGroup, InputAdornment, IconButton } from '@mui/material';
import { ethers } from 'ethers';
import ERC20Client from 'src/client/wallet/ERC20Client';
import WalletClient from 'src/client/wallet/WalletClient';
import Tooltip from '@mui/material/Tooltip';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  onUpdate:any;
}

export default function SendToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [sendTo, setSendTo] = useState<string>();
    const [amount, setAmount] = useState<string>('1');
    const [defaultPrivate, setDefaultPrivate] = useState<boolean>();
    
    useEffect(()=>{
      const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setSendTo(w.address);
        setLoading(false);
        setDefaultPrivate(w.defaultPrivate)
      }
      init();
    }, [prop.wallet]);


    const sendDoc = async () => {
      setLoading(true);
      const doc = ERC20Client.getDOC();
      let amountFormatted = ethers.utils.parseEther(amount??'0');
      let result = await wallet?.execute(doc.contract.address, doc.encodeTransfer(sendTo, amountFormatted));
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
                <h3>
                  <Tooltip title={defaultPrivate ? 'Private Mode' : 'Public Mode'}>
                    <IconButton onClick={() => {
                      wallet.defaultPrivate = !defaultPrivate;
                      setDefaultPrivate(!defaultPrivate);
                    }
                  }>
                      {(wallet.defaultPrivate && <VisibilityOffIcon/>)}
                      {(!wallet.defaultPrivate && <VisibilityIcon/>)}
                    </IconButton>
                  </Tooltip> Send Tokens</h3>
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


import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, ButtonGroup } from '@mui/material';
import WalletClient from '../../../client/WalletClient';
import Note from '../../../client/aztec/note';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  note:Note;
}

export default function SendNote(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [sendTo, setSendTo] = useState<string>('');
    
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


    const send = async () => {
      setLoading(true);
      try {
        if(wallet) {
          const txPending = await wallet?.sendNote(prop.note, sendTo);
          const result = await txPending?.wait();
          console.log('result send note', result);
        }
      }catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    const onSendTo = (evt:any) => {
      setSendTo(evt.target.value);
    }

    return (
        <div>
            {(!loading && wallet && 
              <div> 
                <FormControl>
                    <InputLabel id="toLabel" >To</InputLabel>
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
                    <Button variant="contained"
                            onClick={() => send()}
                            >Send</Button>
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


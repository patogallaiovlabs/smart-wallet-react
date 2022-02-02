import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, ButtonGroup, Dialog, Paper, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import WalletClient from '../../../client/wallet/WalletClient';
import Note from '../../../client/aztec/note';
import { useQuery } from '@apollo/client';
import GraphClient from '../../../client/graph/GraphClient';
import Loading from '../../Loading';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  note:Note;
  onUpdate:any;
  open:boolean;
  onClose:any;
}

    
export default function SendNote(prop:PropTypes) {
    const variables = {
      id: prop.wallet.address.toLowerCase()
    };
    const { loading:loadingQ, error, data, refetch} = useQuery(GraphClient.LOAD_QUERY(GraphClient.USER_QUERY), {variables});

    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [sendTo, setSendTo] = useState<string>('');
    const [sendToOther, setSendToOther] = useState<string>('');
    const [sendToOtherPK, setSendToOtherPK] = useState<string>('');
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setSendTo(w.address);
        setLoading(false);
        setSendToOtherPK(data?.user?.publicKey ? data.user.publicKey : '');
      }


    const send = async () => {
      setLoading(true);
      try {
        if(wallet) {
          let destination = sendTo == 'other' ? sendToOther : sendTo;
          const txPending = await wallet?.sendNote(prop.note, destination, sendToOtherPK);
          const result = await txPending?.wait();
          console.log('result send note', result);
        }
      }catch (e) {
        console.log(e);
      } finally {
        setTimeout(()=>{
          setLoading(false);
          prop.onUpdate();
        }, 10000);
      }
    }

    const onClose = () => {
      prop.onClose();
    }

    const onSendTo = async (evt:any) => {
      setSendTo(evt.target.value);
      if(evt.target.value != 'other') {
        variables.id = evt.target.value.toLowerCase();
        let result = await refetch(variables);
        setSendToOtherPK(result.data?.user?.publicKey ? result.data.user.publicKey : '');
      } else {
        setSendToOther('');
        setSendToOtherPK('');
      }
    }

    const onSendToOther = async (evt:any) => {
      setSendToOther(evt.target.value);
      variables.id = evt.target.value.toLowerCase();
      let result = await refetch(variables);
      setSendToOtherPK(result.data?.user?.publicKey ? result.data.user.publicKey : '');
    }

    useEffect(()=>{
        init();
    }, []);

    if(loadingQ) { return <Loading></Loading>}


    return (
          <Dialog open={prop.open} onClose={onClose} fullWidth>
            <DialogTitle color='black' >Send Note</DialogTitle>
            {(!loading && wallet && 
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                }}
              >
                <DialogContent>
                  <DialogContentText>Provide an address and an encryption key.</DialogContentText>
                  <FormControl margin="dense" fullWidth>
                    <InputLabel id="toLabel" >To</InputLabel>
                    <Select 
                        size="small"
                        labelId="toLabel"
                        id="demo-simple-select"
                        value={sendTo}
                        label="To"
                        onChange={onSendTo}
                        fullWidth
                      >
                          {prop.allwallets?.map((item:WalletClient,i)=>
                            <MenuItem key={i} value={item.address}>Wallet {item.getIndex()<0?'(EOA)':item?.getIndex() + 1} - {item.address}</MenuItem>
                          )}
                          <MenuItem key={'i-1'} value={'other'}>Other Address</MenuItem>
                      </Select>
                      
                      {(sendTo == 'other' && 
                          <TextField  label="Address" 
                                      value={sendToOther} 
                                      onChange={onSendToOther} 
                                      onPaste={onSendToOther}
                                      fullWidth
                                      variant="standard">
                          </TextField>
                      )}
                      <TextField  label="Encryption Key" 
                                  value={sendToOtherPK} 
                                  onChange={(evt) => setSendToOtherPK(evt.target.value)} 
                                  fullWidth
                                  variant="standard">
                      </TextField>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                  <Button variant="contained"
                          disabled={!prop?.note?.k}
                          onClick={() => send()}
                          >Send</Button>
                  <Button variant='text'
                          onClick={() => onClose()}
                          >Close</Button>
                </DialogActions>
              </Paper> 
            )}

            {/** LOADING */}
            {(loading && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ m: 1, position: 'relative' }}>
                    <CircularProgress color="inherit" placeholder="Loading..." />
                  </Box>
                </Box>
            )}
        </Dialog>
    );
}


import { useEffect, useState } from 'react';
import { Box, Button, FormControl, TextField, ButtonGroup, InputAdornment, Stepper, Step, StepLabel, Dialog, DialogTitle, Paper, Typography, DialogActions, LinearProgress, StepContent, InputLabel, Select, MenuItem, IconButton } from '@mui/material';
import WalletClient from 'src/client/wallet/WalletClient';
import { useQuery } from '@apollo/client';
import GraphClient from 'src/client/graph/GraphClient';
import Tooltip from '@mui/material/Tooltip';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import ERC20Client from 'src/client/wallet/ERC20Client';
import { ethers } from 'ethers';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  onUpdate: any;
  sendEnabled?: boolean;
}
const stepsSendPublic = ['Select Receiver', 'Send Token'];
const stepsSendPrivate = ['Select Receiver', 'Approve ERC20', 'Aztec Public Approve', 'Confidential Transfer', 'Send Note'];
const stepsConvert = ['Approve ERC20', 'Aztec Public Approve', 'Confidential Transfer'];

export default function ConvertAndSendToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [wallet, setWallet] = useState<WalletClient>();
    const [amount, setAmount] = useState<string>('1');
    const [error, setError] = useState<any>();
    const [activeStep, setActiveStep] = useState(0);
    const [sendTo, setSendTo] = useState<string>('');
    const [sendToOther, setSendToOther] = useState<string>('');
    const [sendToOtherPK, setSendToOtherPK] = useState<string>('');
    const [sendToOtherEK, setSendToOtherEK] = useState<string>('');
    const [steps, setSteps] = useState<string[]>(['']);
    
    const variables = {
      id: prop.wallet.address.toLowerCase()
    };
    const { loading:loadingQ, error:errorQ, data, refetch} = useQuery(GraphClient.LOAD_QUERY(GraphClient.USER_QUERY), {variables});


    const updateSteps = () => {
      if (prop.wallet) {
        prop.wallet.defaultPrivate = !prop.wallet.defaultPrivate;
      }
      setSteps(prop.sendEnabled ? (prop.wallet.defaultPrivate ? stepsSendPrivate : stepsSendPublic) : stepsConvert);
    }

    const init = async () => {
      //init 
      const w = prop.wallet;
      setWallet(w);
      setError(null);
      setSteps(prop.sendEnabled ? (prop.wallet.defaultPrivate ? stepsSendPrivate : stepsSendPublic) : stepsConvert);
    }

    useEffect(()=>{
        init();
    }, []);


    const convertDoc = async (finish:boolean = true) => {
      let amountFormatted:number = (amount?+amount:0) * 10; // ethers.utils.parseEther(amount??'0');
      if (wallet) {
        setOpen(true);
        setLoading(true);
        try {
          let result = await wallet.erc20Approve(amountFormatted);
          setActiveStep((current) => current + 1);
          const proof = await wallet.createDepositProof(amountFormatted);
          result = await wallet.aztecPublicApprove(amountFormatted, proof);
          setActiveStep((current) => current + 1);
          result = await wallet.confidentialTransfer(proof);
          setActiveStep((current) => current + 1);
          if(finish) {
            success();
          }
          return proof.outputNotes;
        } catch (e) {
          console.warn('error convertDoc', e);
          setError(e);
          setLoading(false);
          return false;
        } 
      }
    };

    const success = async () => {
      setLoading(false);
      setTimeout(()=>{
        setOpen(false);
        setActiveStep(0);
        prop.onUpdate();
      }, 3000);
    }

    const startConvertAndSend = async () => {
      setOpen(true);
    };

    const convertAndSend = async () => {
      setActiveStep((current) => current + 1);
      setOpen(true);
      const outputNotes = await convertDoc(false);
      if (outputNotes) {
        setLoading(true);
        console.log('outputNotes', outputNotes);
        let destination = sendTo === 'other' ? sendToOther : sendTo;
        const txPending = await wallet?.sendNotes(outputNotes, destination, sendToOtherPK, sendToOtherEK );
        const result = await txPending?.wait();
        setActiveStep((current) => current + 1);
        console.log('result send note', result);
        success();
      }
    };

    const onClose = async (update:boolean) => {
      setLoading(false);
      setOpen(false);
      setError(null);
      if(update) {
        prop.onUpdate();
      }
    };

    const onSendTo = async (evt:any) => {
      setSendTo(evt.target.value);
      if(evt.target.value !== 'other') {
        variables.id = evt.target.value.toLowerCase();
        let result = await refetch(variables);
        setSendToOtherEK(result.data?.user?.encryptionKey ? result.data.user.encryptionKey : '');
        setSendToOtherPK(result.data?.user?.publicKey ? result.data.user.publicKey : '');
      } else {
        setSendToOther('');
        setSendToOtherEK('');
        setSendToOtherPK('');
      }
    }

    const onSendToOther = async (evt:any) => {
      setSendToOther(evt.target.value);
      variables.id = evt.target.value.toLowerCase();
      let result = await refetch(variables);
      setSendToOtherEK(result.data?.user?.encryptionKey ? result.data.user.encryptionKey : '');
      setSendToOtherPK(result.data?.user?.publicKey ? result.data.user.publicKey : '');
    }



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

    return (
        <div>
              {(prop.sendEnabled && <div> 

                <h3> 
                  Send Tokens
                </h3>
                Privacy mode:
                <Tooltip title={prop.wallet?.defaultPrivate ? 'Private Mode' : 'Public Mode'}>
                  <IconButton color={prop.wallet?.defaultPrivate ?  'error' : 'success'} onClick={updateSteps}>
                    {(prop.wallet?.defaultPrivate && <VisibilityOffIcon/>)}
                    {(!prop.wallet?.defaultPrivate && <VisibilityIcon/>)}
                  </IconButton>
                </Tooltip> 
            </div>
              
              )} 
              {(!prop.sendEnabled && <h3> 
                Convert Tokens
              </h3>)} 
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
                    {(!prop.sendEnabled &&
                      <Button variant="contained"
                            onClick={() => convertDoc()}
                            >Convert</Button>
                    )}
                    {(prop.sendEnabled &&
                      <Button variant="contained"
                            onClick={() => startConvertAndSend()}
                            >Send 
                      </Button>
                    )}
                    </ButtonGroup>
                </FormControl>
            )}

            {/** POPUP */}
              <Dialog open={open} onClose={() => onClose(true)} fullWidth >
                <DialogTitle color='black' >{prop.sendEnabled ? 'Send' : 'Convert'} Tokens</DialogTitle>
                <Paper>
                  <Box sx={{ m: 1, position: 'relative' }}>
                      <ul><li>Amount: $ {amount}</li></ul>
                  </Box>
                  <Box sx={{ m: 1, position: 'relative' }}>

              
                    <Stepper activeStep={activeStep} orientation='vertical'>
                      {steps.map((label, index) => {
                        const stepProps: { completed?: boolean } = {};
                        const labelProps: {
                          optional?: React.ReactNode;
                          error?: boolean;
                        } = {};
                        if (error && activeStep === index) {
                          labelProps.optional = (
                            <Typography variant="caption" color="error">
                              {error.message}
                            </Typography>
                          );
                          labelProps.error = true;
                        }
                        return (
                          <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            {(prop.wallet?.defaultPrivate && prop.sendEnabled && activeStep === 0 && 
                              <StepContent>
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
                                  
                                  {(sendTo === 'other' && 
                                      <TextField  label="Address" 
                                                  value={sendToOther} 
                                                  onChange={onSendToOther} 
                                                  onPaste={onSendToOther}
                                                  fullWidth
                                                  variant="standard">
                                      </TextField>
                                  )}
                                  <TextField  label="Encryption Key" 
                                              value={sendToOtherEK} 
                                              onChange={(evt) => setSendToOtherEK(evt.target.value)} 
                                              fullWidth
                                              variant="standard">
                                  </TextField>
                                  <TextField  label="Public Key" 
                                              value={sendToOtherPK} 
                                              onChange={(evt) => setSendToOtherPK(evt.target.value)} 
                                              fullWidth
                                              variant="standard">
                                  </TextField>
                                  <ButtonGroup>
                                      <Button variant="contained"
                                            onClick={() => convertAndSend()}
                                            >Next</Button>
                                  </ButtonGroup>
                              </StepContent>
                              )}
                              {(!prop.wallet?.defaultPrivate && prop.sendEnabled && activeStep === 0 && 
                              <StepContent>
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
                                  
                                  {(sendTo === 'other' && 
                                      <TextField  label="Address" 
                                                  value={sendToOther} 
                                                  onChange={onSendToOther} 
                                                  onPaste={onSendToOther}
                                                  fullWidth
                                                  variant="standard">
                                      </TextField>
                                  )}
                                  <ButtonGroup>
                                      <Button variant="contained"
                                            onClick={() => sendDoc()}
                                            >Send</Button>
                                  </ButtonGroup>
                              </StepContent>
                              )}
                          </Step>
                        );
                      })}
                    </Stepper>
                    {(loading && 
                      <Paper 
                        sx={{
                          p: 2,
                          m: 1, 
                          flexDirection: 'column',
                          height: '100px',
                        }}>
                        <div>Converting {amount} DOCs to ZkDOCs...</div>
                        <div>This could take several minutes, please don't close the window.</div>
                        <LinearProgress color="warning" placeholder="Loading..." />
                      </Paper>
                    )}
                  </Box>
                </Paper>
                {(error && 
                    <DialogActions>
                      <Button variant='text'
                              onClick={() => onClose(false)}
                              >Close</Button>
                    </DialogActions>
                )}
              </Dialog>
            </div>
        );
}

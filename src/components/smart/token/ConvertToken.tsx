import { useEffect, useState } from 'react';
import { Box, Button, FormControl, TextField, ButtonGroup, InputAdornment, Stepper, Step, StepLabel, Dialog, DialogTitle, Paper, Typography, DialogActions, LinearProgress } from '@mui/material';
import WalletClient from 'src/client/wallet/WalletClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
  onUpdate: any;
}

const steps = ['Approve ERC20', 'Aztec Public Approve', 'Confidential Transfer'];

export default function ConvertToken(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [wallet, setWallet] = useState<WalletClient>();
    const [amount, setAmount] = useState<string>('1');
    const [error, setError] = useState<any>();
    const [activeStep, setActiveStep] = useState(0);
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setError(null);
      }

    useEffect(()=>{
        init();
    }, []);


    const convertDoc = async () => {
      let amountFormatted:number = (amount?+amount:0) * 10; // ethers.utils.parseEther(amount??'0');
      if (wallet) {
        setOpen(true);
        setLoading(true);
        try {
          let result = await wallet.erc20Approve(amountFormatted);
          setActiveStep(1);
          const proof = await wallet.createDepositProof(amountFormatted);
          result = await wallet.aztecPublicApprove(amountFormatted, proof);
          setActiveStep(2);
          result = await wallet.confidentialTransfer(proof);
          setActiveStep(3);
          setTimeout(()=>{
            setOpen(false);
            setActiveStep(0);
            prop.onUpdate();
          }, 5000);
        } catch (e) {
          console.warn('error convertDoc', e);
          setError(e);
        } finally {
          setLoading(false);
        }
      }
    }

    const onClose = async (update:boolean) => {
      setLoading(false);
      setOpen(false);
      setError(null);
      if(update) {
        prop.onUpdate();
      }
    };

    return (
        <div>
            <h3>Convert Tokens</h3>
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

            {/** POPUP */}
              <Dialog open={open} onClose={() => onClose(true)} fullWidth >
                <DialogTitle color='black' >Converting Tokens</DialogTitle>
                <Paper>
                  <Box sx={{ m: 1, position: 'relative' }}>

              
                    <Stepper activeStep={activeStep}>
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

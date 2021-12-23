import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem, FormGroup } from '@mui/material';
import WalletClient from '../../../client/WalletClient';
import contracts from '../../../client/contracts';

interface PropTypes {
  wallet:WalletClient;
  allwallets?:WalletClient[];
}

export default function Aztec(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [address, setAddress] = useState<string>('0xba1db4a86728848a1650041091aa3179240e6857');
    const [call, setCall] = useState<any>();
    const [contract, setContract] = useState<any>(null);
    const [parameters, setParameters] = useState<string[]>(['', '', '', '', '']);
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);


    const send = async () => {
      setLoading(true);
      try {
        let params = parameters.filter(p => p != '');
        const pending = await wallet?.executeRaw(contract.abi, address, call.name, params);
        const result = await pending?.wait();
        console.log('result send note', result);
      }catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }

    const onContract = async (evt:any) => {
      setContract(evt.target.value);
    }

    const onCall = async (evt:any) => {
      setCall(evt.target.value);
    }

    return (
        <div>
            {(!loading && wallet && 
              <div> 
                <FormControl>
                  <FormGroup>
                    <TextField 
                        label="Address" 
                        variant="standard" 
                        margin="normal" 
                        name="dataInput" 
                        value={address} 
                        onChange={evt => setAddress(evt.target.value)}
                    />
                  </FormGroup>
                    <Select 
                        id="contract-select"
                        value={contract}
                        label="To"
                        onChange={onContract}
                    >
                        {contracts?.map((item:any,i)=>
                          <MenuItem key={i} value={item}>{item.contractName}</MenuItem>
                        )}
                    </Select>

                    {(contract && 
                      <Select 
                          id="function-select"
                          value={call}
                          label="To"
                          onChange={onCall}>
                          {contract?.abi.map((item:any,i:number)=>
                            <MenuItem key={i} value={item}>{item.name}</MenuItem>
                          )}
                      </Select>
                    )}

                    {(call && 
                      <FormGroup>
                      {call?.inputs.map((item:any,i:number)=>
                        <TextField 
                          key={i}
                          label={item.name} 
                          variant="standard" 
                          margin="normal" 
                          name="dataInput"
                          value={parameters[i]}
                          onChange={evt => setParameters(p => {
                            p[i]=evt.target.value;
                            return p;
                          })}
                        /> 
                      )}
                      </FormGroup>
                    )}
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


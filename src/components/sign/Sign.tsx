import { useState, useEffect } from 'react';
import { Grid, Button, ButtonGroup, Container, Paper, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import EtherClient from '../../client/EtherClient';
import { ethers } from 'ethers';

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const msgParams = {
  domain: {
    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    chainId: 31,
    // Give a user friendly name to the specific contract you are signing for.
    name: 'Ether Mail',
    // Just let's you know the latest version. Definitely make sure the field name is correct.
    version: '1',
  },

  // Defining the message signing data content.
  message: {
    /*
     - Anything you want. Just a JSON Blob that encodes the data you want to send
     - No required fields
     - This is DApp Specific
     - Be as explicit as possible when building out the message schema.
    */
    contents: 'Hello Team!',
    from: 'Diego',
    to: 'Cesar',
  },
  // Refers to the keys of the *types* object below.
  primaryType: 'Mail',
  types: {
    // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
    ],
    // Refer to PrimaryType
    Mail: [
      { name: 'from', type: 'string' },
      { name: 'to', type: 'string' },
      { name: 'contents', type: 'string' },
    ],
  },
};

let account: string = '';

export default function Sign() {
   
    // signing data:
    const [signDataInput, setSignDataInput] = useState('0x20f51908C8CE306EE805abEA650C2f23a1148908')
    const [signDataResponse, setSignDataResponse] = useState('')
  
    // sign typed data:
    const [signTypedDataInput, setSignTypedDataInput] = useState('')
    const [signTypedDataResponse, setSignTypedDataResponse] = useState('')
    const [verify, setVerify] = useState('')
    const [recover, setRecover] = useState('')
  
    const client = EtherClient.instance();
    const provider = client.getProvider();
    const signer = provider.getSigner();

    const init = async () => {
      account = await client.getAddress();
    }
    useEffect(() => { init() },[]);

    // Handle the requests to the provider
    const providerRPC = (p:any, args:any) => p.request(args);
  
    // Sign typed data
    const handleSignTypedData = (value:any) => {
      setSignTypedDataResponse('loading...')
      msgParams.message.contents = value;
  
      providerRPC(    
        provider.provider,
          {
            method: 'eth_signTypedData_v4',
            params: [ account, JSON.stringify(msgParams) ],
            from: account
          }
        )
        .then((response:any) => setSignTypedDataResponse(response))
        .catch((error:any) => setSignTypedDataResponse(`[ERROR]: ${error.message}`))
      
    }
  
    // Sign data
    const handleSignData = (value:any) => {
      setSignDataResponse('loading...')

      let hash = ethers.utils.hashMessage(value);
  
      providerRPC(
        provider.provider,
        {
          method: 'personal_sign',
          params: [ value, account ]
        }
      )
      .then((response:any) => {
        setSignDataResponse(response)
        console.log('signedMessage:', response);
        let v = ethers.utils.verifyMessage(value, response);
        console.log('v:', v);
        setVerify(v);
        let r = ethers.utils.recoverAddress(hash, response);
        console.log('r:', r);
        setRecover(r);
      })
      .catch((error:any) => setSignDataResponse(`[ERROR]: ${error.message}`))
    }

  
    // Sign data Ethers
    const handleSignDataEthers = async (value:any) => {
        let hash = ethers.utils.hashMessage(value);
        const signedMessage = await signer.signMessage(value)
        .catch((error:any) => setSignDataResponse(`[ERROR]: ${error.message}`))
        
        if(signedMessage) {
            setSignDataResponse(signedMessage);
            console.log('signedMessage:', signedMessage);
            let v = ethers.utils.verifyMessage(value, signedMessage);
            console.log('v:', v);
            setVerify(v);
            let r = ethers.utils.recoverAddress(hash, signedMessage);
            console.log('r:', r);
            setRecover(r);
        }
    }
    let style = {overflow: 'auto'};
    return (
        <Container >
          <Box>
            <Grid container alignItems="stretch"
                            spacing={2} >
            
                <Grid item xs={6}>
                    <Item>
                        <h3>Sign Data with personal_sign</h3>
                        <TextField label="Data" variant="standard" margin="normal" name="dataInput" value={signDataInput} onChange={evt => setSignDataInput(evt.target.value)} />
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button className="sign" onClick={() => handleSignData(signDataInput)}>Sign</Button>
                            <Button className="signEthers" onClick={() => handleSignDataEthers(signDataInput)}>Sign Ethers</Button>
                        </ButtonGroup>
                    {signDataResponse && (
                        <div>
                            <p>Response:</p>
                            <p style={style} className="response">{signDataResponse}</p>
                            <p style={style} className="response">Verify {verify}</p>
                            <p style={style} className="response">Recover {recover}</p>
                        </div>)}
                    </Item>
                </Grid>
    
                <Grid item xs={6}>
                    <Item>
                        <h3>Sign Typed Data</h3>
                        <TextField fullWidth label="Data" margin="normal" variant="standard" name="dataInput" type="text" value={signTypedDataInput} onChange={evt => setSignTypedDataInput(evt.target.value)} />
                        <Button variant="contained" className="signTypeData" onClick={() => handleSignTypedData(signTypedDataInput)}>Sign</Button>
                        {signTypedDataResponse && (
                        <div>
                            <p>Response:</p>
                            <div className="response">{signTypedDataResponse}</div>
                        </div>)}
                    </Item>
                </Grid>
            </Grid>
          </Box>
        </Container>
    );
  
}

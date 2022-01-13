import { useState, useEffect } from 'react';
import { Grid, Button, ButtonGroup, Container, Paper, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import EtherClient from '../../client/EtherClient';
import { ethers } from 'ethers';
import web3 from 'web3';
import { Bytes, concat } from "@ethersproject/bytes";
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";

const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const msgParams = {
  domain: {
    // Defining the chain aka Rinkeby testnet or Ethereum Main Net
    chainId: 33,
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

      const message: string =  web3.utils.encodePacked(
        '\x19\x00', ethers.utils.hashMessage(value)
      ) ?? '';
      console.log('message:', message);
      let hash = ethers.utils.hashMessage(value);
  
      providerRPC(
        provider.provider,
        {
          method: 'personal_sign',
          params: [ message, account ]
        }
      )
      .then((response:any) => {
        setSignDataResponse(response)
        console.log('signedMessage:', response);
        let v = ethers.utils.verifyMessage(message, response);
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
        let owner = '0x20f51908c8CE306EE805ABeA650c2F23A1148908';
        let ZERO_ADDR = '0x0000000000000000000000000000000000000000';
        let validator = '0x10a7B60014fa06D841c3cADe1762f63869C99f42';
        let index = 0;

        let message: string =  web3.utils.encodePacked(
            '\x19\x01', validator, owner, ZERO_ADDR, index
        ) ?? '';
        message = '0x1900' + message.substr(6);
        console.log('message:', message);
        let byteMsg = ethers.utils.arrayify(message);
        
        const signedMessage = await signer.signMessage(byteMsg)
        .catch((error:any) => setSignDataResponse(`[ERROR]: ${error.message}`))
        
        if(signedMessage) {
            setSignDataResponse(signedMessage);
            console.log('signedMessage:', signedMessage);
            let v = ethers.utils.verifyMessage(byteMsg, signedMessage);
            console.log('v:', v);
            setVerify(v);
            const messagePrefix = "\x19Ethereum Signed Message:\n";
            const hash = keccak256(concat([
                  toUtf8Bytes(messagePrefix),
                  toUtf8Bytes(String(message.length)),
                message
            ]));
            const message1 = toUtf8Bytes(message);
            const message2 = ethers.utils.hashMessage(byteMsg);
            console.log('hmm', hash, message2);
            let r = ethers.utils.recoverAddress(ethers.utils.hashMessage(byteMsg), signedMessage);
            console.log('r:', r);
            setRecover(r);
        }
    }
    return (
        <Container maxWidth="lg" sx={{ mt: 3, mb: 3 ,
          marginTop: '49px'}}>
          <Box>
            <Grid container alignItems="stretch"
                            spacing={2} >
            
                <Grid item xs={12} md={4} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 500,
                      overflow: 'auto',
                      whiteSpace: 'initial',
                      wordWrap: 'break-word'
                    }}
                  >
                        <h3>Sign Data with personal_sign</h3>
                        <TextField label="Data" variant="standard" margin="normal" name="dataInput" value={signDataInput} onChange={evt => setSignDataInput(evt.target.value)} />
                        <ButtonGroup variant="contained" >
                            <Button className="sign" onClick={() => handleSignData(signDataInput)}>Sign</Button>
                            <Button className="signEthers" onClick={() => handleSignDataEthers(signDataInput)}>Sign Ethers</Button>
                        </ButtonGroup>
                    {signDataResponse && (
                        <div>
                            <p className="response">Response: {signDataResponse}</p>
                            <p className="response">Verify: {verify}</p>
                            <p className="response">Recover: {recover}</p>
                        </div>)}
                  </Paper>
                </Grid>
    
                <Grid item xs={12} md={4} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 500,
                      overflow: 'auto',
                      whiteSpace: 'initial',
                      wordWrap: 'break-word'
                    }}
                  >
                        <h3>Sign Typed Data</h3>
                        <TextField fullWidth label="Data" margin="normal" variant="standard" name="dataInput" type="text" value={signTypedDataInput} onChange={evt => setSignTypedDataInput(evt.target.value)} />
                        <Button variant="contained" className="signTypeData" onClick={() => handleSignTypedData(signTypedDataInput)}>Sign</Button>
                        {signTypedDataResponse && (
                        <div>
                            <p>Response:</p>
                            <div className="response">{signTypedDataResponse}</div>
                        </div>)}
                  </Paper>
                </Grid>
            </Grid>
          </Box>
        </Container>
    );
  
}

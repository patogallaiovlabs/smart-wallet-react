import { useEffect, useState } from 'react';
import { Alert as MuiAlert, Box, Grid, CircularProgress, Container, Paper, Button, Stack, FormControlLabel, Checkbox } from '@mui/material';
import Address from '../account/Address';
import { ethers } from 'ethers';
import ERC20Client from '../../client/wallet/ERC20Client';
import WalletClient from '../../client/wallet/WalletClient';
import SendToken from './SendToken';
import ConvertToken from './ConvertToken';
import NoteHistory from './aztec/notes/NoteHistory';
import SmartWalletClient from '../../client/wallet/SmartWalletClient';
import GiveMeToken from './GiveMeToken';
import { useQuery, gql } from '@apollo/client';
import AztecClient from '../../client/aztec/AztecClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets:WalletClient[];
  onUpdate: any;
  identifier: number;
}
const userQuery = `
user($id: ID!) {
  user(id: $id) {
    id
    publicKey
  }
}
`;
const LOAD_QUERY = (query:any) => gql`
  query ${query}
`;

export default function SmartWallet(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [allwallets, setAllwallet] = useState<WalletClient[]>();
    const [docs, setDocs] = useState<string>('-');
    const [defaultPrivate, setDefaultPrivate] = useState<boolean>(true);
    const address = prop.wallet.address.toLowerCase();
    const variables = {
        id: address
    };
  
    let { loading:loadingQ, error, data, refetch} = useQuery(LOAD_QUERY(userQuery), {variables});

    const init = async () => {
        //init 
        try {
          const w = prop.wallet;
          setWallet(w);
          const aw = prop.allwallets;
          setAllwallet(aw);
          const balanceD = await ERC20Client.getDOC().balanceOf(w.address);
          let b =  ethers.utils.formatUnits(balanceD, "ether");
          let formated = parseFloat(b).toFixed(2);
          setDocs(formated.toString());
          setDefaultPrivate(prop.wallet.getDefaultPrivate());
        }catch(e) {
          console.log('error init', e);
        }finally{
          setLoading(false);
        }
      }

    const deploy = async () => {
      setLoading(true);
      try {
        const result = await SmartWalletClient.deploy(prop.identifier);
        await result?.wait();
        prop.onUpdate();
      } catch(e) {
        console.log('error deploying wallet',e);
      } finally {
        setLoading(false);
      }
    }

    const onSaveUser = async (publicKey:string = '') => {
        console.log('saving...');
        setLoading(true);
        const contract = AztecClient.getZkAsset();
        const encoded = await AztecClient.encodeSetEncryptionKey(contract, publicKey);
        const tx = await wallet?.execute(contract.address, encoded);
        await tx?.wait();
        setTimeout(()=>{
          setLoading(false);
          refetch();
        }, 1000)
    };

    const updateDefaultPrivate = async (evt:any) => {
      setDefaultPrivate(evt.target.checked);
      prop.wallet.setDefaultPrivate(evt.target.checked);
    }

    useEffect(()=>{
        init();
    }, []);

    return (
        
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        {(wallet && !wallet.isActive() && 
          <Stack spacing={2} sx={{ width: '100%', marginBottom: '20px' }}>
                <MuiAlert elevation={6} variant="filled"  severity="warning" >This wallet is not deployed yet. <Button variant="contained" size='small'
                                onClick={() => deploy()}
                              >Deploy</Button>
                </MuiAlert>
          </Stack>
        )}
        {((!data?.user || !data.user?.publicKey) && 
          <Stack spacing={2} sx={{ width: '100%', marginBottom: '20px' }}>
                <MuiAlert elevation={6} variant="filled"  severity="warning" >Encryption key not published (other users may not be able to interact with you). <Button  variant="contained"
                              onClick={() => onSaveUser(wallet?.getEncryptionPK())}>Publish</Button>
                </MuiAlert>
          </Stack>
        )}

        <Grid container spacing={2}>
            {(!loading && wallet && 
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 110,
                  }}
                >
                  <div>Address: <Address value={prop.wallet?.address} /></div>
                  <div> Tokens: $ {docs}</div>     
                  <FormControlLabel control={<Checkbox checked={defaultPrivate} onChange={updateDefaultPrivate} />} label="Default private wallets" />     
                </Paper>
              </Grid>
            )}
            {(!loading && wallet && 
                <Grid item xs={12} md={4} lg={4}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      height: 280,
                    }}
                  >
                    <GiveMeToken wallet={wallet} allwallets={allwallets} onUpdate={prop.onUpdate} />
                  </Paper>
                </Grid>
              )}
          {(!loading && wallet && 
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 280,
                  }}
                >
                  <SendToken wallet={wallet} allwallets={allwallets} onUpdate={prop.onUpdate} />
                </Paper>
              </Grid>
            )}
            {(!loading && wallet && 
              <Grid item xs={12} md={4} lg={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 280,
                  }}
                >
                  <ConvertToken wallet={wallet} allwallets={allwallets} onUpdate={prop.onUpdate}  />            
                </Paper>
              </Grid>
            )}
            {(!loading && wallet && 
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 350,
                    overflow: 'auto'
                  }}
                >
                  <NoteHistory wallet={wallet} allwallets={prop.allwallets} onUpdate={prop.onUpdate}  />
                </Paper>
              </Grid>
            )}
            

          {/** LOADING */}
          {(loading && 
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                  <CircularProgress color="inherit" placeholder="Loading..." />
                </Box>
              </Box>
          )}
          
        </Grid>
      </Container>
    );
}


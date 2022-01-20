import { useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Container, Paper, Alert, Button, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Address from '../account/Address';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';
import SendToken from './SendToken';
import ConvertToken from './ConvertToken';
import NoteHistory from './aztec/notes/NoteHistory';
import SmartWalletClient from '../../client/SmartWalletClient';
import GiveMeToken from './GiveMeToken';

interface PropTypes {
  wallet:WalletClient;
  allwallets:WalletClient[];
  onUpdate: any;
  identifier: number;
}

export default function SmartWallet(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [allwallets, setAllwallet] = useState<WalletClient[]>();
    const [docs, setDocs] = useState<string>('-');
    const [rdocs, setRDocs] = useState<string>('-');
    
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
        <Grid container spacing={2}>
            {(!loading && wallet && 
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 80,
                  }}
                >
                  <div>Address: <Address value={prop.wallet?.address} /></div>
                  <div> Tokens: $ {docs}</div>          
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


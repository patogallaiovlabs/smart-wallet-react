import { useEffect, useState } from 'react';
import { Box, Grid, CircularProgress, Container, Paper} from '@mui/material';
import Address from '../account/Address';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';
import SendToken from './SendToken';
import ConvertToken from './ConvertToken';
import NoteHistory from './aztec/notes/NoteHistory';

interface PropTypes {
  wallet:WalletClient;
  allwallets:WalletClient[];
  onUpdate: any;
}

export default function SmartWallet(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [allwallets, setAllwallet] = useState<WalletClient[]>();
    const [docs, setDocs] = useState<string>();
    const [rdocs, setRDocs] = useState<string>();
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        const aw = prop.allwallets;
        setAllwallet(aw);
        const balanceD = await ERC20Client.getDOC().balanceOf(w.address);
        let b =  ethers.utils.formatUnits(balanceD, "ether");
        let formated = parseFloat(b).toFixed(6);
        setDocs(formated.toString());
        const balanceRD = await ERC20Client.getRDOC().balanceOf(w.address);
        b = ethers.utils.formatUnits(balanceRD, "ether");
        let formatedb = parseFloat(b).toFixed(6);
        setRDocs(formatedb.toString());
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);

    return (
        
      <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
        <Grid container spacing={2}>
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
                  <h3>Info</h3>
                  <div>Address: <Address value={prop.wallet?.address} length={5} tail={true} /></div>
                  <div> DOC: $ {docs}</div>
                  <div> RDOC: $ {rdocs}</div>                
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


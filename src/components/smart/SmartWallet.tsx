import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, InputLabel, Select, TextField, MenuItem } from '@mui/material';
import Address from '../account/Address';
import { ethers } from 'ethers';
import ERC20Client from '../../client/ERC20Client';
import WalletClient from '../../client/WalletClient';
import Grid from '@mui/material/Grid';
import SendToken from './SendToken';
import ConvertToken from './ConvertToken';
import DecodeMetadata from './aztec/DecodeMetadata';
import NoteHistory from './aztec/notes/NoteHistory';
import Aztec from './aztec/Aztec';

interface PropTypes {
  wallet:WalletClient;
  allwallets:WalletClient[];
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
        let b = ethers.utils.formatEther(balanceD);
        let formated = parseFloat(b);//.toFixed(2);
        setDocs(formated.toString());
        const balanceRD = await ERC20Client.getRDOC().balanceOf(w.address);
        b = ethers.utils.formatUnits(balanceRD, "ether");
        let formatedb = parseFloat(b).toFixed(2);
        setRDocs(formatedb.toString());
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);

    return (
        <div>
            {(!loading && wallet && 
                <Box margin="1px" >
                  <Box margin="10px" sx={{ border: 1}}>
                    <div>Wallet {wallet && wallet.getIndex()<0?'(EOA)': wallet.getIndex() + 1}: <Address value={prop.wallet?.address}/></div>
                    <div>Balance DOC: $ {docs}</div>
                    <div>Balance RDOC: $ {rdocs}</div>
                  </Box>
                  <Grid container spacing={1} margin="10px">
                    <Grid item xs={4}  sx={{ border: 1}} margin="10px">
                      <SendToken wallet={wallet} allwallets={allwallets} />
                    </Grid>
                    <Grid item xs={4} sx={{ border: 1}} margin="10px">
                      <ConvertToken wallet={wallet} allwallets={allwallets} />
                    </Grid>
                    <Grid item xs={8}>
                      <NoteHistory wallet={wallet} allwallets={prop.allwallets} />
                    </Grid>
                  </Grid>
                </Box>
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


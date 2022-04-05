import { useEffect, useState } from 'react';
import { Alert as MuiAlert, Box, Grid, CircularProgress, Container, Paper, Button, Stack, IconButton, Tooltip, Popover, Typography } from '@mui/material';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import Address from 'src/components/account/Address';
import { ethers } from 'ethers';
import ERC20Client from 'src/client/wallet/ERC20Client';
import WalletClient from 'src/client/wallet/WalletClient';
import NoteHistory from './aztec/notes/NoteHistory';
import SmartWalletClient from 'src/client/wallet/SmartWalletClient';
import GiveMeToken from './token/GiveMeToken';
import { useQuery, gql } from '@apollo/client';
import AztecClient from 'src/client/aztec/AztecClient';
import ConvertAndSendToken from 'src/components/smart/token/ConvertAndSendToken';
import GraphClient from 'src/client/graph/GraphClient';

interface PropTypes {
  wallet:WalletClient;
  allwallets:WalletClient[];
  onUpdate: any;
  identifier: number;
}

const CREATED = 'CREATED';
const DESTROYED = 'DESTROYED';

export default function SmartWallet(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [showKeys, setShowKeys] = useState<boolean>(false);
    const [anchorKeys, setAnchorKeys] = useState<any>(null);
    const [wallet, setWallet] = useState<WalletClient>();
    const [allwallets, setAllwallet] = useState<WalletClient[]>();
    const [docs, setDocs] = useState<string>('-');
    const [balance, setBalance] = useState<string>('-');
    const [total, setTotal] = useState<number>(0);
    const [notes, setNotes] = useState<any>();
    const [data, setData] = useState<any>();
    const variables = {
      id: '',
      status: CREATED
    };
    variables.id = prop.wallet.address?.toLowerCase();
    
    const { loading:loadingUser, error, refetch} = useQuery(GraphClient.LOAD_QUERY(GraphClient.USER_BALANCE_QUERY), {
      variables,
      onCompleted: async (result:any) => {
        setData(result);
        if(result.user?.balance) {
          let temptotal = 0;
          const notes = await Promise.all(result.user?.balance?.map(async (note:any) => {
            let filtered = note.metadata;//.substring(196);
            const decoded = await prop.wallet.decodeMetadata(filtered, false);
            decoded.note.owner = prop.wallet.address;
            decoded.note.status = note.status;
            decoded.note.currencyAddress = note.currencyAddress;
            decoded.date = new Date(note.time * 1000);
            decoded.metadata = note.metadata;
            temptotal+= decoded.note.k ? (decoded.note.k.toNumber() / 10) : 0;
            return decoded;
          }));
          setNotes(notes);
          setTotal(temptotal);
        }
      },
      onError: err => {
        console.log(err);
      }
    });

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
          setBalance(await w.getBalance());
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

    const onSaveUser = async () => {
        console.log('publishing user...');
        setLoading(true);
        const contract = AztecClient.getZkAsset();
        const encoded = await AztecClient.encodeSetEncryptionKey(contract, wallet?.getPK(), wallet?.getEncryptionPK());
        const tx = await wallet?.execute(contract.address, encoded);
        await tx?.wait();
        setTimeout(()=>{
          setLoading(false);
          refetch();
        }, 1000)
    };
    const onViewKeys =  () => {

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
                              onClick={() => onSaveUser()}>Publish</Button>

                              <Tooltip title={'Show keys'}>
                                <Button aria-describedby={'simple-popover'} onClick={(event) => {
                                      setShowKeys(true);
                                      setAnchorKeys(event.currentTarget);
                                    }
                                  }>
                                  <VisibilityIcon /> Show Keys 
                                </Button>
                              </Tooltip>
                              <Popover
                                id={'keys-popup-id'}
                                open={showKeys}
                                anchorEl={anchorKeys}
                                onClose={()=> { 
                                    setShowKeys(false);
                                    setAnchorKeys(null);
                                  }
                                }
                                anchorOrigin={{
                                  vertical: 'bottom',
                                  horizontal: 'left',
                                }}
                              >
                                <Typography sx={{ p: 2,
                                          width: 500,
                                          overflow: 'auto',
                                          whiteSpace: 'initial',
                                          wordWrap: 'break-word'
                                        }}>
                                  <ul>
                                    <li>Public Key: {wallet?.getPK()}</li>
                                    <li>Encryption Key: {wallet?.getEncryptionPK()}</li>  
                                  </ul> 
                                </Typography>
                              </Popover>
                </MuiAlert>
          </Stack>
        )}

        <Grid container spacing={2}>
            {(!loading && wallet && 
              <Grid item xs={12} md={12} lg={12}>
                <Paper
                  sx={{
                    p: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 60,
                    padding: 2
                  }}
                >
                    <div> Address: <Address value={prop.wallet?.address} /></div>
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
                  ><h3> 
                    Balance
                  </h3>
                    <ul>
                      <li>rBTC: $ {balance}</li>
                      <li>Tokens: $ {docs}</li>
                      <li>ZkTokens: $ {total}</li>
                    </ul>    
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
                
                  <ConvertAndSendToken total={total} notes={notes} wallet={wallet} allwallets={allwallets} onUpdate={prop.onUpdate} sendEnabled={true} />
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
                  <ConvertAndSendToken total={total} notes={notes} wallet={wallet} allwallets={allwallets} onUpdate={prop.onUpdate}  />            
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
                  <NoteHistory notes={notes} wallet={wallet} allwallets={prop.allwallets} onUpdate={prop.onUpdate}  />
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


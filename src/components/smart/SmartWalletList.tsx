import { useEffect, useState } from 'react';
import { AppBar, Box, Button, CircularProgress, Tab, Tabs } from '@mui/material';
import SmartWalletClient from '../../client/SmartWalletClient';
import Address from '../account/Address';
import SmartWallet from './SmartWallet';
import WalletClient from '../../client/WalletClient';
import SwipeableViews from 'react-swipeable-views';

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function SmartWalletList() {
    
    const [value, setValue] = useState(0);
    const [wallet, setWallet] = useState<WalletClient>();
    const [wallets, setWallets] = useState<WalletClient[]>();
    const [loading, setLoading] = useState<boolean>(true);
    
    const init = async () => {
        setWallet(undefined);
        setWallets(undefined);
        let mainWallet = await WalletClient.getInstance(0);
        setWallet(mainWallet);
        let temp:WalletClient[] = [mainWallet];
        let active = true;
        let i = 0;
        while (active) {
          let tempWallet = await SmartWalletClient.getInstance(i);
          await tempWallet.init();
          temp.push(tempWallet);
          active = tempWallet.isActive();
          i++;
        }
        setWallets(temp);
        setLoading(false);
    }
    useEffect(()=>{
        init();
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
      setValue(newValue);
    };
    const handleChangeIndex = (index: number) => {
      setValue(index);
    };

    const onUpdate = () => {
      console.log('***updating...');
      init();
    }

    return (
        
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? 'white'
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            marginTop: '49px'
          }}>
            {(!loading && 
            <div>
              <AppBar position="static">
                <Tabs
                  value={value}
                  onChange={handleChange}
                  indicatorColor="secondary"
                  textColor="inherit"
                  aria-label="secondary tabs example"
                >
                {wallets?.map((a, i)=>{
                  return <Tab key={i} value={i} label={"Wallet " + i + (!a.isActive()?' (inactive)':'')} />
                })}
                </Tabs>
              </AppBar>

              <SwipeableViews
                index={value}
                onChangeIndex={handleChangeIndex}
              >
              {wallets?.map((a, i)=>{
                    let key = i - 1;
                    return <TabPanel value={i} index={i} key={i}>
                          <SmartWallet wallet={a} identifier={key} allwallets={wallets} onUpdate={onUpdate}></SmartWallet>
                    </TabPanel>
                  })
                }
                </SwipeableViews>
              </div>
            )}
            {(loading && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ m: 1, position: 'relative' }}>
                    <CircularProgress color="inherit" placeholder="Loading..." />
                  </Box>
                </Box>
            )}
        </Box>
    );
}


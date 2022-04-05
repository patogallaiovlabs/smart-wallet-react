import './App.css';
import * as React from 'react';
import Account from './components/account/Account';
import { mainListItems, secondaryListItems } from './components/menu/listItems';
import Dashboard from './dashboard/Dashboard';
import { Box } from '@mui/material';
import { BrowserRouter as Router, Route } from "react-router-dom"; 
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SmartWalletList from './components/smart/SmartWalletList';
import Sign from './components/sign/Sign';
import dotenv from 'dotenv';
import Balances from './components/balance/Balances';
import Settings from './components/account/Settings';
import Loading from './components/Loading';

declare const window: any;

export default function App() {

  dotenv.config();
  
  const mdTheme = createTheme();
  
  const drawerWidth: number = 240;

  interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
  }

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  const [open, setOpen] = React.useState(false);
  const [networkVersion, setNetworkVersion] = React.useState(0);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  
  window.ethereum.request({ method: 'eth_requestAccounts' });

  setTimeout(()=>{
    setNetworkVersion(window.ethereum.networkVersion);
    console.log('net version', networkVersion);
  }, 1000);
  console.log('net version', networkVersion);

  return (
    <ThemeProvider theme={mdTheme}>

      {(networkVersion != 31 &&
        <div> <Loading /></div>
      )}
     {(networkVersion == 31 &&
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar  open={open}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Aztec App
              </Typography>
              <Account></Account>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary"> {/* Change this number to show notifications, greater > 0*/}
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List>{mainListItems}</List>
            <Divider />
            <List>{secondaryListItems}</List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
              marginTop: '49px'
            }}
          >
            
              <div>
                <Route path="/" exact component={Dashboard} /> 
                <Route path="/smart" exact component={SmartWalletList} /> 
                <Route path="/sign" exact component={Sign} /> 
                <Route path="/balances" exact component={Balances} /> 
                <Route path="/settings" exact component={Settings} /> 
              </div>
          </Box>
        </Box>
      </Router>
     )}
    </ThemeProvider>
  );
}

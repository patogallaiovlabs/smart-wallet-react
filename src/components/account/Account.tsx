import { useState, MouseEvent, useEffect } from 'react';
import { Menu, MenuItem, IconButton } from '@mui/material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import EtherClient from '../../client/EtherClient';
import Address from './Address';


export default function Account() {
    const [ethClient, setEthClient] = useState<EtherClient>();

    // wallet info:
    const [account, setAccount] = useState<string>();
    const [chainId, setChainId] = useState<number>();
  
    const login = () => {
      let client = EtherClient.instance();
      setEthClient(client);
      
      client.on('accountsChanged', () => {
        console.log('accountsChanged');
        update(client);
      });
      update(client);
    }

    const update = (client:EtherClient) => {
      console.log('updating account...');
      client.getAddress().then((value:string) => {
        setAccount(value);
      }).catch(console.log);

      client.getChainId()
        .then((id:any) => setChainId(id))
        .catch(console.log)
    }

    // handle logging out
    const logout = () => {
      if (ethClient){
        ethClient.close();
      }
      setAccount(undefined);
      setChainId(0)
      setAnchorEl(null);
    }


    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    useEffect(() => {
      console.log('login');
      login();
    }, []);

    return (
      <div>
          {/** Logged out */}
          {!account && (
          <IconButton color="inherit"
            aria-label="connect"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={login}>
            <NoAccountsIcon />
          </IconButton>
          )}
          {/** Logged in */}
          {account && (
          <IconButton color="inherit"
            aria-label="account details"
            aria-controls="basic-menu"
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <div>
              <ManageAccountsIcon />
            </div>
          </IconButton>
          )}
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
            <MenuItem><strong>Address: </strong><Address value={account}/></MenuItem>
            <MenuItem><strong>ChainId: </strong>{chainId}</MenuItem>
            <MenuItem onClick={() => logout()}>Logout</MenuItem>
          </Menu>
      </div>
    );
  
}

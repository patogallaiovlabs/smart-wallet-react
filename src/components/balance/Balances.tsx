import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';
import ERC20Client from '../../client/wallet/ERC20Client';
import { ethers } from 'ethers';

export default function Balances() {

  const [items, setItems] = useState<any[]>();

  const init = async () => {
    //init 
    console.log("init balances")
    setItems(await Promise.all([
      { address: "0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826", name:"wallet"}, 
      { address: "0xeFb80DB9E2d943A492Bd988f4c619495cA815643", name:"ACE"}, 
      { address: "0x4F7b5156094e8cFcda28821dC05c5d2Cea58448f", name:"ACE2"}
      
      
    ].map(async (item)=>{
        const contract = ERC20Client.getDOC();
        const balance = await contract.balanceOf(item.address);
        const allowance = await contract.allowance("0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826", item.address);
        let balanceFormatted =  ethers.utils.formatUnits(balance, "ether");
        let allowanceFormatted =  ethers.utils.formatUnits(allowance, "ether");
        return {
          address: item.address,
          balance,
          balanceFormatted,
          allowance,
          allowanceFormatted,
          name: item.name
        }
    })));
  }

  useEffect(()=>{
      init();
  }, []);

  return (
    <Container>
    {(items && 
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
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Typography component="h2" variant="h6" color="primary" gutterBottom>
                    Token Balances
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Balance</TableCell>
                        <TableCell>Balance Formatted</TableCell>
                        <TableCell>Allowance</TableCell>
                        <TableCell>Allowance Formatted</TableCell>
                        <TableCell>Address</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((row) => (
                        <TableRow key={row.address}>
                          <TableCell>{row.name}</TableCell>
                          <TableCell>{row.balance.toString()}</TableCell>
                          <TableCell>{row.balanceFormatted}</TableCell>
                          <TableCell>{row.allowance.toString()}</TableCell>
                          <TableCell>{row.allowanceFormatted}</TableCell>
                          <TableCell><Box sx={{
                                          width: 150,
                                          overflow: 'auto',
                                          whiteSpace: 'initial',
                                          wordWrap: 'break-word'
                                        }}>{row.address}</Box></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
  )}
  </Container>
  );
}


import WalletClient from 'src/client/wallet/WalletClient';
import NoteItem from './NoteItem';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect } from 'react';




interface PropTypes {
    wallet:WalletClient;
    allwallets?:WalletClient[];
    onUpdate: any;
    notes:any;
}

export default function NoteHistory(props: PropTypes) {

    
    useEffect(() => {
      //refetch(); 
    }, [props.wallet]);

    const onUpdate = () => {
      props.onUpdate();
    };

    return (
      <div>
        <h3>ZkToken Notes</h3>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Hash</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell sx={{ textAlign : "center"}}>Value</TableCell>
              <TableCell>Send</TableCell>
              <TableCell>Withdraw</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              props.notes?.map((note:any, i:number)=>{
                return <NoteItem key={i} wallet={props.wallet} allwallets={props.allwallets} note={note} onUpdate={onUpdate}></NoteItem>
              })
            }
          </TableBody>
        </Table>
      </div>
      );
}
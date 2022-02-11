import Loading from '../../../Loading';
import WalletClient from '../../../../client/wallet/WalletClient';
import NoteItem from './NoteItem';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import GraphClient from '../../../../client/graph/GraphClient';
import { useQuery } from '@apollo/client';

const CREATED = 'CREATED';
const DESTROYED = 'DESTROYED';



interface PropTypes {
    wallet:WalletClient;
    allwallets?:WalletClient[];
    onUpdate: any;
}

export default function NoteHistory(props: PropTypes) {

    const [total, setTotal] = useState<number>();
    const [notes, setNotes] = useState<any>();
    const variables = {
      id: '',
      status: CREATED
    };
    variables.id = props.wallet.address?.toLowerCase();
    
    const { loading, error, refetch} = useQuery(GraphClient.LOAD_QUERY(GraphClient.USER_BALANCE_QUERY), {
      variables,
      onCompleted: async (data:any) => {
        if(data.user?.balance) {
          let temptotal = 0;
          const notes = await Promise.all(data.user?.balance?.map(async (note:any) => {
            let filtered = note.metadata;//.substring(196);
            const decoded = await props.wallet.decodeMetadata(filtered, false);
            decoded.note.owner = props.wallet.address;
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
    
    useEffect(() => {
      //refetch(); 
    }, [props.wallet]);

    const onUpdate = () => {
      refetch();
      props.onUpdate();
    };

    const showDestroyed = (evt:any) => {
       variables.status = evt.target.checked ? DESTROYED:CREATED;
       refetch(variables); 
    }

    if (loading) return <Loading></Loading>;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <div>
        <h3>ZkToken Notes</h3>
        <FormControlLabel control={<Checkbox defaultChecked={false} onChange={showDestroyed} />} label="Show destroyed notes" />     
        <div>Total: ${total}</div>
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
              notes?.map((note:any, i:number)=>{
                return <NoteItem key={i} wallet={props.wallet} allwallets={props.allwallets} note={note} onUpdate={onUpdate}></NoteItem>
              })
            }
          </TableBody>
        </Table>
      </div>
      );
}
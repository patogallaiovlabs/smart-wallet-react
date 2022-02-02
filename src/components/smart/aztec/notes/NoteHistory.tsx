import Loading from '../../../Loading';
import WalletClient from '../../../../client/wallet/WalletClient';
import NoteItem from './NoteItem';
import { Checkbox, Table, TableBody, TableCell, TableHead, TableRow, FormControlLabel } from '@mui/material';
import { useEffect } from 'react';
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

    const variables = {
      id: '',
      status: CREATED
    };
    variables.id = props.wallet.address?.toLowerCase();
    
    const { loading, error, data, refetch} = useQuery(GraphClient.LOAD_QUERY(GraphClient.USER_BALANCE_QUERY), {variables});
    
    useEffect(() => {
      refetch(); 
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
              data?.user?.balance.map((note:any, i:number)=>{
                return <NoteItem key={i} wallet={props.wallet} allwallets={props.allwallets} note={note} onUpdate={onUpdate}></NoteItem>
              })
            }
          </TableBody>
        </Table>
      </div>
      );
}
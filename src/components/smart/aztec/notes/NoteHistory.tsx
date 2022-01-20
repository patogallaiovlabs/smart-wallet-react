
import { gql, useQuery } from '@apollo/client';
import Loading from '../../../Loading';
import WalletClient from '../../../../client/WalletClient';
import NoteItem from './NoteItem';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useEffect } from 'react';

const userQuery = `
user($id: ID!) {
  user(id: $id) {
    id
    balance (where: {status: "CREATED"}, orderBy:time,orderDirection:desc){
        status
        metadata
        currencyAddress
        time
    }
  }
}
`;

const LOAD_QUERY = (query:any) => gql`
  query ${query}
`;

const variables = {
    id: '',
  };

interface PropTypes {
    wallet:WalletClient;
    allwallets?:WalletClient[];
    onUpdate: any;
}

export default function NoteHistory(props: PropTypes) {
    variables.id = props.wallet.address?.toLowerCase();
    
    const { loading, error, data, refetch} = useQuery(LOAD_QUERY(userQuery), {variables});
    
    useEffect(() => {
      refetch(); 
    }, [props.wallet]);

    const onUpdate = () => {
      refetch();
      props.onUpdate();
    };

    if (loading) return <Loading></Loading>;
    if (error) return <p>Error: {error.message}</p>;

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
              data?.user?.balance.map((note:any, i:number)=>{
                return <NoteItem key={i} wallet={props.wallet} allwallets={props.allwallets} note={note} onUpdate={onUpdate}></NoteItem>
              })
            }
          </TableBody>
        </Table>
      </div>
      );
}
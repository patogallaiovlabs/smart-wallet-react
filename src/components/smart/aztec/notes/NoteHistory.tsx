
import { gql, useQuery } from '@apollo/client';
import Loading from '../../../Loading';
import WalletClient from '../../../../client/WalletClient';
import NoteItem from './NoteItem';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

const userQuery = `
user($id: ID!) {
  user(id: $id) {
    id
    balance {
        status
        metadata
        currencyAddress
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
}

export default function NoteHistory(props: PropTypes) {
    variables.id = props.wallet.address?.toLowerCase();
    const { loading, error, data } = useQuery(LOAD_QUERY(userQuery), {variables});
    if (loading) return <Loading></Loading>;
    if (error) return <p>Error: {error.message}</p>;
    return (
      <div>
        <h3>ZkDOC Notes</h3>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Hash</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>View</TableCell>
              <TableCell>Send</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              data?.user?.balance.map((note:any, i:number)=>{
                return <NoteItem key={i} wallet={props.wallet} allwallets={props.allwallets} note={note}></NoteItem>
              })
            }
          </TableBody>
        </Table>
      </div>
      );
}
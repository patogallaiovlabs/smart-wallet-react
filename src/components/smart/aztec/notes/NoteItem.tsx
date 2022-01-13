import Loading from '../../../Loading';
import WalletClient from '../../../../client/WalletClient';
import { Button, TableRow, TableCell } from '@mui/material';
import { useState, useEffect } from 'react';
import SendNote from '../SendNote';

interface PropTypes {
    wallet:WalletClient;
    allwallets?:WalletClient[];
    note:any;
    onUpdate:any;
}

export default function NoteItem(props: PropTypes) {

    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [result, setResult] = useState<{addresses:[any], decrypted:any, note:any}>();

    const init = async () => {
      //init 
      const w = props.wallet;
      setWallet(w);
      setLoading(false);
      let filtered = props.note.metadata;//.substring(196);
      const decoded = await w.decodeMetadata(filtered, false);
      decoded.note.owner = w.address;
      setResult(decoded);
    }

    useEffect(()=>{
        init();
    }, []);


    const action = async () => {
      if (wallet) {
        setLoading(true);
        try {
          let filtered = props.note.metadata;//.substring(196);
          const decoded = await wallet.decodeMetadata(filtered, true);
          decoded.note.owner = wallet.address;
          setResult(decoded);
        } catch (e) {
          console.log(e);
        }finally {
          setLoading(false);
        }
      }
    }

    return (
          <TableRow key={result?.note.noteHash}>
            <TableCell>{result?.note.noteHash}</TableCell>
            <TableCell>{props.note.currencyAddress.substring(0, 7)}</TableCell>
            <TableCell>{(loading && <Loading/>)} {!loading && (<span> {result?.note?.k ? result.note.k?.toNumber() : 'encrypted'} </span>)}</TableCell>
            <TableCell>{props.note.status}</TableCell>
            <TableCell><Button variant="contained"
                onClick={() => action()}
                >Decrypt</Button></TableCell>
            <TableCell><SendNote note={result?.note} wallet={props.wallet} allwallets={props.allwallets} onUpdate={props.onUpdate}/></TableCell>
          </TableRow>
        );
}
import Loading from '../../../Loading';
import WalletClient from '../../../../client/WalletClient';
import { Button, TableRow, TableCell } from '@mui/material';
import { useState, useEffect } from 'react';
import SendNote from '../SendNote';
import Address from '../../../account/Address';

interface PropTypes {
    wallet:WalletClient;
    allwallets?:WalletClient[];
    note:any;
    onUpdate:any;
}

const DATE_OPTIONS = { year: 'numeric', month: 'numeric', day: 'numeric' };
const TIME_OPTIONS = { hour: '2-digit', minute: '2-digit' };

export default function NoteItem(props: PropTypes) {

    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [result, setResult] = useState<{addresses:[any], decrypted:any, note:any, date:any}>();

    const init = async () => {
      //init 
      const w = props.wallet;
      setWallet(w);
      setLoading(false);
      let filtered = props.note.metadata;//.substring(196);
      const decoded = await w.decodeMetadata(filtered, false);
      decoded.note.owner = w.address;
      decoded.date = new Date(props.note.time * 1000);
      setResult(decoded);
    }

    useEffect(()=>{
        init();
    }, []);

    const withdraw = async () => {
      setLoading(true);
      try {
        if(wallet) {
          const txPending = await wallet?.withdrawNote(result?.note);
          const txResult = await txPending?.wait();
          console.log('result withdraw note', txResult);
        }
      }catch (e) {
        console.log(e);
      } finally {
        setTimeout(()=>{
          setLoading(false);
          props.onUpdate();
        }, 10000);
      }
    }

    const action = async () => {
      if (wallet) {
        setLoading(true);
        try {
          let filtered = props.note.metadata;//.substring(196);
          const decoded = await wallet.decodeMetadata(filtered, true);
          decoded.note.owner = wallet.address;
          decoded.date = new Date(props.note.time * 1000);
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
            <TableCell>{result?.date.toLocaleDateString('en-US', DATE_OPTIONS)}, {result?.date.toLocaleTimeString('en-US', TIME_OPTIONS)}</TableCell>
            <TableCell><Address value={result?.note.noteHash} length={5} tail={true}/></TableCell>
            <TableCell>{props.note.currencyAddress.substring(0, 7)}</TableCell>
            <TableCell sx={{ textAlign : "center"}}>
                {(loading && <Loading/>)} 
                {(!loading && !result?.note?.k && <Button variant="contained"
                                                      onClick={() => action()}
                                                      >Decrypt</Button>)}
                {(!loading && result?.note?.k && <span>${result?.note?.k.toNumber() / 10}</span>)}
            </TableCell>
            <TableCell>
              <SendNote note={result?.note} wallet={props.wallet} allwallets={props.allwallets} onUpdate={props.onUpdate}/>
            </TableCell>
            <TableCell>
              <Button variant="contained" disabled={!result?.note?.k}
                              onClick={() => withdraw()}
                              >Withdraw</Button>
            </TableCell>
          </TableRow>
        );
}
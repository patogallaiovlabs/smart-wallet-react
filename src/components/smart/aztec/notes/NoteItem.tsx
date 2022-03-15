import Loading from '../../../Loading';
import WalletClient from '../../../../client/wallet/WalletClient';
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
    const [openSend, setOpenSend] = useState<boolean>(false);


    useEffect(()=>{
      const init = async () => {
        //init 
        const w = props.wallet;
        setWallet(w);
        setLoading(false);
        setResult(props.note);
      }
      init();
    }, [props.wallet, props.note]);

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
          let filtered = props?.note.metadata;//.substring(196);
          const decoded = await wallet.decodeMetadata(filtered, true);
          decoded.note.owner = wallet.address;
          decoded.note.currencyAddress = props?.note?.note?.currencyAddress;
          decoded.date = props.note.date;
          setResult(decoded);
          props.onUpdate();
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
            <TableCell>{result?.note?.currencyAddress?.substring(0, 7)}</TableCell>
            <TableCell sx={{ textAlign : "center"}}>
                {(loading && <Loading/>)} 
                {(!loading && !result?.note?.k && <Button variant="outlined"
                                                      onClick={() => action()}
                                                      >Decrypt</Button>)}
                {(!loading && result?.note?.k && <span>${result?.note?.k.toNumber() / 10}</span>)}
            </TableCell>
            <TableCell>
              <SendNote open={openSend} onClose={() => { setOpenSend(false) }}  note={result?.note} wallet={props.wallet} allwallets={props.allwallets} onUpdate={props.onUpdate}/>
              <Button variant="contained" disabled={!result?.note?.k || result?.note?.status !== "CREATED"} onClick={() => { setOpenSend(true) }}>
                Send 
              </Button>
            </TableCell>
            <TableCell>
              <Button variant="contained" disabled={!result?.note?.k || result?.note?.status !== "CREATED"}
                              onClick={() => withdraw()}
                              >Withdraw</Button>
            </TableCell>
          </TableRow>
        );
}
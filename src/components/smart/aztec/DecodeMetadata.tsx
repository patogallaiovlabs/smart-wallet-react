import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, FormControl, TextField } from '@mui/material';
import WalletClient from '../../../client/WalletClient';

interface PropTypes {
  wallet:WalletClient;
}

export default function DecodeMetadata(prop:PropTypes) {
    
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<WalletClient>();
    const [metadata, setMetadata] = useState<string>('0x0796501f48ecefc585a3a0d56c5f865d65fbe59f575e7cd08e5b79a2b8e0440907de02c13c32f6fee798ff8d26458512340b2cb713dbfd8206cff41767034487c1d4a93b3c790fe433e295b6393249d6fa6cd8dbefc4fdef3d3bc54b6c15a5d10100000000000000000000000000000000000000000000000000000000000000c10000000000000000000000000000000000000000000000000000000000000101000000000000000000000000000000000000000000000000000000000000023d000000000000000000000000000000000000000000000000000000000000000100000000000000000000000020f51908c8ce306ee805abea650c2f23a11489080000000000000000000000000000000000000000000000000000000000000001447830577a2b52757234755a44484343636f68703339364c517a6f334744667247444b46696e4d4e54647856653641796f714f704b64715349596d39646174326b793573576d754c6c48633d4c506c684d7357702f436b4650714c5267665a594f4b4d46444b6d65764e48335a454f556f726b696a4b324943474c4159336135556c727464766754724e5964735355506664665872415043304356536176303058663332484c64414271594b69787a556569756b56743354492f69774c71555642324d6e48685567754d573535584b30633774696a6448794d7a4b38567368696263495779473252524d532b6c7576334f425952587671486a414c4b6c654b70756a397a396b77524f6b693777722f6e77774a62744677664b4c56640000000000000000000000000000000000000000000000000000000000000000');
    const [result, setResult] = useState<{addresses:[any], decrypted:any}>();
    
    const init = async () => {
        //init 
        const w = prop.wallet;
        setWallet(w);
        setLoading(false);
      }

    useEffect(()=>{
        init();
    }, []);


    const action = async () => {
      if (wallet) {
        setLoading(true);
        let pk = '0x991a61c28759e9586ee6d065f2124e1c922fdd50d9f9bc68a2a6e27fdebe7c00';
        let filtered = metadata;//.substring(196);
        console.log(filtered);
        const decoded = await wallet.decodeMetadata(filtered);
        //await note.derive(pk);
        setResult(decoded);
        console.log('encoded metadata', metadata);
        console.log('decode metadata', decoded);
        setLoading(false);
      }
    }

    return (
        <div>
            {(!loading && wallet && 
                <FormControl fullWidth={true}>
                    <TextField minRows={5} multiline={true} label="Metadata" variant="standard" margin="normal" name="dataInput" value={metadata} onChange={evt => setMetadata(evt.target.value)}></TextField>
                    <Button variant="contained"
                            onClick={() => action()}
                            >Convert DOC</Button>
                    <p>{result?.decrypted}</p>
                </FormControl>
            )}

            {/** LOADING */}
            {(loading && 
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ m: 1, position: 'relative' }}>
                    <CircularProgress color="inherit" placeholder="Loading..." />
                  </Box>
                </Box>
            )}
        </div>
    );
}


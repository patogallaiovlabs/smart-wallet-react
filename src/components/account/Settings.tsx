
import { gql, useQuery } from '@apollo/client';
import Loading from '../Loading';
import WalletClient from '../../client/wallet/WalletClient';
import { useEffect, useState } from 'react';
import { Button, Checkbox, FormControlLabel, FormGroup, Grid, Paper, Container } from '@mui/material';
import AztecClient from '../../client/aztec/AztecClient';
import { Settings as SettingsIcon } from '@mui/icons-material';

const userQuery = `
user($id: ID!) {
  user(id: $id) {
    id
    publicKey
  }
}
`;

const LOAD_QUERY = (query:any) => gql`
  query ${query}
`;


export default function Settings() {

    const [wallet, setWallet] = useState<any>();
    const [variables, setVariables] = useState<any>({
        id: '',
        address:'',
        publicKey:''
    });
    
    let { loading, error, data, refetch} = useQuery(LOAD_QUERY(userQuery), {variables});

    const init = async () => {
        const tWallet = (await WalletClient.getInstance(0));
        setWallet(tWallet);
        const address = tWallet.address?.toLowerCase();
        let vars = {
            id: address,
            address
        };
        setVariables(vars);
        refetch(vars);
        console.log(data);
    }

    useEffect(() => {
        init();
    }, []);

    const onSaveUser = async (publicKey:string) => {
        console.log('saving...');
        loading = true;
        const contract = AztecClient.getZkAsset();
        const encoded = await AztecClient.encodeSetEncryptionKey(contract, publicKey);
        const tx = await wallet.execute(contract.address, encoded);
        await tx?.wait();
        setTimeout(()=>{
            loading = false;
            refetch();
        }, 1000)
    };

    if (loading) return <Loading></Loading>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
            <Grid spacing={2}>
                {(data && 
                    <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 500,
                    }}
                    >
                        <FormGroup>
                            <h3><SettingsIcon />Settings</h3> <h5>- User:{data.user?.id}</h5>
                            <FormControlLabel control={<Checkbox defaultChecked />} label="Default private wallets" />
                        </FormGroup>
                    </Paper>
                )}
            </Grid>
        </Container>
      );
}
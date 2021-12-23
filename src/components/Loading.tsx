import { Box, CircularProgress } from '@mui/material';


export default function Loading() {
    return (<Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ m: 1, position: 'relative' }}>
                    <CircularProgress color="inherit" placeholder="Loading..." />
                </Box>
            </Box>
    );
}
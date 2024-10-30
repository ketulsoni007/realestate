import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Avatar } from '@mui/material';

// ----------------------------------------------------------------------

export function TableNoAccess({ ...other }) {
  return (
    <TableRow {...other}>
      <TableCell align="center" colSpan={8}>
        <Box sx={{ py: 10, textAlign: 'center' }} display={'flex'} justifyContent={'center'}>
          <Avatar
            src={'/assets/images/403-1.png'}
            sx={{ objectFit: 'contain', borderRadius: 0, width: 200, height: 200 }}
          />
        </Box>
      </TableCell>
    </TableRow>
  );
}

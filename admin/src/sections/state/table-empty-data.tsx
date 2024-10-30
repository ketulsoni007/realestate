import type { TableRowProps } from '@mui/material/TableRow';

import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';

// ----------------------------------------------------------------------

type TableEmptyDataProps = TableRowProps & {
  table: string;
  route: string;
};

export function TableEmptyData({table,route}:TableEmptyDataProps) {
  return (
    <TableRow>
      <TableCell align="center" colSpan={8}>
        <Box sx={{ py: 15, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            No Data found
          </Typography>

          <Typography variant="body2">
            No Data found for &nbsp;
            <strong>&quot;{table}&quot;</strong>.
          </Typography>
          <NavLink to={route}>
             Please create a new one
          </NavLink>
        </Box>
      </TableCell>
    </TableRow>
  );
}

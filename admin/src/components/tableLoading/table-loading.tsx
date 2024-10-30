import React from 'react';
import { TableRow, TableCell, Skeleton } from '@mui/material';

const TableLoading = ({ columns,rowsPerPage }: any) => {

  return (
    <>
      {Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell align="left">
            <Skeleton
              variant='rectangular'
              height={20}
              width={20}
            />
          </TableCell>
          <TableCell align="left">
            <Skeleton
              variant='circular'
              height={30}
              width={30}
            />
          </TableCell>
          {Array.from({ length: columns - 2 }).map((_, colIndex) => {
            return (
              <TableCell key={colIndex} align="left">
                <Skeleton
                  variant="text"
                  height={20}
                  width={30}
                />
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </>
  );
};

export default TableLoading;

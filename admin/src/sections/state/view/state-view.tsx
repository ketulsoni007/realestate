import { useState, useCallback, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { StateTableRow } from '../state-table-row';
import { CountryTableHead } from '../state-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { CountryTableToolbar } from '../state-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import type { StateProps } from '../state-table-row';
import { TableEmptyData } from '../table-empty-data';
import { countryListApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch, useAppSelector } from 'src/store';
import { stateListApi } from 'src/store/Slices/stateSlice';
import TableLoading from 'src/components/tableLoading/table-loading';

// ----------------------------------------------------------------------

export const StateView: React.FC = () => {
  const table = useTable();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const StateListData = useAppSelector((state: any) => state.state.isStateListData);
  const totalCount = StateListData?.totalCount ?? 0;
  const states =
    StateListData?.states && StateListData?.states?.length > 0
      ? StateListData?.states
      : [];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [filterName, setFilterName] = useState('');
  const isApiStatus = useAppSelector((state: any) => state.state.isApiStatus);
  const loading = isApiStatus?.stateListApi === 'loading';
  // Fetch properties when component mounts or when pagination changes
  useEffect(() => {
    dispatch(stateListApi({ page: table.page, rowsPerPage: table.rowsPerPage }));
  }, [dispatch, table.page, table.rowsPerPage]);

  const dataFiltered: StateProps[] = applyFilter({
    inputData: states, // Use properties from the Redux state instead of _users
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: any) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          States
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/state/add')}
        >
          New State
        </Button>
      </Box>
      <Card>
        <CountryTableToolbar
          table={table}
          page={states?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
          rowsPerPage={table.rowsPerPage}
          numSelected={table.selected.length}
          selected={table.selected}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <CountryTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={totalCount} // Use totalCount from the fetched data
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    states.map((itemData: any) => itemData._id) // Adjust according to your property structure
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'country', label: 'Country' },
                  { id: 'isActive', label: 'Active' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableLoading rowsPerPage={table.rowsPerPage} columns={5} />
                ) : (
                  dataFiltered.map((row) => (
                    <StateTableRow
                      table={table}
                      page={states?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
                      rowsPerPage={table.rowsPerPage}
                      key={row._id}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                    />
                  )))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, totalCount)} // Use totalCount here
                />
                {states?.length === 0 && <TableEmptyData table="State" route="/state/add" />}
                {states?.length !== 0 && notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={totalCount} // Use totalCount from the fetched data
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
};

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    setSelected,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}

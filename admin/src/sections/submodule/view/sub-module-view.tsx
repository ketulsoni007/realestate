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
import { SubModuleTableRow } from '../sub-module-table-row';
import { SubModuleTableHead } from '../sub-module-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { SubModuleTableToolbar } from '../sub-module-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import type { SubModuleProps } from '../sub-module-table-row';
import { TableEmptyData } from '../table-empty-data';
import { useAppDispatch, useAppSelector } from 'src/store';
import { subModuleListApi } from 'src/store/Slices/subModuleSlice';
import TableLoading from 'src/components/tableLoading/table-loading';

// ----------------------------------------------------------------------

export const SubModuleView: React.FC = () => {
  const table = useTable();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const SubModuleListData = useAppSelector((state: any) => state.subModule.isSubModuleListData);
  const totalCount = SubModuleListData?.totalCount ?? 0;
  const submodules =
    SubModuleListData?.submodules && SubModuleListData?.submodules?.length > 0
      ? SubModuleListData?.submodules
      : [];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [filterName, setFilterName] = useState('');
  const isApiStatus = useAppSelector((state: any) => state.subModule.isApiStatus);
  const loading = isApiStatus?.subModuleListApi === 'loading';

  // Fetch properties when component mounts or when pagination changes
  useEffect(() => {
    dispatch(subModuleListApi({ page: table.page, rowsPerPage: table.rowsPerPage }));
  }, [dispatch, table.page, table.rowsPerPage]);

  const dataFiltered: SubModuleProps[] = applyFilter({
    inputData: submodules, // Use properties from the Redux state instead of _users
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
          SubModules
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={() => navigate('/submodule/add')}
        >
          New SubModule
        </Button>
      </Box>
      <Card>
        <SubModuleTableToolbar
          table={table}
          page={submodules?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
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
              <SubModuleTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={totalCount} // Use totalCount from the fetched data
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: any) =>
                  table.onSelectAllRows(
                    checked,
                    submodules.map((itemData: any) => itemData._id) // Adjust according to your property structure
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'module', label: 'Module' },
                  { id: 'icon', label: 'Icon' },
                  { id: 'route', label: 'Route' },
                  { id: 'order', label: 'Order' },
                  { id: 'isActive', label: 'Active' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableLoading rowsPerPage={table.rowsPerPage} columns={8} />
                ) : (
                  dataFiltered.map((row) => (
                    <SubModuleTableRow
                      table={table}
                      page={submodules?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
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
                {submodules?.length === 0 && <TableEmptyData table="SubModule" route="/submodule/add" />}
                {submodules?.length !== 0 && notFound && <TableNoData searchQuery={filterName} />}
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

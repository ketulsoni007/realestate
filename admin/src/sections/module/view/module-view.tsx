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
import { ModuleTableRow } from '../module-table-row';
import { ModuleTableHead } from '../module-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { ModuleTableToolbar } from '../module-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import type { ModuleProps } from '../module-table-row';
import { TableEmptyData } from '../table-empty-data';
import { countryListApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch, useAppSelector } from 'src/store';
import { moduleListApi } from 'src/store/Slices/moduleSlice';
import userPermissionCheck from 'src/utils/user-permission-check';
import AccessDenied from 'src/components/accessDenied/access-denied';
import BarLoader from 'src/components/loader/bar-loader';
import { TableNoAccess } from 'src/components/accessDenied/no-table-access';
import TableLoading from 'src/components/tableLoading/table-loading';

// ----------------------------------------------------------------------

export const ModuleView: React.FC = () => {
  const table = useTable();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const ModuleListData = useAppSelector((state: any) => state.module.isModuleListData);
  const totalCount = ModuleListData?.totalCount ?? 0;
  const modules =
    ModuleListData?.modules && ModuleListData?.modules?.length > 0 ? ModuleListData?.modules : [];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [filterName, setFilterName] = useState('');
  const canViewModule = userPermissionCheck('Role Management', 'can_view', 'Module');
  const canAddModule = userPermissionCheck('Role Management', 'can_create', 'Module');
  const isApiStatus = useAppSelector((state: any) => state.module.isApiStatus);
  const loading = isApiStatus?.moduleListApi === 'loading';
  // Fetch properties when component mounts or when pagination changes
  useEffect(() => {
    dispatch(moduleListApi({ page: table.page, rowsPerPage: table.rowsPerPage }));
  }, [dispatch, table.page, table.rowsPerPage]);

  const dataFiltered: ModuleProps[] = applyFilter({
    inputData: modules, // Use properties from the Redux state instead of _users
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
    <>
      {canViewModule === 'loading' ? (
        <BarLoader />
      ) : (
        <DashboardContent>
          <Box display="flex" alignItems="center" mb={5}>
            <Typography variant="h4" flexGrow={1}>
              Modules
            </Typography>
            {canAddModule ? (
              <Button
                variant="contained"
                color="inherit"
                startIcon={<Iconify icon="mingcute:add-line" />}
                onClick={() => navigate('/module/add')}
              >
                New Module
              </Button>
            ) : null}
          </Box>
          <Card>
            <ModuleTableToolbar
              table={table}
              page={modules?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
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
                  <ModuleTableHead
                    rowsPerPage={table.rowsPerPage}
                    order={table.order}
                    orderBy={table.orderBy}
                    rowCount={totalCount} // Use totalCount from the fetched data
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        modules.map((itemData: any) => itemData._id) // Adjust according to your property structure
                      )
                    }
                    headLabel={[
                      { id: 'name', label: 'Name' },
                      { id: 'icon', label: 'Icon' },
                      { id: 'route', label: 'Route' },
                      { id: 'order', label: 'Order' },
                      { id: 'isActive', label: 'Active' },
                      { id: '' },
                    ]}
                  />
                  {canViewModule ? (
                    <TableBody>
                      {loading ? (
                        <TableLoading rowsPerPage={table.rowsPerPage} columns={7} />
                      ) : (
                        dataFiltered.map((row) => (
                          <ModuleTableRow
                            table={table}
                            page={
                              modules?.length === 1
                                ? table.page > 0
                                  ? table.page - 1
                                  : 0
                                : table.page
                            }
                            rowsPerPage={table.rowsPerPage}
                            key={row._id}
                            row={row}
                            selected={table.selected.includes(row._id)}
                            onSelectRow={() => table.onSelectRow(row._id)}
                          />
                        ))
                      )}

                      <TableEmptyRows
                        height={68}
                        emptyRows={emptyRows(table.page, table.rowsPerPage, totalCount)} // Use totalCount here
                      />
                      {modules?.length === 0 && (
                        <TableEmptyData table="Module" route="/module/add" />
                      )}
                      {modules?.length !== 0 && notFound && (
                        <TableNoData searchQuery={filterName} />
                      )}
                    </TableBody>
                  ) : (
                    <TableBody>
                      <TableNoAccess />
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>
            {canViewModule && (
              <TablePagination
                component="div"
                page={table.page}
                count={totalCount} // Use totalCount from the fetched data
                rowsPerPage={table.rowsPerPage}
                onPageChange={table.onChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={table.onChangeRowsPerPage}
              />
            )}
          </Card>
        </DashboardContent>
      )}
    </>
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
    } else {
      setSelected([]);
      return;
    }
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

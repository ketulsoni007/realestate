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
import {
  OpenPropertyImport,
  propertyExampleApi,
  propertyExportApi,
  propertyListApi,
} from 'src/store/Slices/propertySlice';
import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { TableNoData } from '../table-no-data';
import { PropertyTableRow } from '../property-table-row';
import { PropertyTableHead } from '../property-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PropertyTableToolbar } from '../property-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import type { PropertyProps } from '../property-table-row';
import { TableEmptyData } from '../table-empty-data';
import { ButtonGroup, ClickAwayListener, Grow, Paper, Popper } from '@mui/material';
import { ArrowDropDownIcon } from '@mui/x-date-pickers';
import { MenuList } from '@mui/material';
import { MenuItem } from '@mui/material';
import moment from 'moment';
import { useAppDispatch, useAppSelector } from 'src/store';
import PropertyImportModal from '../property-import';
import PropertyFailedImportModal from '../propert-failed-import';
import TableLoading from 'src/components/tableLoading/table-loading';

// ----------------------------------------------------------------------

export function PropertyView() {
  const table = useTable();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state)=>state.auth.user);
  const Admin = user?.role?._id === "66ed5dc893048a3dada991a1";
  const PropertyData = useAppSelector((state) => state.property.ispropertyListData);
  const isOpenPropertyImport = useAppSelector((state) => state.property.isOpenPropertyImport);
  const isOpenPropertyFailedImportLog = useAppSelector((state) => state.property.isOpenPropertyFailedImportLog);
  const totalCount = PropertyData?.totalCount ?? 0;
  const properties =
    PropertyData?.properties && PropertyData?.properties?.length > 0
      ? PropertyData?.properties
      : [];
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [filterName, setFilterName] = useState('');
  const isApiStatus = useAppSelector((state: any) => state.property.isApiStatus);
  const loading = isApiStatus?.propertyListApi === 'loading';

  // Fetch properties when component mounts or when pagination changes
  useEffect(() => {
    dispatch(propertyListApi({ page: table.page, rowsPerPage: table.rowsPerPage }));
  }, [dispatch, table.page, table.rowsPerPage]); // Include page and rowsPerPage in the dependencies

  const dataFiltered: PropertyProps[] = applyFilter({
    inputData: properties, // Use properties from the Redux state instead of _users
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
          Properties
        </Typography>
        <ButtonGroup
          variant="contained"
          aria-label="Property actions with dropdown"
          ref={anchorRef}
          sx={{
            '& > :first-of-type': {
              borderColor: '#F9FaFB', // This will style the first button's border color
            },
          }}
        >
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => navigate('/property/add')}
          >
            New Property
          </Button>
          <Button
            size="small"
            color="inherit"
            aria-controls={open ? 'split-button-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-label="select action"
            aria-haspopup="menu"
            onClick={handleToggle}
          >
            <ArrowDropDownIcon />
          </Button>
        </ButtonGroup>
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current} // Attach the popper to the ButtonGroup using anchorRef
          role={undefined}
          transition
          disablePortal
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
              }}
            >
              <Card component={Paper} elevation={5}>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(propertyExampleApi({}))
                          .then((action) => {

                            // Check if action is a blob
                            const blob = action.payload; // This should now be a blob

                            // Create a download link
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            const formattedDateTime = moment().format('YYYY-MM-DD_HH-mm'); // Format to desired structure
                            link.download = `property_${formattedDateTime}.xlsx`; // Set the download filename

                            // Trigger download
                            link.click();
                          })
                          .catch((error) => {
                            console.error('Error during file export:', error);
                          });
                      }}
                    >
                      Download Example Excel
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        dispatch(propertyExportApi({ exportType: 'xlsx' }))
                          .then((action) => {

                            // Create a Blob from the payload (base64 or binary data)
                            const blob = new Blob([action.payload], {
                              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                            });

                            // Create a download link
                            const link = document.createElement('a');
                            link.href = URL.createObjectURL(blob);
                            const formattedDateTime = moment().format('YYYY-MM-DD_HH-mm'); // Format to desired structure
                            link.download = `property_${formattedDateTime}.xlsx`; // Adjust extension based on export type

                            // Trigger download
                            link.click();
                          })
                          .catch((error) => {
                            console.error('Error during file export:', error);
                          });
                      }}
                    >
                      Export File
                    </MenuItem>
                    <MenuItem onClick={() => dispatch(OpenPropertyImport(true))}>
                      Import Property
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Card>
            </Grow>
          )}
        </Popper>
      </Box>
      <Card>
        <PropertyTableToolbar
          table={table}
          page={properties?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page}
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
              <PropertyTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={totalCount} // Use totalCount from the fetched data
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    properties.map((property: any) => property._id) // Adjust according to your property structure
                  )
                }
                headLabel={[
                  { id: '' },
                  { id: 'title', label: 'Title' },
                  { id: 'price', label: 'Price' },
                  { id: 'status', label: 'Status' },
                  { id: 'type', label: 'Type' },
                  { id: 'area', label: 'Area' },
                  ...(Admin ? [{ id: 'featured', label: 'Featured' }] : []),
                  { id: 'isActive', label: 'Active' },
                  { id: '' },
                ]}
              />
              <TableBody>
              {loading ? (
                  <TableLoading rowsPerPage={table.rowsPerPage} columns={9} />
                ) : (
                dataFiltered.map((row) => (
                  <PropertyTableRow
                    table={table}
                    admin={Admin}
                    page={
                      properties?.length === 1 ? (table.page > 0 ? table.page - 1 : 0) : table.page
                    }
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
                {properties?.length === 0 && (
                  <TableEmptyData table="Property" route="/property/add" />
                )}
                {properties?.length !== 0 && notFound && <TableNoData searchQuery={filterName} />}
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
      {isOpenPropertyImport && <PropertyImportModal />}
      {isOpenPropertyFailedImportLog && <PropertyFailedImportModal />}
    </DashboardContent>
  );
}

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

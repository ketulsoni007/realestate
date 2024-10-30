import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { CONFIG } from 'src/config-global';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { countryDeleteApi, countryDetailApi, countryListApi } from 'src/store/Slices/countrySlice';
import { useAppDispatch } from 'src/store';
import { stateDeleteApi, stateDetailApi, stateListApi } from 'src/store/Slices/stateSlice';
import { cityDeleteApi, cityDetailApi, cityListApi } from 'src/store/Slices/citySlice';
import { areaDeleteApi, areaDetailApi, areaListApi } from 'src/store/Slices/areaSlice';
import useConfirmation from 'src/hooks/use-confirmation-modal';
import ConfirmationModal from 'src/components/modal/ConfirmationModal';

// ----------------------------------------------------------------------

export type AreaProps = {
  _id: string;
  name: string;
  city: any;
  isActive: any;
};

type AreaTableRowProps = {
  row: AreaProps;
  page: any;
  rowsPerPage: any;
  selected: boolean;
  table: any;
  onSelectRow: () => void;
};

export function AreaTableRow({
  row,
  selected,
  onSelectRow,
  page,
  rowsPerPage,
  table,
}: AreaTableRowProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const {
    showConfirmation,
    isOpen,
    title,
    description,
    confirmButtonText,
    showCancelButton,
    handleConfirm,
    handleCancel,
  } = useConfirmation();
  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell>{row?.name}</TableCell>

        <TableCell>{row?.city?.name}</TableCell>
        <TableCell>{row?.city?.state?.name}</TableCell>
        <TableCell>{row?.city?.state?.country?.name}</TableCell>
        <TableCell>
          <Label color={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Yes' : 'No'}</Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem
            onClick={() => {
              dispatch(areaDetailApi({ _id: row?._id })).then((action) => {
                if (action?.meta?.requestStatus === 'fulfilled') {
                  navigate(`/area/edit/${row?._id}`);
                } else if (action?.meta?.requestStatus === 'rejected') {
                  const message = action?.payload?.message ?? 'Something went wrong';
                  const status = action?.payload?.status ?? 410;
                  const errors = action?.payload?.errors ?? [];
                  toastNotificationAdmin.error(message);
                }
              });
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem
            onClick={() => {
              showConfirmation({
                title: 'Confirm Deletion',
                description: 'Are you sure you want to delete this item?',
                confirmButtonText: 'Yes, delete it!',
              }).then((result) => {
                if (result) {
                  dispatch(areaDeleteApi({ ids: [row?._id] })).then((action: any) => {
                    if (action?.meta?.requestStatus === 'fulfilled') {
                      dispatch(areaListApi({ page: page, rowsPerPage: rowsPerPage }));
                      table.setSelected([]);
                      toastNotificationAdmin.success('Area deleted successfully');
                    } else if (action?.meta?.requestStatus === 'rejected') {
                      const message = action?.payload?.message ?? 'Something went wrong';
                      toastNotificationAdmin.error(message);
                    }
                  });
                }
              });
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
        <ConfirmationModal
          isOpen={isOpen}
          title={title}
          description={description}
          confirmButtonText={confirmButtonText}
          showCancelButton={showCancelButton}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      </Popover>
    </>
  );
}

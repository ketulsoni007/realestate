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
import { useAppDispatch } from 'src/store';
import { moduleDeleteApi, moduleDetailApi, moduleListApi } from 'src/store/Slices/moduleSlice';
import { sidebarApi } from 'src/store/Slices/commonSlice';
import useConfirmation from 'src/hooks/use-confirmation-modal';
import ConfirmationModal from 'src/components/modal/ConfirmationModal';
import userPermissionCheck from 'src/utils/user-permission-check';

// ----------------------------------------------------------------------

export type ModuleProps = {
  _id: string;
  name: string;
  icon: string;
  route: string | undefined | null;
  order: string;
  isActive: any;
};

type ModuleTableRowProps = {
  row: ModuleProps;
  page: any;
  rowsPerPage: any;
  selected: boolean;
  table: any;
  onSelectRow: () => void;
};

export function ModuleTableRow({
  row,
  selected,
  onSelectRow,
  page,
  rowsPerPage,
  table,
}: ModuleTableRowProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const canEditModule = userPermissionCheck('Role Management', 'can_edit', 'Module');
  const canDeleteModule = userPermissionCheck('Role Management', 'can_delete', 'Module');
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

        <TableCell>{row?.icon}</TableCell>
        <TableCell>{row?.route}</TableCell>
        <TableCell>{row?.order}</TableCell>
        <TableCell>
          <Label color={row.isActive ? 'success' : 'error'}>{row.isActive ? 'Yes' : 'No'}</Label>
        </TableCell>
        {canEditModule || canDeleteModule ? (
          <TableCell align="right">
            <IconButton onClick={handleOpenPopover}>
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </TableCell>
        ) : null}
      </TableRow>
      {canEditModule || canDeleteModule ? (
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
            {canEditModule ? (
              <MenuItem
                onClick={() => {
                  dispatch(moduleDetailApi({ _id: row?._id })).then((action) => {
                    if (action?.meta?.requestStatus === 'fulfilled') {
                      navigate(`/module/edit/${row?._id}`);
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
            ) : null}
            {canDeleteModule ? (
              <MenuItem
                onClick={() => {
                  showConfirmation({
                    title: 'Confirm Deletion',
                    description: 'Are you sure you want to delete this item?',
                    confirmButtonText: 'Yes, delete it!',
                  }).then((result) => {
                    if (result) {
                      dispatch(moduleDeleteApi({ ids: [row?._id] })).then((action: any) => {
                        if (action?.meta?.requestStatus === 'fulfilled') {
                          dispatch(moduleListApi({ page: page, rowsPerPage: rowsPerPage }));
                          dispatch(sidebarApi({}));
                          table.setSelected([]);
                          toastNotificationAdmin.success('Module deleted successfully');
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
            ) : null}
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
      ) : null}
    </>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Switch,
  Chip,
  Grid,
  ListItemButton,
  Skeleton,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  roleListApi,
  OpenAccessPannelModal,
  accessPannelUpdateApi,
} from 'src/store/Slices/permissionSlice';
import { CommonButton } from 'src/components/InputFields/field';

interface Role {
  _id: string;
  role: { name: string,purpose:string };
  access: boolean;
}

const AdminPannelAccess = () => {
  const dispatch = useAppDispatch();
  const isOpenAccessPannelModal = useAppSelector(
    (state) => state.permission.isOpenAccessPannelModal
  );
  const isRoleList = useAppSelector((state) => state.permission.isRoleList);
  const isApiStatus = useAppSelector((state) => state.permission.isApiStatus);

  // Optimistic UI Update
  const handleToggle = (event: boolean, id: string) => {
    dispatch(accessPannelUpdateApi({ access: event, _id: id })).then(() => {
      // Optionally refetch the list to ensure data is up to date
      dispatch(roleListApi({ type: 'Access' }));
    });
  };

  useEffect(() => {
    dispatch(roleListApi({ type: 'Access' }));
  }, [dispatch]);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: '90%',
    maxWidth: '1020px',
    maxHeight: '90%',
    overflowY: 'auto',
    boxShadow: 24,
    borderRadius: 2,
    zIndex: 999999,
    p: 4,
  };

  return (
    <Modal
      aria-labelledby="manage-role-modal-title"
      aria-describedby="manage-role-modal-description"
      open={isOpenAccessPannelModal}
      onClose={() => dispatch(OpenAccessPannelModal(false))}
      sx={{ width: 'auto' }}
    >
      <Box sx={style}>
        <Typography id="manage-role-modal-title" variant="h5" component="h2" mb={1}>
          Who has Access?
        </Typography>
        <Typography id="manage-role-modal-description" variant="h6" component="h2" mb={1}>
          Control who has access to admin panel.
        </Typography>
        <Grid container spacing={2}>
          {isApiStatus?.roleListApi === 'loading' ? (
            <Grid item xs={12}>
              <List component="nav" aria-label="role list">
                {Array.from({ length: 10 }).map((_, index) => (
                  <ListItem disableGutters disablePadding key={index}>
                    <ListItemButton disableGutters>
                      <Skeleton variant="rectangular" height="30px" width="100%" />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Grid>
          ) : (
            <Grid item xs={12}>
              <List>
                {isRoleList?.length > 0 &&
                  isRoleList.map((role: Role) => (
                    <ListItem key={role._id}>
                      <ListItemText
                        primary={role.role.purpose}
                        secondary={
                          <Chip
                            label={role.access ? 'Access' : 'No Access'}
                            color={role.access ? 'success' : 'default'}
                            size="small"
                          />
                        }
                      />
                      <Switch
                        edge="end"
                        checked={role.access}
                        onChange={(e) => handleToggle(e.target.checked, role._id)}
                        inputProps={{
                          'aria-labelledby': `switch-list-label-${role.role.name}`,
                        }}
                      />
                    </ListItem>
                  ))}
              </List>
            </Grid>
          )}
          <Grid item xs={12}>
            <Box>
              <CommonButton
                type="button"
                stylings={{ mr: 0 }}
                themeMode="dark"
                onClick={() => dispatch(OpenAccessPannelModal(false))}
              >
                Cancel
              </CommonButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default AdminPannelAccess;

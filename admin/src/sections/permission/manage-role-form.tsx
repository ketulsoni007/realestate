import React, { useEffect, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  ListItem,
  Checkbox,
  IconButton,
  Chip,
  Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAppDispatch, useAppSelector } from 'src/store';
import {
  OpenRoleCreateModal,
  OpenRoleManageModal,
  RoleEditModalData,
  roleDeleteApi,
  roleListApi,
} from 'src/store/Slices/permissionSlice';
import { CommonButton } from 'src/components/InputFields/field';
import useConfirmation from 'src/hooks/use-confirmation-modal';
import ConfirmationModal from 'src/components/modal/ConfirmationModal';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import CreateRole from './create-role-form';
import { Skeleton } from '@mui/material';

// Define the Role interface
interface Role {
  _id: string;
  purpose: string;
  name: string;
  isActive: boolean;
}

const ManageRole = () => {
  const dispatch = useAppDispatch();
  const isOpenRoleManageModal = useAppSelector((state) => state.permission.isOpenRoleManageModal);
  const isOpenRoleCreateModal = useAppSelector((state) => state.permission.isOpenRoleCreateModal);
  const isRoleList = useAppSelector((state) => state.permission.isRoleList);
  const isApiStatus = useAppSelector((state) => state.permission.isApiStatus);
  const AllRoles: Role[] = isRoleList && isRoleList.length > 0 ? isRoleList : [];

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

  const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]); // Specify the state type

  useEffect(() => {
    dispatch(roleListApi({}));
  }, [dispatch]);

  const handleCheckboxChange = (roleId: string) => {
    setSelectedRoleIds((prevSelected) => {
      if (prevSelected.includes(roleId)) {
        return prevSelected.filter((id) => id !== roleId);
      } else {
        return [...prevSelected, roleId];
      }
    });
  };

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

  const handleDeleteRoles = async (roleId: any, event: any) => {
    const confirmed = await showConfirmation({
      title: 'Confirm Deletion',
      description: 'Are you sure you want to delete these roles?',
      confirmButtonText: 'Yes, delete it!',
    });
    if (confirmed) {
      if (event == 'selected') {
        dispatch(roleDeleteApi({ ids: selectedRoleIds })).then((action: any) => {
          if (action?.meta?.requestStatus === 'fulfilled') {
            dispatch(roleListApi({}));
            setSelectedRoleIds([]);
            toastNotificationAdmin.success('Role deleted successfully');
          } else if (action?.meta?.requestStatus === 'rejected') {
            const message = action?.payload?.message ?? 'Something went wrong';
            toastNotificationAdmin.error(message);
          }
        });
      } else if (event == 'click') {
        dispatch(roleDeleteApi({ ids: [roleId] })).then((action: any) => {
          if (action?.meta?.requestStatus === 'fulfilled') {
            dispatch(roleListApi({}));
            toastNotificationAdmin.success('Role deleted successfully');
          } else if (action?.meta?.requestStatus === 'rejected') {
            const message = action?.payload?.message ?? 'Something went wrong';
            toastNotificationAdmin.error(message);
          }
        });
      }
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="manage-role-modal-title"
        aria-describedby="manage-role-modal-description"
        open={isOpenRoleManageModal}
        onClose={() => dispatch(OpenRoleManageModal(false))}
        sx={{ width: 'auto' }}
      >
        <Box sx={style}>
          <Typography id="manage-role-modal-title" variant="h6" component="h2" mb={1}>
            Manage Role
          </Typography>
          <Grid container spacing={2}>
            {isApiStatus && isApiStatus?.roleListApi === 'loading' ? (
              <>
                <Grid item xs={12} spacing={1}>
                  <List component="nav" aria-label="role list">
                    {Array.from({ length: 10 }).map((_, index) => (
                      <ListItem disableGutters disablePadding key={index}>
                        <ListItemButton disableGutters>
                          <Skeleton variant="rectangular" height={'30px'} width="100%" />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <List component="nav" aria-label="role list">
                  {AllRoles.map((role: Role) => (
                    <React.Fragment key={role._id}>
                      <ListItem disablePadding>
                        <Checkbox
                          edge="start"
                          checked={selectedRoleIds.includes(role._id)}
                          onChange={() => handleCheckboxChange(role._id)}
                        />
                        <ListItemButton>
                          <ListItemText
                            primary={role.purpose}
                            secondary={
                              <Chip
                                label={role.isActive ? 'Active' : 'Inactive'}
                                color={role.isActive ? 'success' : 'error'}
                                size="small"
                              />
                            }
                          />
                        </ListItemButton>
                        <Box>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            sx={{
                              background: '#131313',
                              border: '1px solid #131313',
                              color: '#FFF',
                              mr: 2,
                              '&:hover': {
                                background: '#FFF',
                                color: '#131313',
                                border: '1px solid #131313',
                              },
                            }}
                            onClick={() => {
                              dispatch(RoleEditModalData(role));
                              dispatch(OpenRoleCreateModal(true));
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            sx={{
                              background: '#FF5630',
                              border: '1px solid #FF5630',
                              color: '#FFF',
                              '&:hover': {
                                background: 'rgba(255,86,48,0.2)',
                                color: '#FFF',
                                border: '1px solid rgba(255,86,48,0.2)',
                              },
                            }}
                            onClick={() => handleDeleteRoles(role._id, 'click')} // Open confirmation on delete
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Grid>
            )}

            <Grid item xs={12}>
              <Box>
                {selectedRoleIds.length > 0 && (
                  <CommonButton
                    type="button"
                    stylings={{ mr: 2, ml: 1 }}
                    onClick={() => handleDeleteRoles('', 'selected')}
                  >
                    Delete
                  </CommonButton>
                )}
                <CommonButton
                  type="button"
                  stylings={{ mr: 0 }}
                  themeMode="dark"
                  onClick={() => dispatch(OpenRoleManageModal(false))}
                >
                  Cancel
                </CommonButton>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Modal>
      <ConfirmationModal
        isOpen={isOpen} // Ensure this is managed correctly to show/hide
        title={title}
        description={description}
        confirmButtonText={confirmButtonText}
        showCancelButton={showCancelButton}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      {isOpenRoleCreateModal && <CreateRole />}
    </>
  );
};

export default ManageRole;

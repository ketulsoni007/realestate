import {
  Box,
  Card,
  Grid,
  Stack,
  FormControlLabel,
  Checkbox,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItemButton,
  ListItemIcon,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { useEffect, useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'src/store';
import { moduleStoreApi, moduleUpdateApi } from 'src/store/Slices/moduleSlice';
import { sidebarApi } from 'src/store/Slices/commonSlice';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { CommonButton, CustomSelect } from 'src/components/InputFields/field';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import {
  OpenRoleCreateModal,
  OpenRoleManageModal,
  permissionStoreApi,
  roleDropdownApi,
  roleListApi,
  roleStoreApi,
} from 'src/store/Slices/permissionSlice';
import CreateRole from './create-role-form';
import { textGradient } from 'src/theme/styles';
import ManageRole from './manage-role-form';
import useConfirmation from 'src/hooks/use-confirmation-modal';
import ConfirmationModal from 'src/components/modal/ConfirmationModal';
import { Collapse } from '@mui/material';
import { ExpandLess, ExpandMore, ChevronRight } from '@mui/icons-material';

const PermissionForm = () => {
  const dispatch = useAppDispatch();
  const isSidebarList = useAppSelector((state) => state.common.isSideBarList);
  const isOpenRoleCreateModal = useAppSelector((state) => state.permission.isOpenRoleCreateModal);
  const isOpenRoleManageModal = useAppSelector((state) => state.permission.isOpenRoleManageModal);
  const isRoleList = useAppSelector((state) => state.permission.isRoleList);
  const isRoleDropdown = useAppSelector((state) => state.permission.isRoleDropdown);
  const [open, setOpen] = useState<{ [key: number]: boolean }>({});

  const handleToggle = (index: number) => {
    setOpen((prev: any) => ({ ...prev, [index]: !prev[index] }));
  };

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
  const navigate = useNavigate();

  const initialState = useMemo(
    () => ({
      roleId: isRoleList?._id || '', // Role name or identifier
      permissions:
        isRoleList?.permissions?.length > 0 &&
        isRoleList?.permissions.map((permission: any) => ({
          moduleName: permission.module.name,
          moduleId: permission.module._id, // ID of the module
          can_view: permission.can_view, // Permissions for the module
          can_edit: permission.can_edit,
          can_create: permission.can_create,
          can_delete: permission?.can_delete ? true : false,
          subModules:
            permission?.submodule?.length > 0
              ? permission.submodule.map((sub: any) => ({
                  subModuleName: sub.submodule.name,
                  subModuleId: sub.submodule._id, // ID of the submodule
                  can_view: sub.can_view, // Permissions for the submodule
                  can_edit: sub.can_edit,
                  can_create: sub.can_create,
                  can_delete: sub.can_delete,
                }))
              : [],
        })),
    }),
    [isRoleList]
  );

  useEffect(() => {
    dispatch(roleDropdownApi({}));
  }, []);

  const yupSchema = Yup.object({
    roleId: Yup.string().required('Role required'),
  });

  const handleSubmit = (values: any, { setErrors, setStatus, setSubmitting }: any) => {
    try {
      dispatch(permissionStoreApi(values))
        .then((action) => {
          if (action?.meta?.requestStatus === 'fulfilled') {
            toastNotificationAdmin.success('Role updated successfully');
          } else {
            const message = action?.payload?.message ?? 'Something went wrong';
            toastNotificationAdmin.error(message);
            setStatus({ error: message });
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    } catch (error) {
      console.error('An error occurred:', error);
      setStatus({ error: 'An unexpected error occurred.' });
      setSubmitting(false);
    }
  };

  return (
    <Box>
      <Formik
        initialValues={initialState}
        validationSchema={yupSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, touched, setFieldValue }) => {
          // console.log('values: ', JSON.stringify(values, null, 2));
          return (
            <Form>
              <Stack component={Card} elevation={4} sx={{ p: { lg: 4, xs: 2 }, mb: 3 }}>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid item>
                    <Typography variant="h5" fontWeight="bold">
                      Add Role
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display="flex" justifyContent="flex-end">
                      <CommonButton
                        type="button"
                        startIcon={<AddIcon />}
                        onClick={() => dispatch(OpenRoleCreateModal(true))}
                      >
                        Add Role
                      </CommonButton>
                      <CommonButton
                        type="button"
                        themeMode="dark"
                        startIcon={<ManageAccountsIcon />}
                        onClick={() => dispatch(OpenRoleManageModal(true))}
                      >
                        Manage Role
                      </CommonButton>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>

              <Stack component={Card} elevation={3} sx={{ p: { lg: 4, xs: 2 } }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Field name="roleId">
                      {({ field }: any) => (
                        <CustomSelect
                          {...field}
                          label="Role"
                          error={touched.roleId && !!errors.roleId}
                          helperText={touched.roleId && errors.roleId}
                          options={isRoleDropdown}
                          loading={false}
                          onChange={(e: any) => {
                            dispatch(roleListApi({ _id: e.target.value }));
                            setFieldValue('roleId', e.target.value);
                          }}
                        />
                      )}
                    </Field>
                  </Grid>
                  {/* {values?.permissions?.length > 0 &&
                    values?.permissions?.map((module: any, moduleIndex: number) => (
                      <Grid item xs={12} key={module.moduleId}>
                        <Box sx={{ background: '#f9f6f4', p: 2, borderRadius: 2, mb: 2 }}>
                          <Typography
                            variant="h6"
                            noWrap
                            sx={(theme) => ({
                              ...textGradient(
                                `to right, ${theme.vars.palette.secondary.main}, ${theme.vars.palette.warning.main}`
                              ),
                            })}
                          >
                            {module.moduleName}
                          </Typography>
                          {module.subModules.length === 0 && <Divider sx={{ my: 1 }} />}
                          {module.subModules.length === 0 && (
                            <Grid container spacing={2}>
                              {['can_view', 'can_edit', 'can_create', 'can_delete'].map(
                                (permission) => (
                                  <Grid item xs={3} key={permission}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={module[permission]}
                                          onChange={(e) =>
                                            setFieldValue(
                                              `permissions[${moduleIndex}].${permission}`,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      }
                                      label={`${permission.split('_')[1].charAt(0).toUpperCase() + permission.split('_')[1].slice(1)}`}
                                      // label={permission.replace('_', ' ').toUpperCase()}
                                    />
                                  </Grid>
                                )
                              )}
                            </Grid>
                          )}
                        </Box>
                        {module.subModules.map((subModule: any, subModuleIndex: number) => (
                          <Box
                            key={subModule.subModuleId}
                            ml={3}
                            sx={{ p: 2, borderRadius: 2, background: '#feeef3', mb: 2 }}
                          >
                            <Typography
                              variant="subtitle1"
                              noWrap
                              sx={(theme) => ({
                                ...textGradient(
                                  `to right, ${theme.vars.palette.warning.main}, ${theme.vars.palette.secondary.main}`
                                ),
                              })}
                            >
                              {subModule.subModuleName}
                            </Typography>
                            <Grid container spacing={2}>
                              {['can_view', 'can_edit', 'can_create', 'can_delete'].map(
                                (permission) => (
                                  <Grid item xs={3} key={permission}>
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          checked={subModule[permission]}
                                          onChange={(e) =>
                                            setFieldValue(
                                              `permissions[${moduleIndex}].subModules[${subModuleIndex}].${permission}`,
                                              e.target.checked
                                            )
                                          }
                                        />
                                      }
                                      label={`${permission.split('_')[1].charAt(0).toUpperCase() + permission.split('_')[1].slice(1)}`}
                                      // label={permission.replace('_', ' ').toUpperCase()}
                                    />
                                  </Grid>
                                )
                              )}
                            </Grid>
                          </Box>
                        ))}
                      </Grid>
                    ))} */}
                  <Grid item xs={12}>
                    {values?.permissions?.length > 0 && (
                      <List>
                        {values?.permissions?.map((module: any, moduleIndex: number) => (
                          <Box key={module.moduleId}>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  width="100%"
                                >
                                  <ListItemText primary={module.moduleName} />
                                  <Box display="flex" gap={2} mr={module?.subModules && module?.subModules?.length === 0 ? 4 : 0}>
                                    {['can_view', 'can_edit', 'can_create', 'can_delete'].map(
                                      (permission, index) => (
                                        <Box
                                          key={permission}
                                          display="flex"
                                          flexDirection="column"
                                          alignItems="center"
                                        >
                                          <Typography variant="caption" display="block">
                                            {['View', 'Edit', 'Create', 'Delete'][index]}
                                          </Typography>
                                          <Checkbox
                                            checked={module[permission]}
                                            onChange={(e) =>
                                              setFieldValue(
                                                `permissions[${moduleIndex}].${permission}`,
                                                e.target.checked
                                              )
                                            }
                                          />
                                        </Box>
                                      )
                                    )}
                                  </Box>
                                  {module.subModules.length > 0 && (
                                    <IconButton
                                      edge="end"
                                      size="small"
                                      onClick={() => handleToggle(moduleIndex)}
                                    >
                                      {open[moduleIndex] ? <ExpandMore /> : <ChevronRight />}
                                    </IconButton>
                                  )}
                                </Box>
                              </ListItemButton>
                            </ListItem>
                            {module.subModules.length > 0 && (
                              <Collapse in={open[moduleIndex]} timeout="auto" unmountOnExit>
                                <Stepper orientation="vertical">
                                  {module.subModules.map(
                                    (subModule: any, subModuleIndex: number) => (
                                      <Step key={subModule.subModuleId} active>
                                        <StepLabel>
                                          <Box
                                            display="flex"
                                            justifyContent="space-between"
                                            alignItems="center"
                                            width="100%"
                                          >
                                            <ListItemText primary={subModule.subModuleName} />
                                            <Box display="flex" gap={2} mr={6}>
                                              {[
                                                'can_view',
                                                'can_edit',
                                                'can_create',
                                                'can_delete',
                                              ].map((permission, index) => (
                                                <Box
                                                  key={permission}
                                                  display="flex"
                                                  flexDirection="column"
                                                  alignItems="center"
                                                >
                                                  <Typography variant="caption" display="block">
                                                    {['View', 'Edit', 'Create', 'Delete'][index]}
                                                  </Typography>
                                                  <Checkbox
                                                    checked={subModule[permission]}
                                                    onChange={(e) =>
                                                      setFieldValue(
                                                        `permissions[${moduleIndex}].subModules[${subModuleIndex}].${permission}`,
                                                        e.target.checked
                                                      )
                                                    }
                                                  />
                                                </Box>
                                              ))}
                                            </Box>
                                          </Box>
                                        </StepLabel>
                                      </Step>
                                    )
                                  )}
                                </Stepper>
                              </Collapse>
                            )}
                            <Divider />
                          </Box>
                        ))}
                      </List>
                    )}
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <CommonButton type="submit" stylings={{ mr: 2 }}>
                    Update
                  </CommonButton>
                  <CommonButton type="button" themeMode="dark" onClick={() => navigate('/module')}>
                    Cancel
                  </CommonButton>
                </Box>
              </Stack>
            </Form>
          );
        }}
      </Formik>
      {isOpenRoleCreateModal && <CreateRole />}
      {isOpenRoleManageModal && <ManageRole />}
    </Box>
  );
};

export default PermissionForm;

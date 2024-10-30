// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from '@mui/material';
import { DashboardContent } from 'src/layouts/dashboard';
import { useSelector } from 'react-redux';
import ModuleForm from '../module-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toastNotificationAdmin } from 'src/components/CustomToastAdmin/CustomToastAdmin';
import { useEffect } from 'react';
import { moduleDetailApi } from 'src/store/Slices/moduleSlice';
import { useAppDispatch } from 'src/store';
import BarLoader from 'src/components/loader/bar-loader';
import userPermissionCheck from 'src/utils/user-permission-check';
import AccessDenied from 'src/components/accessDenied/access-denied';

// ----------------------------------------------------------------------

export function ModuleEditView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isModuleDetail = useSelector((state: any) => state.module.isModuleDetail);
  const isApiStatus = useSelector((state: any) => state.module.isApiStatus);
  const ModuleDetailLoading = isApiStatus?.moduleDetailApi === 'loading';
  const canEditModule = userPermissionCheck('Role Management', 'can_edit', 'Module');
  //   const { t } = useTranslation();
  useEffect(() => {
    const fetchModuleDetail = async () => {
      // Only fetch if we do not have the module detail or it's a different module ID
      if (!isModuleDetail || id !== isModuleDetail?._id) {
        const action = await dispatch(moduleDetailApi({ _id: id }));

        if (action?.meta?.requestStatus === 'fulfilled') {
          // Handle successful response if needed
        } else if (action?.meta?.requestStatus === 'rejected') {
          const message = action?.payload?.message ?? 'Something went wrong';
          const status = action?.payload?.status ?? 410;
          const errors = action?.payload?.errors ?? [];
          navigate('/module');
          toastNotificationAdmin.error(message);
        }
      }
    };

    fetchModuleDetail();
  }, [id, dispatch, isModuleDetail, navigate]); // Ensure correct dependencies

  return (
    <>
      {canEditModule === 'loading' ? (
        <BarLoader />
      ) : canEditModule ? (
        <DashboardContent>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Update Module
          </Typography>
          {ModuleDetailLoading ? <BarLoader /> : <ModuleForm currentModule={isModuleDetail} />}
        </DashboardContent>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}

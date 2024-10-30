// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { DashboardContent } from 'src/layouts/dashboard';
import { Typography } from '@mui/material';
import ModuleForm from '../module-form';
import userPermissionCheck from 'src/utils/user-permission-check';
import AccessDenied from 'src/components/accessDenied/access-denied';
import BarLoader from 'src/components/loader/bar-loader';

// ----------------------------------------------------------------------

export function ModuleCreateView() {
  //   const { t } = useTranslation();
  const canAddModule = userPermissionCheck('Role Management', 'can_create', 'Module');

  return (
    <>
      {canAddModule === 'loading' ? (
        <BarLoader />
      ) : canAddModule ? (
        <DashboardContent>
          <Typography variant="h4" sx={{ mb: 5 }}>
            Create Module
          </Typography>
          <ModuleForm />
        </DashboardContent>
      ) : (
        <AccessDenied />
      )}
    </>
  );
}

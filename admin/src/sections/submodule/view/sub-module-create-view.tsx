// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { DashboardContent } from 'src/layouts/dashboard';
import { Typography } from '@mui/material';
import SubModuleForm from '../sub-module-form';

// ----------------------------------------------------------------------

export function SubModuleCreateView() {
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create SubModule
        </Typography>
        <SubModuleForm />
      </DashboardContent>
    </>
  );
}

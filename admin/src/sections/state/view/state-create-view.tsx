// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { DashboardContent } from 'src/layouts/dashboard';
import CountryForm from '../state-form';
import { Typography } from '@mui/material';

// ----------------------------------------------------------------------

export function StateCreateView() {
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create State
        </Typography>
        <CountryForm />
      </DashboardContent>
    </>
  );
}

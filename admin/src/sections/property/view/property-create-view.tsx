// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { DashboardContent } from 'src/layouts/dashboard';
import PropertyForm from '../property-form';
import { Typography } from '@mui/material';
import { countryDropdownApi } from 'src/store/Slices/countrySlice';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/store';

// ----------------------------------------------------------------------

export function PropertyCreateView() {
  //   const { t } = useTranslation();
  const dispatch = useAppDispatch();
  
  useEffect(()=>{
    dispatch(countryDropdownApi({}))
  },[]);

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create Property
        </Typography>
        <PropertyForm />
      </DashboardContent>
    </>
  );
}

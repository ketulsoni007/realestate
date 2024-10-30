// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import CountryForm from "../country-form";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

export function CountryEditView() {
  const isCountryDetail = useSelector((state:any)=>state.country.isCountryDetail)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update Country
        </Typography>
        <CountryForm currentModule={isCountryDetail} />
      </DashboardContent>
    </>
  );
}

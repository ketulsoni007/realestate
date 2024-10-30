// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import CountryForm from "../state-form";
import { useSelector } from "react-redux";

// ----------------------------------------------------------------------

export function StateEditView() {
  const isStateDetail = useSelector((state:any)=>state.state.isStateDetail)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update State
        </Typography>
        <CountryForm currentModule={isStateDetail} />
      </DashboardContent>
    </>
  );
}

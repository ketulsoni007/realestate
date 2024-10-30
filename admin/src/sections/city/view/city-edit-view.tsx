// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useSelector } from "react-redux";
import CityForm from "../city-form";

// ----------------------------------------------------------------------

export function CityEditView() {
  const isCityDetail = useSelector((state:any)=>state.city.isCityDetail)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update City
        </Typography>
        <CityForm currentModule={isCityDetail} />
      </DashboardContent>
    </>
  );
}

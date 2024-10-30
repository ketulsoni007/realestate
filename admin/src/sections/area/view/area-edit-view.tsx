// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useSelector } from "react-redux";
import AreaForm from "../area-form";

// ----------------------------------------------------------------------

export function AreaEditView() {
  const isAreaDetail = useSelector((state:any)=>state.area.isAreaDetail)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update Area
        </Typography>
        <AreaForm currentModule={isAreaDetail} />
      </DashboardContent>
    </>
  );
}

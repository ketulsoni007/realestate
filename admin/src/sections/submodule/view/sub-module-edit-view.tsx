// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useSelector } from "react-redux";
import SubModuleForm from "../sub-module-form";

// ----------------------------------------------------------------------

export function SubModuleEditView() {
  const isSubModuleDetail = useSelector((state:any)=>state.subModule.isSubModuleDetail)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update SubModule
        </Typography>
        <SubModuleForm currentModule={isSubModuleDetail} />
      </DashboardContent>
    </>
  );
}

// import { paths } from 'src/routes/paths';
// import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';
// import { useTranslation } from 'react-i18next';
// import { DashboardContent } from 'src/layouts/dashboard';
// import { ModuleForm } from '../module-form';

import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import PropertyForm from "../property-form";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { stateDropdownApi } from "src/store/Slices/stateSlice";
import { cityDropdownApi } from "src/store/Slices/citySlice";
import { areaDropdownApi } from "src/store/Slices/areaSlice";
import { useAppDispatch } from "src/store";

// ----------------------------------------------------------------------

export function PropertyEditView() {
  const dispatch = useAppDispatch();
  const isPropertyDetail = useSelector((state:any)=>state.property.isPropertyDetail);
  //   const { t } = useTranslation();
  useEffect(()=>{
    if(isPropertyDetail){
      dispatch(stateDropdownApi({_id:isPropertyDetail?.address?.country}));
      dispatch(cityDropdownApi({_id:isPropertyDetail?.address?.state}));
      dispatch(areaDropdownApi({_id:isPropertyDetail?.address?.city}));
    }
  },[isPropertyDetail])

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update Property
        </Typography>
        <PropertyForm currentModule={isPropertyDetail} />
      </DashboardContent>
    </>
  );
}

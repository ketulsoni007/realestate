import { Typography } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { useSelector } from "react-redux";
import ProfileForm from "../profile-form";

// ----------------------------------------------------------------------

export function ProfileUpdateView() {
  const user = useSelector((state:any)=>state.auth.user)
  //   const { t } = useTranslation();

  return (
    <>
      <DashboardContent>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Update Profile
        </Typography>
        <ProfileForm currentModule={user} />
      </DashboardContent>
    </>
  );
}

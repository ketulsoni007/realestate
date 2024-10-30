import { Avatar, Box } from '@mui/material';

const AccessDenied = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
      <Avatar
        src={'/assets/images/403-1.png'}
        sx={{ objectFit: 'contain', borderRadius: 0, width: 320, height: 320 }}
      />
    </Box>
  );
};

export default AccessDenied;

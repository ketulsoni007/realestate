import React from 'react';
import { Modal, Box, Typography, Button, Grid, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import { OpenPropertyImport } from 'src/store/Slices/propertySlice';

const PropertyImportModal = () => {
  const dispatch = useAppDispatch();
  const isOpenPropertyImport = useAppSelector((state) => state.property.isOpenPropertyImport);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: {md:'720px',sm:'520px',xs:'320px'},
    p: 4,
    boxShadow: 24,
    borderRadius: 2,
    textAlign: 'center',
  };

  return (
    <Modal open={isOpenPropertyImport} onClose={() => dispatch(OpenPropertyImport(false))}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Import Property
        </Typography>
        <Alert severity="info">
          Some columns contain dropdown selections. In order to work correctly, please use
          values from the dropdown.
        </Alert>
        {/* <Grid container spacing={2}>
          <Grid item xs={showCancelButton ? 6 : 12}>
            <CommonButton type='button' onClick={onConfirm} fullWidth>
              {confirmButtonText}
            </CommonButton>
          </Grid>
          {showCancelButton && (
            <Grid item xs={6}>
              <CommonButton type='button' themeMode='dark' onClick={onCancel} fullWidth>
                Cancel
              </CommonButton>
            </Grid>
          )}
        </Grid> */}
      </Box>
    </Modal>
  );
};

export default PropertyImportModal;

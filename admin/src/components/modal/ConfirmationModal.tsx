import React from 'react';
import { Modal, Box, Typography, Button, Grid } from '@mui/material';
import { CommonButton } from '../InputFields/field';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  showCancelButton?: boolean;
  confirmButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  description,
  showCancelButton = true,
  confirmButtonText,
  onConfirm,
  onCancel
}) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: '400px',
    p: 4,
    boxShadow: 24,
    borderRadius: 2,
    textAlign: 'center'
  };

  return (
    <Modal open={isOpen} onClose={onCancel}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {title}
        </Typography>
        <Typography variant="body2" mb={3}>
          {description}
        </Typography>
        <Grid container spacing={2}>
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
        </Grid>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

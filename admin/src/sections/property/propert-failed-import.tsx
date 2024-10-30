import React from 'react';
import { Modal, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert, Tooltip, IconButton } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'src/store';
import { OpenPropertyFailedImportLog } from 'src/store/Slices/propertySlice';
import { CommonButton } from 'src/components/InputFields/field';
import InfoIcon from '@mui/icons-material/Info';

const PropertyFailedImportModal = () => {
  const dispatch = useAppDispatch();
  const isOpenPropertyFailedImportLog = useAppSelector((state) => state.property.isOpenPropertyFailedImportLog);
  const isPropertyFailedImportLog = useAppSelector((state) => state.property.isPropertyFailedImportLog);
  // console.log('isPropertyFailedImportLog: ', isPropertyFailedImportLog);
  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    width: { md: '720px', sm: '520px', xs: '320px' },
    height: 'calc(100vh - 100px)', // Fixed height for the modal
    boxShadow: 24,
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
  };

  const headerStyle = {
    padding: 2,
    borderBottom: '1px solid #EEE',
  };

  const contentStyle = {
    flex: 1,
    overflowY: 'auto', // Make content area scrollable
    padding: 2,
    maxHeight: 'calc(100vh - 100px)',
  };

  const footerStyle = {
    padding: 2,
    borderTop: '1px solid #EEE',
  };

  return (
    <Modal
      open={isOpenPropertyFailedImportLog}
      onClose={() => dispatch(OpenPropertyFailedImportLog({ open: false, data: [] }))}
      sx={{ zIndex: 9999 }}
    >
      <Box sx={modalStyle}>
        {/* Header Section */}
        <Box sx={headerStyle}>
          <Typography variant="h6" mb={2}>
            Import Failed
          </Typography>
          <Alert severity="error" sx={{ display: 'flex', alignItems: 'center' }}>
            Some properties could not be imported for the following reasons:
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  height: '10px',
                  width: '10px',
                  backgroundColor: 'rgba(255, 86, 48, 0.8)',
                  borderRadius: '50%',
                  mr: 1,
                }}
              />
              <Typography>Error in the column</Typography>
            </Box>
          </Alert>
        </Box>

        {/* Content Section */}
        <Box sx={contentStyle}>
          <TableContainer component={Paper}>
            <Table sx={{ width: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>State</TableCell>
                  <TableCell>City</TableCell>
                  <TableCell>Area</TableCell>
                  <TableCell>Street</TableCell>
                  <TableCell>Zip Code</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Bedrooms</TableCell>
                  <TableCell>Bathrooms</TableCell>
                  <TableCell>Square Footage</TableCell>
                  <TableCell>Lot Size</TableCell>
                  <TableCell>Year Built</TableCell>
                  <TableCell>Availability</TableCell>
                  <TableCell>Error</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isPropertyFailedImportLog.map((item: any, index: number) => {
                  return (
                    <TableRow
                      key={index}
                      sx={{ borderBottom: index === isPropertyFailedImportLog.length - 1 ? 'none' : '1px solid #EEE' }}
                    >
                      <TableCell sx={{ backgroundColor: item?.errors?.title ? 'rgba(255, 86, 48, 0.8)' : 'none',position:'relative' }}>{item?.property?.title}</TableCell>
                      <TableCell
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 1,  // Limits to 2 lines
                          WebkitBoxOrient: 'vertical',
                          whiteSpace: 'normal',
                        }}
                        dangerouslySetInnerHTML={{ __html: item.property.description }}
                      ></TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.price ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.price}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.country ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.country}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.state ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.state}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.city ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.city}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.area ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.area}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.street ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.street?.length > 12 ? `${item.property.street.substring(0, 12)}...` : item.property.street}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.zip_code ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.zip_code}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.status ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.status}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.type ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.type}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.bedrooms ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.bedrooms}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.bathrooms ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.bathrooms}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.square_footage ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.square_footage}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.lot_size ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.lot_size}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.year_built ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.year_built}</TableCell>
                      <TableCell sx={{ backgroundColor: item?.errors?.availability ? 'rgba(255, 86, 48, 0.8)' : 'none' }}>{item.property.availability}</TableCell>
                      <TableCell sx={{ display: 'flex', alignItems: 'center' }}><Box sx={{ height: '10px', width: '10px', backgroundColor: 'rgba(255, 86, 48, 0.8)', borderRadius: '50%', mr: 1 }} />error</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Footer Section */}
        <Box sx={footerStyle}>
          <CommonButton
            type="button"
            themeMode="dark"
            onClick={() => dispatch(OpenPropertyFailedImportLog({ open: false, data: [] }))}
            fullWidth
          >
            OK
          </CommonButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default PropertyFailedImportModal;

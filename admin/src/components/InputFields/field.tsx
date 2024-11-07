import React, { useCallback, useEffect, useState } from 'react';
import {
  TextField,
  IconButton,
  Avatar,
  InputAdornment,
  FormControl,
  Button,
  Typography,
  InputLabel,
  Select as MUISelect,
  MenuItem,
  FormHelperText,
  Divider,
  Box,
  Stack,
  Grid,
  Paper,
  FormControlLabel,
  Switch,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import { Accept, useDropzone } from 'react-dropzone';
import ReactQuill from 'react-quill';
import { DatePicker, LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from 'moment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { CONFIG } from 'src/config-global';
import styled, { CSSObject } from '@emotion/styled';
import { Theme } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { toastNotificationAdmin } from '../CustomToastAdmin/CustomToastAdmin';

export const TextInput = ({ name, onChange, value, label, ...props }: any) => {
  return (
    <TextField
      name={name}
      onChange={onChange}
      value={value}
      label={label}
      variant="outlined"
      fullWidth
      size="small"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        '& .MuiFormHelperText-root': {
          marginLeft: '0px',
        },
      }}
      {...props}
    />
  );
};

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const CustomVideo = ({ field, form, label, error, helperText, ...props }: any) => {
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Handle video file selection and preview
  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      setVideoPreview(videoURL);
      form.setFieldValue(field.name, file); // Update Formik field value
    }
  };

  return (
    <Box>
      {/* Button with hidden file input */}
      <Button
        component="label"
        variant="outlined"
        fullWidth
        sx={{
          border: `1px dashed ${error ? 'rgba(255,86,48,0.5)' : '#637381'}`,
          backgroundColor: 'rgba(249,249,249,0.9)', // Background color
          padding: '0.50rem 2rem',
          color: error ? 'rgb(255,86,48)' : '#131313',
          fontWeight: '400',
          '&:hover': {
            backgroundColor: error ? 'rgba(255,86,48,0.2)' : 'rgba(236,236,236,1)',
            border: '1px dashed #637381',
          },
        }}
      >
        {label || 'Select Video'}
        <VisuallyHiddenInput
          type="file"
          accept="video/*"
          onChange={handleVideoChange}
          id={field.name}
          aria-label="Upload Video"
        />
      </Button>

      {/* Helper text for error */}
      {helperText && <Typography color="error">{helperText}</Typography>}

      {/* Video preview */}
      {videoPreview && (
        <Box mt={2}>
          <video controls src={videoPreview} width="100%" style={{ borderRadius: '4px', height: '200px' }} />
        </Box>
      )}
    </Box>
  );
};


export const CustomDatePicker = ({
  name,
  attribute,
  error,
  helperText,
  value,
  setFieldValue,
  label,
}: any) => {
  const isYearOnly = attribute === 'Y';

  const [selectedDate, setSelectedDate] = useState<Moment | null>(
    value ? moment(`${value}-01-01`) : null
  );

  useEffect(() => {
    setSelectedDate(value ? moment(`${value}-01-01`) : null);
  }, [value]);

  const handleChange = (newValue: any) => {
    setSelectedDate(newValue);
    setFieldValue(name, newValue ? newValue.year() : '');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <MobileDatePicker
        label={label || 'Pick a date'}
        views={isYearOnly ? ['year'] : ['year', 'month', 'day']}
        value={selectedDate}
        onChange={handleChange}
        sx={{ width: '100%' }}
      />
    </LocalizationProvider>
  );
};

// PasswordInput component
export const PasswordInput = ({ name, onChange, value, label, ...props }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleMouseDownPassword = (event: any) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ width: '100%', mb: 2 }} variant="outlined">
      <TextField
        name={name}
        onChange={onChange}
        value={value}
        label={label}
        type={showPassword ? 'text' : 'password'}
        fullWidth
        size="small"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                sx={{ color: '#1C252E' }}
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: '#fff',
          color: '#000',
          '& .MuiFormHelperText-root': {
            marginLeft: '0px',
          },
        }}
        {...props}
      />
    </FormControl>
  );
};

const StyledSwitchIos = styled(Switch)(
  ({ theme }: { theme: Theme }): CSSObject => ({
    width: 42,
    height: 26,
    padding: 0,
    // '& .MuiSwitch-switchBase': {
    //   padding: 0,
    //   margin: 2,
    //   transitionDuration: '300ms',
    //   '&.Mui-checked': {
    //     transform: 'translateX(16px)',
    //     color: '#fff',
    //     '& + .MuiSwitch-track': {
    //       backgroundColor: '#65C466',
    //       opacity: 1,
    //       border: 0,
    //       ...theme.applyStyles('dark', {
    //         backgroundColor: '#2ECA45',
    //       }),
    //     },
    //     '&.Mui-disabled + .MuiSwitch-track': {
    //       opacity: 0.5,
    //     },
    //   },
    //   '&.Mui-focusVisible .MuiSwitch-thumb': {
    //     color: '#33cf4d',
    //     border: '6px solid #fff',
    //   },
    //   '&.Mui-disabled .MuiSwitch-thumb': {
    //     color: theme.palette.grey[100],
    //     ...theme.applyStyles('dark', {
    //       color: theme.palette.grey[600],
    //     }),
    //   },
    //   '&.Mui-disabled + .MuiSwitch-track': {
    //     opacity: 0.7,
    //     ...theme.applyStyles('dark', {
    //       opacity: 0.3,
    //     }),
    //   },
    // },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    // '& .MuiSwitch-track': {
    //   borderRadius: 26 / 2,
    //   backgroundColor: '#E9E9EA',
    //   opacity: 1,
    //   transition: theme.transitions.create(['background-color'], {
    //     duration: 500,
    //   }),
    //   ...theme.applyStyles('dark', {
    //     backgroundColor: '#39393D',
    //   }),
    // },
  })
);

const StyledSwitch = styled(Switch)(
  ({ theme }: { theme: Theme }): CSSObject => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute' as CSSObject['position'], // Explicitly cast `position`
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main)
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  })
);

export const CustomSwitch = ({
  name,
  onChange,
  value,
  label,
  labelPlacement,
  error,
  helperText,
  ...props
}: any) => {
  return (
    <div>
      <FormControlLabel
        control={<StyledSwitch checked={value} onChange={onChange} name={name} {...props} />}
        label={label}
        labelPlacement={labelPlacement || 'end'}
      />
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </div>
  );
};

export const IconInput = ({
  name,
  onChange,
  value,
  label,
  icon,
  error,
  helperText,
  ...props
}: any) => {
  return (
    <TextField
      name={name}
      onChange={onChange}
      value={value}
      label={label}
      variant="outlined"
      fullWidth
      size="small"
      error={error} // Show error state if provided
      helperText={helperText} // Display helper text if provided
      InputProps={{
        startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
      }}
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        '& .MuiFormHelperText-root': {
          marginLeft: '0px',
        },
      }}
      {...props}
    />
  );
};

// TextArea component
export const CommonTextArea = ({ name, onChange, value, label, ...props }: any) => {
  return (
    <TextField
      name={name}
      onChange={onChange}
      value={value}
      label={label}
      variant="outlined"
      multiline
      rows={4}
      fullWidth
      size="small"
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        '& .MuiFormHelperText-root': {
          marginLeft: '0px',
        },
      }}
      {...props}
    />
  );
};

// CommonButton component
export const CommonButton = ({
  type = 'button',
  children,
  themeMode = 'primary',
  stylings,
  ...props
}: any) => {
  const isDarkMode = themeMode === 'dark';

  return (
    <Button
      type={type}
      sx={{
        background: isDarkMode ? '#1C252E' : '#1877F2', // Background changes based on the themeMode
        padding: '0.50rem 2rem',
        color: isDarkMode ? '#FFF' : '#FFF', // Text color (white in both themes)
        outline: isDarkMode ? '1px solid #1C252E' : '1px solid #1877F2', // Border color based on theme
        marginRight: 2,
        '&:hover': {
          outline: isDarkMode ? '1px solid #1C252E' : '1px solid #1877F2', // Border hover color
          color: isDarkMode ? '#1C252E' : '#1877F2', // Change color on hover
        },
        ...stylings, // Spread additional styles passed as props
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

// CustomText component
export const CustomText = ({ children, stylings, ...props }: any) => {
  return (
    <Typography
      sx={{
        color: '#131313',
        ...stylings,
      }}
      {...props}
    >
      {children}
    </Typography>
  );
};

// CustomDivider component
export const CustomDivider = ({ stylings, ...props }: any) => {
  return (
    <Divider
      sx={{
        borderColor: 'auto',
        ...stylings,
      }}
      {...props}
    />
  );
};

// CustomSelect component
export const CustomSelect = ({
  value,
  onChange,
  helperText,
  label,
  error,
  options = [],
  loading = false,
  noFound = '',
  ...props
}: any) => {
  return (
    <FormControl
      variant="outlined"
      size="small"
      fullWidth
      error={error}
      sx={{
        backgroundColor: '#fff',
        color: '#000',
        '& .MuiFormHelperText-root': {
          marginLeft: '0px',
        },
      }}
    >
      <InputLabel>{label}</InputLabel>
      <MUISelect value={value} onChange={onChange} label={label} {...props}>
        {loading ? (
          <MenuItem disabled>
            <CircularProgress size={24} />
            &nbsp;Loading...
          </MenuItem>
        ) : options && options.length > 0 ? (
          options.map((option: any) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>{noFound ? noFound : 'No options found'}</MenuItem>
        )}
      </MUISelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export const CommonDropZone = ({ uploadType = 'multiple', onUpload, setFieldValue, error, old_images }: any) => {
  const [files, setFiles] = useState<any[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const newFiles = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (uploadType === 'single') {
        setFiles([newFiles[0]]);
        setFieldValue('images', [newFiles[0]]);
      } else {
        setFiles((prev: any) => {
          const updatedFiles = [...prev, ...newFiles];
          setFieldValue('images', updatedFiles);
          return updatedFiles;
        });
      }

      if (onUpload) {
        onUpload(newFiles);
      }
    },
    [uploadType, onUpload, setFieldValue]
  );

  const handleRemoveFile = (index: any) => {
    setFiles((prevFiles: any) => {
      const updatedFiles = prevFiles.filter((_: any, i: any) => i !== index);
      setFieldValue('images', updatedFiles);
      return updatedFiles;
    });
  };

  const handleRemoveOldFile = (index: any) => {
    const updatedOldImages = old_images.filter((_: any, i: any) => i !== index);
    setFieldValue('old_images', updatedOldImages);
  };

  const { getRootProps, getInputProps }: any = useDropzone({
    onDrop,
    accept: {
      'image/*': [],  // Accept all image file types
      'video/*': [],  // Accept all video file types
    } as Accept,
    multiple: uploadType === 'multiple',
  });

  return (
    <Stack spacing={error ? 1 : 2}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        {...getRootProps()}
        sx={{
          p: 2,
          height: 200,
          border: `1px dashed ${error ? 'rgba(255,86,48,0.5)' : '#637381'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: error ? 'rgba(255,86,48,0.2)' : '#f9f9f9',
          '&:hover': { backgroundColor: error ? 'rgba(255,86,48,0.3)' : '#f1f1f1' },
        }}
      >
        <input {...getInputProps()} />
        <Avatar
          src={'/assets/illustrations/illustration-file.svg'}
          sx={{ objectFit: 'contain', borderRadius: 0, width: 150, height: 150 }}
        />
        <Typography variant="body1">
          Drag and drop some files here, or click to select files
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" sx={{ gap: 1 }}>
        {old_images?.length > 0 &&
          old_images.map((file: any, index: any) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              component={Paper}
              elevation={1}
              sx={{
                width: 100,
                height: 100,
                p: 1,
                border: '1px solid #EEE',
              }}
            >
              <Avatar
                src={`${CONFIG.IMAGE_URL}/property/${file.image}`}
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 0,
                }}
              />
              <IconButton
                onClick={() => handleRemoveOldFile(index)}
                size="small"
                color="error"
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        {files.map((file: any, index: any) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            component={Paper}
            elevation={1}
            sx={{
              width: 100,
              height: 100,
              p: 1,
              border: '1px solid #EEE',
            }}
          >
            {/* <Avatar
              src={file.preview}
              alt={file.name}
              sx={{
                width: 90,
                height: 90,
                borderRadius: 0,
              }}
            /> */}
             {file.type.startsWith('image/') ? (
              <Avatar
                src={file.preview}
                alt={file.name}
                sx={{
                  width: 90,
                  height: 90,
                  borderRadius: 0,
                }}
              />
            ) : (
              <video
                src={file.preview}
                controls
                width={90}
                height={90}
                autoPlay
                style={{ objectFit: 'cover', borderRadius: 0 }}
              />
            )}
            <IconButton
              onClick={() => handleRemoveFile(index)}
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export const CommonExcellDropZone = ({ uploadType = 'single', onUpload, setFieldValue, error }: any) => {
  const [files, setFiles] = useState<any[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: any, rejectedFiles: any) => {
      if (rejectedFiles.length > 0) {
        toastNotificationAdmin.error('Invalid file type! Please upload an Excel or CSV file.')
        return;
      }
      const newFiles = acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      if (uploadType === 'single') {
        setFiles([newFiles[0]]);
        setFieldValue('file', [newFiles[0]]);
      } else {
        setFiles((prev: any) => {
          const updatedFiles = [...prev, ...newFiles];
          setFieldValue('file', updatedFiles);
          return updatedFiles;
        });
      }

      if (onUpload) {
        onUpload(newFiles);
      }
    },
    [uploadType, onUpload, setFieldValue]
  );

  const handleRemoveFile = (index: any) => {
    setFiles((prevFiles: any) => {
      const updatedFiles = prevFiles.filter((_: any, i: any) => i !== index);
      setFieldValue('file', updatedFiles);
      return updatedFiles;
    });
  };

  const { getRootProps, getInputProps }: any = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [], // Excel files
      'application/vnd.ms-excel': [], // Old Excel files
      'text/csv': [], // CSV files
      'application/csv': [], // CSV files (alternative MIME type)
    },
    multiple: uploadType === 'multiple',
  });

  return (
    <Stack spacing={error ? 1 : 2}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        {...getRootProps()}
        sx={{
          p: 2,
          height: 200,
          border: `1px dashed ${error ? 'rgba(255,86,48,0.5)' : '#637381'}`,
          borderRadius: '8px',
          cursor: 'pointer',
          backgroundColor: error ? 'rgba(255,86,48,0.2)' : '#f9f9f9',
          '&:hover': { backgroundColor: error ? 'rgba(255,86,48,0.3)' : '#f1f1f1' },
        }}
      >
        <input {...getInputProps()} />
        <Avatar
          src={'/assets/illustrations/illustration-file.svg'} // Replace with an appropriate icon for Excel files
          sx={{ objectFit: 'contain', borderRadius: 0, width: 150, height: 150 }}
        />
        <Typography variant="body1">
          Drag and drop your Excel or CSV file here, or click to select a file
        </Typography>
      </Box>

      <Box display="flex" flexWrap="wrap" sx={{ gap: 1 }}>
        {files.map((file: any, index: any) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            component={Paper}
            elevation={1}
            sx={{
              width: '100%',
              p: 1,
              border: '1px solid #EEE',
            }}
          >
            <Typography variant="body2">{file.name}</Typography>
            <IconButton
              onClick={() => handleRemoveFile(index)}
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: 'rgba(255,255,255,0.8)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
              }}
            >
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>
    </Stack>
  );
};

export const CommonTextEditor = ({ value, onChange, placeholder, error }: any) => {
  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['bold', 'italic', 'underline', 'strike'],
      ['link', 'image'],
      ['clean'], // remove formatting button
    ],
  };

  const formats = [
    'font',
    'size',
    'header',
    'blockquote',
    'code-block',
    'list',
    'bullet',
    'indent',
    'align',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'link',
    'image',
    'video',
  ];

  const handleChange = (content: any) => {
    // Clean the content if it's empty or just <p><br></p>
    const cleanContent = content === '<p><br></p>' ? '' : content;
    onChange(cleanContent); // Pass clean content to parent
  };

  return (
    <ReactQuill
      value={value}
      className={`${error ? 'error' : ''}`}
      onChange={handleChange} // Use custom handleChange function
      modules={modules}
      formats={formats}
      placeholder={placeholder || 'Write something...'}
      style={{ backgroundColor: '#fff', height: '150px' }}
    />
  );
};

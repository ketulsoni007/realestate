import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TextField, IconButton, InputAdornment, FormControl,Button,Typography, InputLabel,Select as MUISelect,MenuItem, FormHelperText, Divider, Chip } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
// TextInput component
export const TextInput = ({ name, onChange, value, label, ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);

    return (
        <TextField
            name={name}
            ariaAutocomplete={false}
            onChange={onChange}
            value={value}
            label={label}
            variant="outlined"
            fullWidth
            size="small"
            sx={{
                margin: 'normal',
                ...(darkMode
                    ? {
                        backgroundColor: '#1C252E', // Dark background
                        mb: 2,
                        color: '#fff', // White text color
                        '& .MuiInputLabel-root': {
                            color: '#fff', // White label color when floating
                            '&.Mui-focused': { color: '#fff' }, // Ensure the label color is white when focused
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#fff' }, // White border color
                            '&:hover fieldset': { borderColor: '#fff' }, // White border color on hover
                            '&.Mui-focused fieldset': { borderColor: '#fff' }, // White border color on focus
                            '& input': { color: '#fff' }, // White text color inside input field
                        },
                        '& .MuiFormHelperText-root': {
                            marginLeft: 0,// White helper text color
                        },
                        '& input:-webkit-autofill': {
                            backgroundColor: '#1C252E !important',
                            WebkitBoxShadow: '0 0 0 1000px #1C252E inset', // Remove autofill bluish background
                            WebkitTextFillColor: '#fff', // Ensure white text color during autofill
                        },
                    }
                    : {
                        backgroundColor: '#fff', // Light background
                        color: '#000', // Black text color
                        mb: 2,
                        '& .MuiInputLabel-root': {
                            color: '#000', // Black label color when floating
                            '&.Mui-focused': { color: '#000' }, // Ensure the label color is black when focused
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#000' }, // Black border color
                            '&:hover fieldset': { borderColor: '#000' }, // Black border color on hover
                            '&.Mui-focused fieldset': { borderColor: '#000' }, // Black border color on focus
                             // Black text color inside input field
                        },
                        '& .MuiFormHelperText-root': {
                            marginLeft: 0,// White helper text color
                        },
                        '& input:-webkit-autofill': {
                            backgroundColor: '#fff !important',
                            WebkitBoxShadow: '0 0 0 1000px #fff inset', // Remove autofill bluish background
                            WebkitTextFillColor: '#000', // Ensure white text color during autofill
                        },
                    }),
            }}
            {...props}
        />
    );
};

export const PasswordInput = ({ name, onChange, value, label, ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);
    const [showPassword, setShowPassword] = useState(false);
  
    const handleClickShowPassword = () => {
      setShowPassword((prev) => !prev);
    };
  
    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  
    return (
      <FormControl sx={{ width:'100%' }} variant="outlined">
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
                sx={{ color: darkMode ? '#FFF' : '#1C252E' }}
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
            margin: 'normal',
            ...(darkMode
                ? {
                    backgroundColor: '#1C252E', // Dark background
                    mb: 2,
                    color: '#fff', // White text color
                    '& .MuiInputLabel-root': {
                        color: '#fff', // White label color when floating
                        '&.Mui-focused': { color: '#fff' }, // Ensure the label color is white when focused
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#fff' }, // White border color
                        '&:hover fieldset': { borderColor: '#fff' }, // White border color on hover
                        '&.Mui-focused fieldset': { borderColor: '#fff' }, // White border color on focus
                        '& input': { color: '#fff' }, // White text color inside input field
                    },
                    '& .MuiFormHelperText-root': {
                        marginLeft: 0,// White helper text color
                    },
                    '& input:-webkit-autofill': {
                        backgroundColor: '#1C252E !important',
                        WebkitBoxShadow: '0 0 0 1000px #1C252E inset', // Remove autofill bluish background
                        WebkitTextFillColor: '#fff', // Ensure white text color during autofill
                    },
                }
                : {
                    backgroundColor: '#fff', // Light background
                    color: '#000', // Black text color
                    mb: 2,
                    '& .MuiInputLabel-root': {
                        color: '#000', // Black label color when floating
                        '&.Mui-focused': { color: '#000' }, // Ensure the label color is black when focused
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#000' }, // Black border color
                        '&:hover fieldset': { borderColor: '#000' }, // Black border color on hover
                        '&.Mui-focused fieldset': { borderColor: '#000' }, // Black border color on focus
                         // Black text color inside input field
                    },
                    '& .MuiFormHelperText-root': {
                        marginLeft: 0,// White helper text color
                    },
                    '& input:-webkit-autofill': {
                        backgroundColor: '#fff !important',
                        WebkitBoxShadow: '0 0 0 1000px #fff inset', // Remove autofill bluish background
                        WebkitTextFillColor: '#000', // Ensure white text color during autofill
                    },
                }),
        }}
          {...props}
        />
      </FormControl>
    );
  };

// TextArea component
export const TextArea = ({ name, onChange, value, label, ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);

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
                margin: 'normal',
                ...(darkMode
                    ? {
                        backgroundColor: '#1C252E',
                        color: '#fff',
                        '& .MuiInputLabel-root': { color: '#fff' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#fff' },
                            '&:hover fieldset': { borderColor: '#fff' },
                            '&.Mui-focused fieldset': { borderColor: '#fff' },
                        },
                    }
                    : {
                        backgroundColor: '#fff',
                        color: '#000',
                        '& .MuiInputLabel-root': { color: '#000' },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#000' },
                            '&:hover fieldset': { borderColor: '#000' },
                            '&.Mui-focused fieldset': { borderColor: '#000' },
                        },
                    }),
            }}
            {...props}
        />
    );
};

export const CommonButton = ({ type = 'button',variant='', ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);
    return (
        <Button
            type={type}
            sx={{
                backgroundColor: variant === 'orange' ? '#FF6400' : darkMode ? '#FFF' : '#131313', // Dark or light background
                color: variant === 'orange' ? '#FFF' : darkMode ? '#1C252E' : '#fff', // Text color
                '&:hover': {
                    backgroundColor:variant === 'orange' ? 'rgba(255,100,0,0.5)' :  darkMode ? 'rgba(255,255,255,0.8)' : '#3C3D37', // Darker background on hover
                },
            }}
            {...props}
        />
    );
};

export const CustomText = ({ children,stylings, ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);

    return (
        <Typography
            sx={{
                color: darkMode ? '#FFF' : '#131313',
                ...stylings
            }}
            {...props}
        >
            {children}
        </Typography>
    );
};

export const CustomChip = ({ sx, ...props }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <Chip {...props} sx={{
      background: darkMode ? '#FFF' : '#FF6400',
      color: darkMode ? '#131313' : '#FFF',
      ...sx, // Spread the sx prop correctly
    }} />
  );
};

export const CustomDivider = ({ stylings, ...props }) => {
    const darkMode = useSelector((state) => state.ui.darkMode);

    return (
        <Divider
            sx={{
                borderColor: darkMode ? '#FFF' : 'auto',
                ...stylings
            }}
            {...props}
        />
    );
};

export const CustomSelect = ({ value, onChange, helperText, label, error,customId, options, ...props }) => {
  const darkMode = useSelector((state) => state.ui.darkMode);

  return (
    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
      <InputLabel
      id={customId}
        sx={{
          color: error ? '#F44336' : darkMode ? '#FFF' : '#131313',
          '&.Mui-focused': { color: darkMode ? '#FFF' : '#131313' },
          backgroundColor:darkMode ? '#1C252E' : '#FFF',
        }}
      >
        {label}
      </InputLabel>
      <MUISelect
        value={value}
        onChange={onChange}
        error={error}
        id={customId}
        sx={{
          backgroundColor: darkMode ? '#1C252E' : '#FFF',
          color: darkMode ? '#FFF' : '#131313',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#FFF' : '#131313',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#FFF' : '#131313',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: darkMode ? '#FFF' : '#131313',
          },
          '& .MuiSelect-icon': {
            color: darkMode ? '#FFF' : '#131313',
          },
        }}
        {...props}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MUISelect>
      {helperText && (
        <FormHelperText
          sx={{
            color: error ? '#F44336' : darkMode ? '#FFF' : '#131313',
            marginLeft: 0
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

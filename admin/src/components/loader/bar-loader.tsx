import { Box, LinearProgress, linearProgressClasses } from '@mui/material'
import React from 'react'
import { varAlpha } from 'src/theme/styles'

const BarLoader = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
  )
}

export default BarLoader;
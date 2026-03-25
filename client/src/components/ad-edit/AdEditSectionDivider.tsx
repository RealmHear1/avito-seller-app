import { Box } from '@mui/material'

export function AdEditSectionDivider() {
  return (
    <Box
      sx={{
        width: 'calc(100vw - 64px)',
        maxWidth: 'none',
        height: '1px',
        backgroundColor: '#F0F0F0',
      }}
    />
  )
}

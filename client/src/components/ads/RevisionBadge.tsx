import { Box, Typography } from '@mui/material'

export function RevisionBadge() {
  return (
    <Box
      sx={{
        width: '155px',
        height: '26px',
        borderRadius: '8px',
        gap: '8px',
        pt: '2px',
        pr: '8px',
        pb: '2px',
        pl: '8px',
        backgroundColor: '#F9F1E6',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}
    >
      <Box
        sx={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#FAAD14',
          flexShrink: 0,
        }}
      />
      <Typography
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '22px',
          color: '#FAAD14',
          whiteSpace: 'nowrap',
        }}
      >
        Требует доработок
      </Typography>
    </Box>
  )
}

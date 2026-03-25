import { Box, Typography } from '@mui/material'

type AdDescriptionBlockProps = {
  description?: string
}

export function AdDescriptionBlock({ description }: AdDescriptionBlockProps) {
  return (
    <Box
      sx={{
        width: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '22px',
          lineHeight: '28px',
          letterSpacing: '0px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        Описание
      </Typography>

      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '140%',
          letterSpacing: '0%',
          color: '#1E1E1E',
          whiteSpace: 'pre-wrap',
        }}
      >
        {description?.trim() || 'Отсутствует'}
      </Typography>
    </Box>
  )
}

import { Box, Typography } from '@mui/material'

type AdsPageHeaderProps = {
  totalCount: number
  declension: string
}

export function AdsPageHeader({ totalCount, declension }: AdsPageHeaderProps) {
  return (
    <Box
      sx={{
        pl: '8px',
        pr: '8px',
        height: '74px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Typography
        component="h1"
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 500,
          fontSize: '22px',
          lineHeight: '28px',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        Мои объявления
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: '100%',
          color: 'rgba(132, 131, 136, 1)',
        }}
      >
        {totalCount} {declension}
      </Typography>
    </Box>
  )
}

import { Box, Paper, Typography } from '@mui/material'

type AdMissingFieldsBannerProps = {
  missingFields: string[]
}

export function AdMissingFieldsBanner({ missingFields }: AdMissingFieldsBannerProps) {
  if (!missingFields.length) {
    return null
  }

  return (
    <Paper
      elevation={0}
      sx={{
        width: '512px',
        minHeight: '118px',
        borderRadius: '8px',
        backgroundColor: '#F9F1E6',
        boxShadow:
          '0px 9px 28px 8px rgba(0, 0, 0, 0.05), 0px 6px 16px 0px rgba(0, 0, 0, 0.08), 0px 3px 6px -4px rgba(0, 0, 0, 0.12)',
        p: '12px 16px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <Box
          component="img"
          src="/icons/warning.svg"
          alt=""
          sx={{
            width: '18px',
            height: '18px',
            display: 'block',
            mt: '3px',
            flexShrink: 0,
          }}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '24px',
              color: '#2B2A31',
            }}
          >
            Требуются доработки
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '15px',
              lineHeight: '22px',
              color: '#2B2A31',
            }}
          >
            У объявления не заполнены поля:
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px', pt: '2px' }}>
            {missingFields.map((field) => (
              <Box
                key={field}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Box
                  sx={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: '#2B2A31',
                    ml: '4px',
                    flexShrink: 0,
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    fontWeight: 400,
                    fontSize: '15px',
                    lineHeight: '24px',
                    color: '#2B2A31',
                  }}
                >
                  {field}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

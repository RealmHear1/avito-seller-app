import { Box, Typography } from '@mui/material'
import type { LabeledValue } from '../../types/common'

type AdCharacteristicsBlockProps = {
  characteristics: LabeledValue[]
}

export function AdCharacteristicsBlock({ characteristics }: AdCharacteristicsBlockProps) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 600,
          fontSize: '20px',
          lineHeight: '28px',
          color: '#2B2A31',
          mb: '14px',
        }}
      >
        Характеристики
      </Typography>

      {characteristics.length > 0 ? (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '120px minmax(0, 1fr)',
            columnGap: '28px',
            rowGap: '12px',
          }}
        >
          {characteristics.map((entry) => (
            <Box key={entry.label} sx={{ display: 'contents' }}>
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 700,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#A3A3A3',
                }}
              >
                {entry.label}
              </Typography>

              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#2B2A31',
                }}
              >
                {entry.value}
              </Typography>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px',
            color: '#848388',
          }}
        >
          Нет заполненных характеристик.
        </Typography>
      )}
    </Box>
  )
}

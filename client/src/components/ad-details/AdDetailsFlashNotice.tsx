import { forwardRef } from 'react'
import { Box, Typography } from '@mui/material'

type AdDetailsFlashNoticeProps = {
  message: string
  onClose: () => void
}

export const AdDetailsFlashNotice = forwardRef<HTMLDivElement, AdDetailsFlashNoticeProps>(
  function AdDetailsFlashNotice({ message, onClose }, ref) {
    return (
      <Box
        ref={ref}
        onClick={onClose}
        sx={{
          width: '328px',
          minHeight: '40px',
          borderRadius: '2px',
          px: '16px',
          py: '9px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          border: '1px solid #B7EB8F',
          backgroundColor: '#F6FFED',
          cursor: 'default',
        }}
      >
        <Box
          component="img"
          src="/icons/success.svg"
          alt=""
          sx={{ width: '16px', height: '16px', display: 'block', flexShrink: 0 }}
        />
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
        >
          {message}
        </Typography>
      </Box>
    )
  },
)

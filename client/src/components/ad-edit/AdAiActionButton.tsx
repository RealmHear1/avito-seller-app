import { Box, Button, CircularProgress } from '@mui/material'
import type { MouseEvent } from 'react'

type AdAiActionButtonProps = {
  label: string
  loading?: boolean
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  width?: string | number
  height?: string | number
  iconSrc?: string
}

export function AdAiActionButton({
  label,
  loading = false,
  onClick,
  width = '195px',
  height = '32px',
  iconSrc = '/icons/lamp.svg',
}: AdAiActionButtonProps) {
  return (
    <Button
      variant="text"
      onClick={onClick}
      sx={{
        width,
        minWidth: width,
        height,
        borderRadius: '8px',
        pl: '10px',
        pr: '7px',
        py: 0,
        gap: '10px',
        backgroundColor: '#F9F1E6',
        textTransform: 'none',
        color: '#FFA940',
        '&:hover': {
          backgroundColor: '#F8E7CC',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {loading ? (
          <CircularProgress size={12} sx={{ color: '#FFA940' }} />
        ) : (
          <Box
            component="img"
            src={iconSrc}
            alt=""
            sx={{ width: '12px', height: '12px', display: 'block', flexShrink: 0 }}
          />
        )}

        <Box
          component="span"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#FFA940',
          }}
        >
          {label}
        </Box>
      </Box>
    </Button>
  )
}

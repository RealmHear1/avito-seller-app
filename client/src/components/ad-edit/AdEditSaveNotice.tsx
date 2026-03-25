import { Box, Snackbar, Typography } from '@mui/material'
import type { AdEditSaveNotice as AdEditSaveNoticeType } from '../../types/ad-edit'

export type AdEditSaveNoticeProps = {
  notice: AdEditSaveNoticeType
  open: boolean
  onClose: () => void
  onExited: () => void
}

export function AdEditSaveNotice({ notice, open, onClose, onExited }: AdEditSaveNoticeProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={(_event, reason) => {
        if (reason === 'clickaway') {
          return
        }

        onClose()
      }}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      TransitionProps={{ timeout: 500 }}
      slotProps={{
        transition: {
          onExited,
        },
      }}
    >
      {notice ? (
        notice.severity === 'error' ? (
          <Box
            onClick={onClose}
            sx={{
              width: '327px',
              minHeight: '118px',
              borderRadius: '2px',
              pt: '9px',
              pr: '16px',
              pb: '9px',
              pl: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              border: '1px solid #FFA39E',
              backgroundColor: '#FFF1F0',
              cursor: 'default',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box
                component="img"
                src="/icons/wrong.svg"
                alt=""
                sx={{ width: '24px', height: '24px', display: 'block', flexShrink: 0 }}
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
                Ошибка сохранения
              </Typography>
            </Box>

            <Box sx={{ pl: '38px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 400,
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: 'rgba(0, 0, 0, 0.85)',
                }}
              >
                При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите
                позже.
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box />
        )
      ) : undefined}
    </Snackbar>
  )
}

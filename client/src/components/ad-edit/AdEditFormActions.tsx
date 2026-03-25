import { Box, Button } from '@mui/material'

export type AdEditFormActionsProps = {
  isSubmitDisabled: boolean
  isSubmitting: boolean
  onSubmit: () => void
  onCancel: () => void
}

export function AdEditFormActions({
  isSubmitDisabled,
  isSubmitting,
  onSubmit,
  onCancel,
}: AdEditFormActionsProps) {
  return (
    <Box sx={{ display: 'flex', gap: '10px', pt: '16px' }}>
      <Button
        variant="contained"
        onClick={onSubmit}
        disabled={isSubmitDisabled}
        sx={{
          width: '108px',
          minWidth: '108px',
          height: '38px',
          borderRadius: '8px',
          px: '12px',
          py: '8px',
          textTransform: 'none',
          backgroundColor: isSubmitDisabled ? '#D9D9D9' : '#1890FF',
          color: '#F3F3F3',
          boxShadow: 'none',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '140%',
          '&:hover': {
            backgroundColor: isSubmitDisabled ? '#D9D9D9' : '#1677FF',
            boxShadow: 'none',
          },
        }}
      >
        {isSubmitting ? 'Сохраняем...' : 'Сохранить'}
      </Button>

      <Button
        variant="contained"
        onClick={onCancel}
        disabled={isSubmitting}
        sx={{
          width: '102px',
          minWidth: '102px',
          height: '38px',
          borderRadius: '8px',
          px: '12px',
          py: '8px',
          textTransform: 'none',
          backgroundColor: '#D9D9D9',
          color: '#5A5A5A',
          boxShadow: 'none',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: '140%',
          '&:hover': {
            backgroundColor: '#CFCFD4',
            boxShadow: 'none',
          },
        }}
      >
        Отменить
      </Button>
    </Box>
  )
}

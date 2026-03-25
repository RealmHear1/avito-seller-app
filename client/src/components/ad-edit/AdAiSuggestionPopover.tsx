import { Box, Button, Fade, Typography } from '@mui/material'

type AdAiSuggestionPopoverProps = {
  anchorEl: HTMLElement | null
  open: boolean
  title?: string
  content: string
  onApply?: () => void
  onClose: () => void
  onExited?: () => void
  isError?: boolean
}

const containerShadow = '0px 2px 8px 0px rgba(0, 0, 0, 0.15), 0px 1px 3px 0px rgba(0, 0, 0, 0.08)'

export function AdAiSuggestionPopover({
  open,
  title = 'Ответ AI:',
  content,
  onApply,
  onClose,
  onExited,
  isError = false,
}: AdAiSuggestionPopoverProps) {
  const backgroundColor = isError ? '#FEE9E7' : '#FFFFFF'
  const borderColor = isError ? '#FFA39E' : '#F0F0F0'

  return (
    <Fade in={open} timeout={500} onExited={onExited} mountOnEnter unmountOnExit>
      <Box
        sx={{
          position: 'absolute',
          left: '-12px',
          bottom: 'calc(100% + 6px)',
          zIndex: 20,
          width: '332px',
          minHeight: isError ? '104px' : 'unset',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          borderRadius: '2px',
          p: '8px',
          backgroundColor,
          border: `1px solid ${borderColor}`,
          boxShadow: containerShadow,
          overflow: 'visible',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: '-6px',
            left: '44px',
            width: '12px',
            height: '12px',
            backgroundColor,
            borderRight: `1px solid ${borderColor}`,
            borderBottom: `1px solid ${borderColor}`,
            transform: 'rotate(45deg)',
          },
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.4px',
            color: isError ? '#C00F0C' : '#1E1E1E',
          }}
        >
          {isError ? 'Произошла ошибка при запросе к AI' : title}
        </Typography>

        <Typography
          sx={{
            whiteSpace: 'pre-wrap',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '12px',
            lineHeight: '16px',
            letterSpacing: '0.4px',
            color: '#1E1E1E',
          }}
        >
          {isError ? 'Попробуйте повторить запрос или закройте уведомление' : content}
        </Typography>

        <Box
          sx={{
            width: isError ? '73px' : '172px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {!isError && onApply ? (
            <Button
              onClick={onApply}
              variant="contained"
              disableElevation
              sx={{
                minWidth: '89px',
                width: '89px',
                height: '22px',
                minHeight: '22px',
                px: '7px',
                py: 0,
                borderRadius: '4px',
                backgroundColor: '#1890FF',
                color: '#FFFFFF',
                textTransform: 'none',
                boxShadow: '0px 2px 0px 0px #0000000B',
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '22px',
                letterSpacing: '0%',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                '&:hover': {
                  backgroundColor: '#1677FF',
                  boxShadow: '0px 2px 0px 0px #0000000B',
                },
              }}
            >
              Применить
            </Button>
          ) : null}

          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              minWidth: '73px',
              width: '73px',
              height: '24px',
              minHeight: '24px',
              px: '7px',
              py: 0,
              borderRadius: '4px',
              backgroundColor: isError ? '#FCB3AD' : '#FFFFFF',
              textTransform: 'none',
              borderColor: '#D9D9D9',
              boxShadow: '0px 2px 0px 0px #00000004',
              color: '#1E1E1E',
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '22px',
              letterSpacing: '0%',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                borderColor: '#D9D9D9',
                backgroundColor: isError ? '#F8A39C' : 'rgba(0, 0, 0, 0.02)',
                boxShadow: '0px 2px 0px 0px #00000004',
              },
            }}
          >
            Закрыть
          </Button>
        </Box>
      </Box>
    </Fade>
  )
}

import { Box, Button, Typography } from '@mui/material'
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded'

type AdDetailsHeaderProps = {
  onBack: () => void
  onEdit: () => void
  price: string
  title: string
  updatedAtLabel?: string
  createdAtLabel: string
}

export function AdDetailsHeader({
  onBack,
  onEdit,
  price,
  title,
  updatedAtLabel,
  createdAtLabel,
}: AdDetailsHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          minHeight: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Box
            onClick={onBack}
            sx={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              cursor: 'pointer',
              color: '#848388',
              transition: 'color 0.2s ease',
              '&:hover': {
                color: '#1890FF',
              },
            }}
          >
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: 20 }} />
          </Box>

          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '30px',
              lineHeight: '40px',
              color: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            {title}
          </Typography>
        </Box>

        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '30px',
            lineHeight: '40px',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
        >
          {price}
        </Typography>
      </Box>

      <Box
        sx={{
          minHeight: '42px',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '24px',
        }}
      >
        <Button
          variant="contained"
          onClick={onEdit}
          endIcon={
            <Box
              component="img"
              src="/icons/edit.svg"
              alt=""
              sx={{
                width: '18px',
                height: '18px',
                display: 'block',
              }}
            />
          }
          sx={{
            width: '170px',
            height: '38px',
            minWidth: '170px',
            borderRadius: '8px',
            px: '12px',
            py: '8px',
            gap: '8px',
            backgroundColor: '#1890FF',
            textTransform: 'none',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '140%',
            color: '#F3F3F3',
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: '#1677FF',
              boxShadow: 'none',
            },
          }}
        >
          Редактировать
        </Button>

        <Box
          sx={{
            width: '266px',
            minHeight: '42px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '10px',
            textAlign: 'right',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '100%',
              color: '#848388',
              whiteSpace: 'nowrap',
            }}
          >
            Опубликовано: {createdAtLabel}
          </Typography>

          {updatedAtLabel && (
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '100%',
                color: '#848388',
                whiteSpace: 'nowrap',
              }}
            >
              Отредактировано: {updatedAtLabel}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  )
}

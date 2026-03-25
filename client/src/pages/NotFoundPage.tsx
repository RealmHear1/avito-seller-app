import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F5F8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: '24px',
      }}
    >
      <Box
        sx={{
          maxWidth: '520px',
          width: '100%',
          borderRadius: '20px',
          border: '1px solid #ECE9F0',
          backgroundColor: '#FFFFFF',
          p: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '48px',
            lineHeight: '56px',
            color: '#2B2A31',
          }}
        >
          404
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '24px',
            lineHeight: '32px',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
        >
          Страница не найдена
        </Typography>

        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '16px',
            lineHeight: '150%',
            color: '#848388',
          }}
        >
          Похоже, такого адреса в приложении нет. Вернись к списку объявлений и продолжим оттуда.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            pt: '8px',
          }}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Назад
          </Button>
          <Button variant="contained" onClick={() => navigate('/ads')}>
            К объявлениям
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

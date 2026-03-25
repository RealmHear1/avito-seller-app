import { useQuery } from '@tanstack/react-query'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getItemById, getRequestErrorMessage } from '../api/items'
import {
  formatItemDate,
  formatPrice,
  getCategoryLabel,
  getItemCharacteristics,
  getMissingFieldLabels,
} from '../helpers/itemPresentation'

export function AdDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const itemId = Number(id)

  const itemQuery = useQuery({
    queryKey: ['ad', itemId],
    queryFn: ({ signal }) => getItemById(itemId, signal),
    enabled: Number.isFinite(itemId),
  })

  if (!Number.isFinite(itemId)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Некорректный идентификатор объявления.</Alert>
      </Box>
    )
  }

  if (itemQuery.isPending) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (itemQuery.isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="error" onClick={() => itemQuery.refetch()}>
              Повторить
            </Button>
          }
        >
          {getRequestErrorMessage(itemQuery.error)}
        </Alert>
      </Box>
    )
  }

  const item = itemQuery.data
  const characteristics = getItemCharacteristics(item)
  const missingFields = getMissingFieldLabels(item)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F5F8',
        px: '32px',
        py: '24px',
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '36px',
                color: 'rgba(0, 0, 0, 0.85)',
              }}
            >
              {item.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '22px',
                lineHeight: '140%',
                color: '#848388',
              }}
            >
              {formatPrice(item.price)}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#848388',
              }}
            >
              Категория: {getCategoryLabel(item.category)}
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#848388',
              }}
            >
              Опубликовано: {formatItemDate(item.createdAt)}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/ads')}>
              К списку
            </Button>
            <Button variant="contained" onClick={() => navigate(`/ads/${item.id}/edit`)}>
              Редактировать
            </Button>
          </Box>
        </Box>

        {missingFields.length > 0 && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #FFE3B3',
              backgroundColor: '#FFF8EB',
              p: '20px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#AD6800',
                mb: '10px',
              }}
            >
              Требуются доработки
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#8C6A00', mb: '8px' }}>
              В объявлении ещё не заполнены некоторые поля:
            </Typography>
            <Box component="ul" sx={{ mb: 0, mt: 0, pl: '20px', color: '#8C6A00' }}>
              {missingFields.map((field) => (
                <Box component="li" key={field} sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px' }}>
                  {field}
                </Box>
              ))}
            </Box>
          </Paper>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: '20px' }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #ECE9F0',
              backgroundColor: '#FFFFFF',
              p: '16px',
            }}
          >
            <Box
              sx={{
                width: '100%',
                aspectRatio: '4 / 3',
                borderRadius: '12px',
                overflow: 'hidden',
                backgroundColor: '#FAFAFA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src="/placeholder-image.png"
                alt="Изображение товара"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #ECE9F0',
              backgroundColor: '#FFFFFF',
              p: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1F1F24',
                  mb: '12px',
                }}
              >
                Характеристики
              </Typography>

              {characteristics.length > 0 ? (
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '12px' }}>
                  {characteristics.map((entry) => (
                    <Box
                      key={entry.label}
                      sx={{
                        borderRadius: '12px',
                        backgroundColor: '#F9F8FA',
                        p: '14px 16px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '12px',
                          color: '#848388',
                          mb: '6px',
                        }}
                      >
                        {entry.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Roboto, sans-serif',
                          fontSize: '16px',
                          color: '#1F1F24',
                        }}
                      >
                        {entry.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#848388' }}>
                  Характеристики пока не заполнены.
                </Typography>
              )}
            </Box>

            <Divider />

            <Box>
              <Typography
                sx={{
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  fontSize: '18px',
                  lineHeight: '24px',
                  color: '#1F1F24',
                  mb: '12px',
                }}
              >
                Описание
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '15px',
                  lineHeight: '160%',
                  color: '#3E3D45',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {item.description?.trim() || 'Описание пока не добавлено.'}
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

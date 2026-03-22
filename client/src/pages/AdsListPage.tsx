import { Typography, Box } from '@mui/material'

export function AdsListPage() {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Мои объявления
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Здесь будет список объявлений с фильтрацией и пагинацией
      </Typography>
    </Box>
  )
}

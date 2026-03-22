import { useParams } from 'react-router-dom'
import { Typography, Box } from '@mui/material'

export function AdEditPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Редактирование объявления #{id}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Здесь будет форма редактирования с AI-ассистентом
      </Typography>
    </Box>
  )
}

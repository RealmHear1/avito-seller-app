import { useParams } from 'react-router-dom'
import { Typography, Box } from '@mui/material'

export function AdDetailsPage() {
  const { id } = useParams<{ id: string }>()

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Объявление #{id}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Здесь будет детальная информация об объявлении
      </Typography>
    </Box>
  )
}

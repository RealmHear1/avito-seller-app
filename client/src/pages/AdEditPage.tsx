import { useParams } from 'react-router-dom'
import { useState } from 'react'
import {
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material'
import { useOllama } from '../hooks/useOllama'

export function AdEditPage() {
  const { id } = useParams<{ id: string }>()
  
  const [item, setItem] = useState({
    title: 'iPhone 13 Pro 128GB',
    category: 'electronics',
    price: 75000,
    description: 'Продам отличный телефон, состояние хорошее.',
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { generateDescription, estimatePrice } = useOllama({
    onError: (err) => setError(err.message),
  })

  const handleDescriptionChange = (newDescription: string) => {
    setItem(prev => ({ ...prev, description: newDescription }))
  }

  const handlePriceChange = (newPrice: number) => {
    setItem(prev => ({ ...prev, price: newPrice }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Сохранено:', item)
    } catch (err) {
      setError('Ошибка сохранения')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
  }

  const handleAIDescription = async () => {
    try {
      const improved = await generateDescription(item)
      handleDescriptionChange(improved)
    } catch (err) {
      console.error('AI Error:', err)
    }
  }

  const handleAIPrice = async () => {
    try {
      const priceText = await estimatePrice(item)
      const priceMatch = priceText.match(/\d+/)
      if (priceMatch) {
        handlePriceChange(parseInt(priceMatch[0]))
      }
    } catch (err) {
      console.error('AI Error:', err)
    }
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Редактирование объявления #{id}
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl fullWidth>
            <InputLabel>Категория</InputLabel>
            <Select
              value={item.category}
              onChange={(e) => setItem(prev => ({ ...prev, category: e.target.value as string }))}
            >
              <MenuItem value="electronics">Электроника</MenuItem>
              <MenuItem value="auto">Транспорт</MenuItem>
              <MenuItem value="real_estate">Недвижимость</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Название"
            value={item.title}
            onChange={(e) => setItem(prev => ({ ...prev, title: e.target.value }))}
          />

          <TextField
            fullWidth
            label="Цена"
            type="number"
            value={item.price}
            onChange={(e) => setItem(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Описание"
            value={item.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            helperText={`${item.description.length}/1000 символов`}
          />

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              onClick={handleAIDescription}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Генерирую...' : ' Улучшить описание'}
            </Button>
            
            <Button
              variant="outlined"
              onClick={handleAIPrice}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Анализирую...' : ' Узнать рыночную цену'}
            </Button>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
            >
              {isLoading ? 'Сохраняю...' : 'Сохранить'}
            </Button>
            <Button variant="outlined" onClick={handleCancel}>
              Отменить
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
    </Box>
  )
}

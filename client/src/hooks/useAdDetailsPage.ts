import { useQuery } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { getItemById } from '../api/items'
import {
  formatItemDateTime,
  formatPrice,
  getItemCharacteristics,
  getMissingFieldLabels,
} from '../helpers/itemPresentation'

export function useAdDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const itemId = Number(id)

  const itemQuery = useQuery({
    queryKey: ['ad', itemId],
    queryFn: ({ signal }) => getItemById(itemId, signal),
    enabled: Number.isFinite(itemId),
  })

  const item = itemQuery.data
  const characteristics = item ? getItemCharacteristics(item) : []
  const missingFields = item ? getMissingFieldLabels(item) : []
  const createdAtLabel = item ? formatItemDateTime(item.createdAt) : ''
  const updatedAtLabel =
    item && item.updatedAt !== item.createdAt ? formatItemDateTime(item.updatedAt) : undefined
  const priceLabel = item ? formatPrice(item.price) : ''

  return {
    itemId,
    itemQuery,
    viewProps: item
      ? {
          item,
          characteristics,
          createdAtLabel,
          missingFields,
          onBack: () => navigate('/ads'),
          onEdit: () => navigate(`/ads/${item.id}/edit`),
          priceLabel,
          updatedAtLabel,
        }
      : null,
  }
}

import { AD_GALLERY_PLACEHOLDER_COUNT } from '../constants/adDetails'
import type { ItemDetails } from '../types/items'

export function getGalleryImages(item: ItemDetails): string[] {
  const itemWithImages = item as ItemDetails & {
    images?: string[]
    photos?: string[]
  }

  const rawImages = itemWithImages.images ?? itemWithImages.photos ?? []
  const validImages = rawImages.filter(
    (image): image is string => typeof image === 'string' && image.length > 0,
  )

  if (validImages.length > 0) {
    return validImages
  }

  return Array.from({ length: AD_GALLERY_PLACEHOLDER_COUNT }, () => '/placeholder-image.png')
}

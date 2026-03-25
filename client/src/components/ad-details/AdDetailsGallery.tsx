import { Box } from '@mui/material'
import type { ItemDetails } from '../../types/items'

function getGalleryImages(item: ItemDetails): string[] {
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

  return Array.from({ length: 4 }, () => '/placeholder-image.png')
}

type AdDetailsGalleryProps = {
  item: ItemDetails
}

export function AdDetailsGallery({ item }: AdDetailsGalleryProps) {
  const galleryImages = getGalleryImages(item)
  const mainImage = galleryImages[0] ?? '/placeholder-image.png'
  const thumbnailImages = galleryImages.slice(0, Math.max(galleryImages.length, 4))

  return (
    <Box sx={{ width: '480px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Box
        sx={{
          width: '480px',
          height: '360px',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={mainImage}
          alt="Изображение товара"
          sx={{
            width: '480px',
            height: '360px',
            objectFit: 'contain',
          }}
        />
      </Box>

      <Box
        sx={{
          width: '480px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          pb: '4px',
        }}
      >
        {thumbnailImages.map((image, index) => (
          <Box
            key={`${image}-${index}`}
            sx={{
              width: '114px',
              height: '114px',
              backgroundColor: '#FAFAFA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              overflow: 'hidden',
            }}
          >
            <Box
              component="img"
              src={image}
              alt="Миниатюра товара"
              sx={{
                width: '114px',
                height: '114px',
                objectFit: 'contain',
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

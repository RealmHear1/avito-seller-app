import { Box, Card, CardContent, Typography } from '@mui/material'
import { formatPrice, getCategoryLabel } from '../../helpers/itemPresentation'
import type { ListItem } from '../../types/items'
import type { ViewMode } from './types'
import { RevisionBadge } from './RevisionBadge'

type AdCardProps = {
  ad: ListItem
  viewMode: ViewMode
  onOpen: () => void
}

export function AdCard({ ad, viewMode, onOpen }: AdCardProps) {
  const categoryLabel = getCategoryLabel(ad.category)
  const formattedPrice = formatPrice(ad.price)

  if (viewMode === 'list') {
    return (
      <Card
        elevation={0}
        onClick={onOpen}
        sx={{
          width: '100%',
          height: '132px',
          borderRadius: '16px',
          border: '1px solid #F0F0F0',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: 'none',
          display: 'flex',
          cursor: 'pointer',
        }}
      >
        <Box
          sx={{
            width: '179px',
            height: '132px',
            backgroundColor: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="/placeholder-image.png"
            alt="Изображение товара"
            sx={{
              width: '179px',
              height: '132px',
              objectFit: 'cover',
              backgroundColor: '#FAFAFA',
            }}
          />
        </Box>

        <CardContent
          sx={{
            p: 0,
            flex: 1,
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            pl: '24px',
            pr: '24px',
            pt: '14px',
          }}
        >
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: '14px',
                lineHeight: '100%',
                color: '#848388',
                mt: '2px',
                mb: '10px',
              }}
            >
              {categoryLabel}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '16px',
                color: 'rgba(0, 0, 0, 0.85)',
                mb: '4px',
              }}
            >
              {ad.title}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                lineHeight: '140%',
                color: 'rgba(0, 0, 0, 0.45)',
                mb: ad.needsRevision ? '10px' : 0,
              }}
            >
              {formattedPrice}
            </Typography>

            {ad.needsRevision && <RevisionBadge />}
          </Box>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      elevation={0}
      onClick={onOpen}
      sx={{
        width: '200px',
        height: '298px',
        borderRadius: '16px',
        border: '1px solid #F0F0F0',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: 'none',
        cursor: 'pointer',
      }}
    >
      <Box
        sx={{
          width: '200px',
          height: '150px',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
        }}
      >
        <Box
          component="img"
          src="/placeholder-image.png"
          alt="Изображение товара"
          sx={{
            width: '200px',
            height: '150px',
            objectFit: 'cover',
            backgroundColor: '#FAFAFA',
          }}
        />
      </Box>

      <CardContent
        sx={{
          p: 0,
          height: '118px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            width: 'fit-content',
            minHeight: '22px',
            borderRadius: '6px',
            border: '1px solid #D9D9D9',
            bgcolor: '#FFFFFF',
            px: '10px',
            py: '2px',
            ml: '12px',
            mt: '-11px',
            position: 'relative',
            zIndex: 1,
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '16px',
            color: '#3E3D45',
          }}
        >
          {categoryLabel}
        </Box>

        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            pt: '28px',
            pr: '16px',
            pb: '16px',
            pl: '16px',
            mt: '-22px',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '20px',
              color: '#2B2A31',
            }}
          >
            {ad.title}
          </Typography>

          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '16px',
              lineHeight: '120%',
              color: '#8C8C95',
            }}
          >
            {formattedPrice}
          </Typography>

          {ad.needsRevision && <RevisionBadge />}
        </Box>
      </CardContent>
    </Card>
  )
}

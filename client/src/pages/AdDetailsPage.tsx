import { Alert, Box, Button, CircularProgress, Snackbar } from '@mui/material'
import { useEffect, useState } from 'react'
import { AdCharacteristicsBlock } from '../components/ad-details/AdCharacteristicsBlock'
import { AdDescriptionBlock } from '../components/ad-details/AdDescriptionBlock'
import { AdDetailsFlashNotice } from '../components/ad-details/AdDetailsFlashNotice'
import { AdDetailsGallery } from '../components/ad-details/AdDetailsGallery'
import { AdDetailsHeader } from '../components/ad-details/AdDetailsHeader'
import { AdMissingFieldsBanner } from '../components/ad-details/AdMissingFieldsBanner'
import { getRequestErrorMessage } from '../api/items'
import { EDIT_SUCCESS_NOTICE_KEY } from '../constants/storage'
import { useAdDetailsPage } from '../hooks/useAdDetailsPage'

export function AdDetailsPage() {
  const { itemId, itemQuery, viewProps } = useAdDetailsPage()
  const [flashNotice, setFlashNotice] = useState<{ severity: 'success'; message: string } | null>(
    null,
  )
  const [isFlashOpen, setIsFlashOpen] = useState(false)

  useEffect(() => {
    const savedNotice = window.sessionStorage.getItem(EDIT_SUCCESS_NOTICE_KEY)

    if (!savedNotice) {
      return
    }

    try {
      const parsedNotice = JSON.parse(savedNotice) as { severity: 'success'; message: string }
      setFlashNotice(parsedNotice)
      setIsFlashOpen(true)
    } catch {
      setFlashNotice(null)
      setIsFlashOpen(false)
    } finally {
      window.sessionStorage.removeItem(EDIT_SUCCESS_NOTICE_KEY)
    }
  }, [])

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

  if (!viewProps) {
    return null
  }

  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FFFFFF',
          pt: '32px',
          pr: '32px',
          pb: '48px',
          pl: '32px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <AdDetailsHeader
            title={viewProps.item.title}
            price={viewProps.priceLabel}
            createdAtLabel={viewProps.createdAtLabel}
            updatedAtLabel={viewProps.updatedAtLabel}
            onBack={viewProps.onBack}
            onEdit={viewProps.onEdit}
          />

          <Box sx={{ width: '100%', height: '1px', backgroundColor: '#F0F0F0' }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '480px 527px' },
              minHeight: '360px',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            <AdDetailsGallery item={viewProps.item} />

            <Box
              sx={{
                width: '527px',
                minHeight: '360px',
                display: 'flex',
                flexDirection: 'column',
                gap: '36px',
              }}
            >
              <AdMissingFieldsBanner missingFields={viewProps.missingFields} />
              <AdCharacteristicsBlock characteristics={viewProps.characteristics} />
            </Box>
          </Box>

          <AdDescriptionBlock description={viewProps.item.description} />
        </Box>
      </Box>
      <Snackbar
        open={isFlashOpen}
        autoHideDuration={3000}
        onClose={(_event, reason) => {
          if (reason === 'clickaway') {
            return
          }

          setIsFlashOpen(false)
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionProps={{ timeout: 500 }}
        slotProps={{
          transition: {
            onExited: () => setFlashNotice(null),
          },
        }}
      >
        {flashNotice ? (
          <AdDetailsFlashNotice
            message={flashNotice.message}
            onClose={() => setIsFlashOpen(false)}
          />
        ) : undefined}
      </Snackbar>
    </>
  )
}

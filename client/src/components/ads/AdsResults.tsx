import { Alert, Box, ButtonBase, CircularProgress, Typography } from '@mui/material'
import { getRequestErrorMessage } from '../../api/items'
import type { ListItem } from '../../types/items'
import type { ViewMode } from './types'
import { AdCard } from './AdCard'
import { AdsPagination } from './AdsPagination'

type AdsResultsProps = {
  currentPage: number
  error: unknown
  isError: boolean
  isFetching: boolean
  isPending: boolean
  items: ListItem[]
  pageNumbers: number[]
  totalPages: number
  viewMode: ViewMode
  onOpenAd: (id: number) => void
  onPageChange: (page: number) => void
  onRetry: () => void
}

export function AdsResults({
  currentPage,
  error,
  isError,
  isFetching,
  isPending,
  items,
  pageNumbers,
  totalPages,
  viewMode,
  onOpenAd,
  onPageChange,
  onRetry,
}: AdsResultsProps) {
  if (isError) {
    return (
      <Alert
        severity="error"
        action={
          <ButtonBase onClick={onRetry} sx={{ color: '#D32F2F', fontSize: '14px' }}>
            Повторить
          </ButtonBase>
        }
      >
        {getRequestErrorMessage(error)}
      </Alert>
    )
  }

  if (isPending) {
    return (
      <Box
        sx={{
          minHeight: '320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #ECE9F0',
        }}
      >
        <CircularProgress size={28} />
      </Box>
    )
  }

  if (!items.length) {
    return (
      <Box
        sx={{
          minHeight: '240px',
          borderRadius: '16px',
          border: '1px solid #ECE9F0',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontSize: '18px',
            color: '#1F1F24',
          }}
        >
          Ничего не найдено
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            color: '#848388',
          }}
        >
          Попробуй изменить строку поиска или сбросить фильтры.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {isFetching && (
        <Box sx={{ mb: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CircularProgress size={16} />
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#848388',
            }}
          >
            Обновляем список...
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(200px, 200px))' : '1fr',
          gap: '16px',
          width: '100%',
          justifyContent: 'start',
        }}
      >
        {items.map((ad) => (
          <AdCard key={ad.id} ad={ad} viewMode={viewMode} onOpen={() => onOpenAd(ad.id)} />
        ))}
      </Box>

      <AdsPagination
        currentPage={currentPage}
        pageNumbers={pageNumbers}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </>
  )
}

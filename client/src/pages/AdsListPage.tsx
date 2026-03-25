import { Box } from '@mui/material'
import { AdsFilters } from '../components/ads/AdsFilters'
import { AdsPageHeader } from '../components/ads/AdsPageHeader'
import { AdsResults } from '../components/ads/AdsResults'
import { AdsToolbar } from '../components/ads/AdsToolbar'
import { useAdsListPage } from '../hooks/useAdsListPage'

export function AdsListPage() {
  const { filtersProps, headerProps, resultsProps, toolbarProps } = useAdsListPage()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F5F8',
        pt: '12px',
        pr: '32px',
        pb: '12px',
        pl: '32px',
      }}
    >
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <AdsPageHeader {...headerProps} />

        <AdsToolbar {...toolbarProps} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '256px minmax(0, 1fr)', gap: '24px' }}>
          <AdsFilters {...filtersProps} />

          <Box>
            <AdsResults {...resultsProps} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

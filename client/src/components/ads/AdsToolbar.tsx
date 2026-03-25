import { Box, ButtonBase, IconButton, InputBase, Menu, MenuItem } from '@mui/material'
import { KeyboardArrowDown, Search } from '@mui/icons-material'
import type { SortOption, ViewMode } from './types'

type AdsToolbarProps = {
  searchInput: string
  sortBy: string
  sortMenuAnchor: HTMLElement | null
  sortOption: SortOption
  viewMode: ViewMode
  isSortMenuOpen: boolean
  onSearchInputChange: (value: string) => void
  onSearchSubmit: () => void
  onSortMenuClose: () => void
  onSortMenuOpen: (element: HTMLElement) => void
  onSortChange: (value: string) => void
  onViewModeChange: (mode: ViewMode) => void
  sortOptions: SortOption[]
}

export function AdsToolbar({
  searchInput,
  sortBy,
  sortMenuAnchor,
  sortOption,
  viewMode,
  isSortMenuOpen,
  onSearchInputChange,
  onSearchSubmit,
  onSortMenuClose,
  onSortMenuOpen,
  onSortChange,
  onViewModeChange,
  sortOptions,
}: AdsToolbarProps) {
  return (
    <Box
      sx={{
        height: '56px',
        borderRadius: '8px',
        p: '12px',
        gap: '24px',
        backgroundColor: '#FFFFFF',
        border: '1px solid #ECE9F0',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          flex: 1,
          height: '32px',
          borderRadius: '8px',
          backgroundColor: '#F6F6F8',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <InputBase
          placeholder="Найти объявление..."
          value={searchInput}
          onChange={(event) => onSearchInputChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              onSearchSubmit()
            }
          }}
          sx={{
            flex: 1,
            height: '32px',
            pt: '5px',
            pr: '12px',
            pb: '5px',
            pl: '12px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#1F1F24',
          }}
        />
        <IconButton
          onClick={onSearchSubmit}
          sx={{ width: '38px', height: '32px', borderRadius: 0, color: '#1F1F24' }}
        >
          <Search sx={{ width: '14px', height: '14px' }} />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
        <Box
          sx={{
            width: '73px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: '#F4F4F6',
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ width: '50%', height: '100%', borderRight: '2px solid #FFF' }}>
            <IconButton
              onClick={() => onViewModeChange('grid')}
              sx={{ width: '100%', height: '100%', borderRadius: 0 }}
            >
              <Box
                component="img"
                src={viewMode === 'grid' ? '/icons/grid-blue.png' : '/icons/grid-black.png'}
                alt="Сетка"
                sx={{ width: '14px', height: '14px' }}
              />
            </IconButton>
          </Box>
          <Box sx={{ width: '50%', height: '100%' }}>
            <IconButton
              onClick={() => onViewModeChange('list')}
              sx={{ width: '100%', height: '100%', borderRadius: 0 }}
            >
              <Box
                component="img"
                src={viewMode === 'list' ? '/icons/list-blue.png' : '/icons/list-black.png'}
                alt="Список"
                sx={{ width: '16.39px', height: '13.66px' }}
              />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            height: '32px',
            borderRadius: '8px',
            p: '4px',
            backgroundColor: '#F4F4F6',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ButtonBase
            onClick={(event) => onSortMenuOpen(event.currentTarget)}
            sx={{
              height: '22px',
              borderRadius: '4px',
              backgroundColor: '#FFFFFF',
              pl: '12px',
              pr: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              color: '#1F1F24',
            }}
          >
            <Box component="span">{sortOption.label}</Box>
            <KeyboardArrowDown sx={{ width: '14px', height: '14px' }} />
          </ButtonBase>

          <Menu
            anchorEl={sortMenuAnchor}
            open={isSortMenuOpen}
            onClose={onSortMenuClose}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: '12px',
                  border: '1px solid #ECE9F0',
                  boxShadow: '0 12px 32px rgba(29, 32, 38, 0.12)',
                  overflow: 'hidden',
                },
              },
            }}
          >
            {sortOptions.map((option) => (
              <MenuItem
                key={option.value}
                selected={sortBy === option.value}
                onClick={() => onSortChange(option.value)}
                sx={{
                  minHeight: '40px',
                  px: '16px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}

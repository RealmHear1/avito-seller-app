import { Check, KeyboardArrowDown } from '@mui/icons-material'
import { Box, ButtonBase, Divider, Typography } from '@mui/material'
import { categoryOptions } from '../../constants/ads'
import type { ItemCategory } from '../../types/items'

type AdsFiltersProps = {
  hasActiveFilters: boolean
  isCategoriesOpen: boolean
  onlyNeedsRevision: boolean
  selectedCategories: ItemCategory[]
  onCategoryToggle: (category: ItemCategory) => void
  onResetFilters: () => void
  onToggleCategoriesOpen: () => void
  onToggleNeedsRevision: () => void
}

export function AdsFilters({
  hasActiveFilters,
  isCategoriesOpen,
  onlyNeedsRevision,
  selectedCategories,
  onCategoryToggle,
  onResetFilters,
  onToggleCategoriesOpen,
  onToggleNeedsRevision,
}: AdsFiltersProps) {
  return (
    <Box sx={{ width: '256px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <Box
        sx={{
          width: '256px',
          borderRadius: '8px',
          bgcolor: '#FFFFFF',
          border: '1px solid #ECE9F0',
          p: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        <Typography
          sx={{
            mb: '10px',
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '20px',
            color: '#1F1F24',
          }}
        >
          Фильтры
        </Typography>

        <ButtonBase
          onClick={onToggleCategoriesOpen}
          disableRipple
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: '6px',
          }}
        >
          <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#1F1F24' }}>
            Категория
          </Typography>
          <KeyboardArrowDown
            sx={{
              fontSize: 18,
              color: '#1F1F24',
              transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </ButtonBase>

        {isCategoriesOpen && (
          <Box sx={{ display: 'grid', gap: '6px' }}>
            {categoryOptions.map((option) => {
              const isSelected = selectedCategories.includes(option.key)

              return (
                <ButtonBase
                  key={option.key}
                  onClick={() => onCategoryToggle(option.key)}
                  disableRipple
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: '12px',
                    py: '2px',
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 16,
                      border: isSelected ? '1px solid #2F80FF' : '1px solid #D6D9DE',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isSelected ? '#2F80FF' : '#FFFFFF',
                    }}
                  >
                    {isSelected && <Check sx={{ width: 14, height: 14, color: '#FFFFFF' }} />}
                  </Box>
                  <Typography
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      lineHeight: '20px',
                      color: '#3E3D45',
                    }}
                  >
                    {option.label}
                  </Typography>
                </ButtonBase>
              )
            })}
          </Box>
        )}

        <Divider sx={{ my: 2, borderColor: '#F0EDF3' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography
            sx={{
              width: '224px',
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: '14px',
              lineHeight: '140%',
              color: '#1F1F24',
            }}
          >
            Только требующие доработок
          </Typography>
          <ButtonBase
            onClick={onToggleNeedsRevision}
            disableRipple
            sx={{
              width: 60,
              height: 22,
              borderRadius: '16px',
              backgroundColor: onlyNeedsRevision ? '#2F80FF' : '#B8B5BC',
              justifyContent: onlyNeedsRevision ? 'flex-end' : 'flex-start',
              alignItems: 'center',
              display: 'flex',
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 1px 2px rgba(16, 24, 40, 0.18)',
                m: '2px',
              }}
            />
          </ButtonBase>
        </Box>
      </Box>

      <Box
        component="button"
        type="button"
        onClick={onResetFilters}
        disabled={!hasActiveFilters}
        sx={{
          width: '256px',
          minHeight: '41px',
          borderRadius: '8px',
          border: '1px solid #ECE9F0',
          bgcolor: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          color: hasActiveFilters ? '#848388' : '#B9B8BD',
          cursor: hasActiveFilters ? 'pointer' : 'default',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': hasActiveFilters ? { backgroundColor: '#F4F4F6', color: '#2F80FF' } : {},
        }}
      >
        Сбросить фильтры
      </Box>
    </Box>
  )
}

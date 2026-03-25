import { useMemo, useState } from 'react'
import {
  Box,
  ButtonBase,
  Card,
  CardContent,
  Divider,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  KeyboardArrowDown,
  Search,
} from '@mui/icons-material'
import { getAdDeclension } from '../helpers/declension'

type ViewMode = 'grid' | 'list'

type PreviewAd = {
  id: number
  title: string
  category: string
  price: string
  priceValue: number
  createdAt: string
  needsRevision?: boolean
}

type CategoryOption = {
  key: string
  label: string
}

const previewAds: PreviewAd[] = [
  { id: 1, title: 'Наушники', category: 'Электроника', price: '2990 ₽', priceValue: 2990, createdAt: '2026-03-01' },
  { id: 2, title: 'Volkswagen Polo', category: 'Авто', price: '1100000 ₽', priceValue: 1100000, createdAt: '2026-03-10', needsRevision: true },
  { id: 3, title: 'Студия, 25м²', category: 'Недвижимость', price: '15000000 ₽', priceValue: 15000000, createdAt: '2026-03-03' },
  { id: 4, title: '1-кк, 44м²', category: 'Недвижимость', price: '19000000 ₽', priceValue: 19000000, createdAt: '2026-03-08', needsRevision: true },
  { id: 5, title: 'MacBook Pro 16”', category: 'Электроника', price: '64000 ₽', priceValue: 64000, createdAt: '2026-03-06', needsRevision: true },
  { id: 6, title: 'Omoda C5', category: 'Авто', price: '2900000 ₽', priceValue: 2900000, createdAt: '2026-02-19' },
  { id: 7, title: 'iPad Air 11, 2024 г.', category: 'Электроника', price: '37000 ₽', priceValue: 37000, createdAt: '2026-03-11' },
  { id: 8, title: 'MAJOR VI', category: 'Электроника', price: '20000 ₽', priceValue: 20000, createdAt: '2026-02-25' },
  { id: 9, title: 'Toyota Camry', category: 'Авто', price: '3900000 ₽', priceValue: 3900000, createdAt: '2026-03-05', needsRevision: true },
  { id: 10, title: 'iPhone 17 Pro Max', category: 'Электроника', price: '107000 ₽', priceValue: 107000, createdAt: '2026-03-12' },
]

const categoryOptions: CategoryOption[] = [
  { key: 'auto', label: 'Авто' },
  { key: 'electronics', label: 'Электроника' },
  { key: 'real_estate', label: 'Недвижимость' },
]

function RevisionBadge() {
  return (
    <Box
      sx={{
        width: '155px',
        height: '26px',
        borderRadius: '8px',
        gap: '8px',
        pt: '2px',
        pr: '8px',
        pb: '2px',
        pl: '8px',
        backgroundColor: '#F9F1E6',
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
      }}
    >
      <Box sx={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#FAAD14', flexShrink: 0 }} />
      <Typography
        sx={{
          fontFamily: 'Roboto, sans-serif',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '22px',
          color: '#FAAD14',
          whiteSpace: 'nowrap',
        }}
      >
        Требует доработок
      </Typography>
    </Box>
  )
}

function AdCard({ ad, viewMode }: { ad: PreviewAd; viewMode: ViewMode }) {
  if (viewMode === 'list') {
    return (
      <Card
        elevation={0}
        sx={{
          width: '100%',
          height: '132px',
          borderRadius: '16px',
          border: '1px solid #F0F0F0',
          bgcolor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: 'none',
          display: 'flex',
        }}
      >
        <Box
          sx={{
            width: '179px',
            height: '132px',
            borderRadius: '8px',
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
              {ad.category}
            </Typography>

            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 400,
                fontSize: '16px',
                lineHeight: '24px',
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
              {ad.price}
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
      sx={{
        width: '200px',
        height: '268px',
        borderRadius: '16px',
        border: '1px solid #F0F0F0',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
        boxShadow: 'none',
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

      <CardContent sx={{ p: 0, height: '118px', display: 'flex', flexDirection: 'column' }}>
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
            lineHeight: '18px',
            color: '#3E3D45',
          }}
        >
          {ad.category}
        </Box>

        <Box
          sx={{
            width: '100%',
            height: '118px',
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
              lineHeight: '24px',
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
              lineHeight: '140%',
              color: '#8C8C95',
            }}
          >
            {ad.price}
          </Typography>

          {ad.needsRevision && <RevisionBadge />}
        </Box>
      </CardContent>
    </Card>
  )
}

export function AdsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('createdAtDesc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredAds = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    const nextAds = previewAds.filter((ad) => {
      const matchesSearch = !query || ad.title.toLowerCase().includes(query)
      const matchesRevision = !onlyNeedsRevision || ad.needsRevision
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(categoryOptions.find((option) => option.label === ad.category)?.key ?? '')

      return matchesSearch && matchesRevision && matchesCategory
    })

    return nextAds.toSorted((left, right) => {
      if (sortBy === 'titleAsc') return left.title.localeCompare(right.title, 'ru')
      if (sortBy === 'titleDesc') return right.title.localeCompare(left.title, 'ru')
      if (sortBy === 'createdAtAsc') return new Date(left.createdAt).valueOf() - new Date(right.createdAt).valueOf()
      if (sortBy === 'priceAsc') return left.priceValue - right.priceValue
      if (sortBy === 'priceDesc') return right.priceValue - left.priceValue

      return new Date(right.createdAt).valueOf() - new Date(left.createdAt).valueOf()
    })
  }, [onlyNeedsRevision, searchTerm, selectedCategories, sortBy])

  const totalCount = 42
  const declension = getAdDeclension(totalCount)
  const hasActiveFilters = selectedCategories.length > 0 || onlyNeedsRevision
  const isSortMenuOpen = Boolean(sortMenuAnchor)
  const totalPages = 5
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  const sortLabel =
    sortBy === 'titleAsc'
      ? 'По названию (А → Я)'
      : sortBy === 'titleDesc'
        ? 'По названию (Я → А)'
        : sortBy === 'createdAtAsc'
          ? 'По новизне (сначала старые)'
          : sortBy === 'priceAsc'
            ? 'По цене (сначала дешевле)'
            : sortBy === 'priceDesc'
              ? 'По цене (сначала дороже)'
              : 'По новизне (сначала новые)'

  const handleCategoryToggle = (categoryKey: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryKey) ? prev.filter((item) => item !== categoryKey) : [...prev, categoryKey],
    )
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setOnlyNeedsRevision(false)
  }

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
        <Box
          sx={{
            pl: '8px',
            pr: '8px',
            height: '74px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontFamily: 'Roboto, sans-serif',
              fontWeight: 500,
              fontSize: '22px',
              lineHeight: '28px',
              color: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            Мои объявления
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '100%',
              color: 'rgba(132, 131, 136, 1)',
            }}
          >
            {totalCount} {declension}
          </Typography>
        </Box>

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
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
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
            <IconButton sx={{ width: '38px', height: '32px', borderRadius: 0, color: '#1F1F24' }}>
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
                  onClick={() => setViewMode('grid')}
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
                  onClick={() => setViewMode('list')}
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
                onClick={(event) => setSortMenuAnchor(event.currentTarget)}
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
                <Box component="span">{sortLabel}</Box>
                <KeyboardArrowDown sx={{ width: '14px', height: '14px' }} />
              </ButtonBase>

              <Menu
                anchorEl={sortMenuAnchor}
                open={isSortMenuOpen}
                onClose={() => setSortMenuAnchor(null)}
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
                {[
                  ['createdAtDesc', 'По новизне (сначала новые)'],
                  ['createdAtAsc', 'По новизне (сначала старые)'],
                  ['titleAsc', 'По названию (А → Я)'],
                  ['titleDesc', 'По названию (Я → А)'],
                  ['priceAsc', 'По цене (сначала дешевле)'],
                  ['priceDesc', 'По цене (сначала дороже)'],
                ].map(([value, label]) => (
                  <MenuItem
                    key={value}
                    selected={sortBy === value}
                    onClick={() => {
                      setSortBy(value)
                      setSortMenuAnchor(null)
                    }}
                    sx={{ minHeight: '40px', px: '16px', fontFamily: 'Inter, sans-serif', fontSize: '14px' }}
                  >
                    {label}
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '256px minmax(0, 1fr)', gap: '24px' }}>
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
              <Typography sx={{ mb: '10px', fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '14px', lineHeight: '20px', color: '#1F1F24' }}>
                Фильтры
              </Typography>

              <ButtonBase
                onClick={() => setIsCategoriesOpen((prev) => !prev)}
                disableRipple
                sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '6px' }}
              >
                <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#1f1f24' }}>Категория</Typography>
                <KeyboardArrowDown sx={{ fontSize: 18, color: '#1f1f24', transform: isCategoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </ButtonBase>

              {isCategoriesOpen && (
                <Box sx={{ display: 'grid', gap: '6px' }}>
                  {categoryOptions.map((option) => {
                    const isSelected = selectedCategories.includes(option.key)

                    return (
                      <ButtonBase
                        key={option.key}
                        onClick={() => handleCategoryToggle(option.key)}
                        disableRipple
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '12px', py: '2px' }}
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
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', lineHeight: '20px', color: '#3E3D45' }}>
                          {option.label}
                        </Typography>
                      </ButtonBase>
                    )
                  })}
                </Box>
              )}

              <Divider sx={{ my: 2, borderColor: '#F0EDF3' }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography sx={{ width: '224px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px', lineHeight: '140%', color: '#1f1f24' }}>
                  Только требующие доработок
                </Typography>
                <ButtonBase
                  onClick={() => setOnlyNeedsRevision((prev) => !prev)}
                  disableRipple
                  sx={{
                    width: 62,
                    height: 22,
                    borderRadius: '16px',
                    backgroundColor: onlyNeedsRevision ? '#2F80FF' : '#B8B5BC',
                    justifyContent: onlyNeedsRevision ? 'flex-end' : 'flex-start',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                >
                  <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 2px rgba(16, 24, 40, 0.18)', m: '2px' }} />
                </ButtonBase>
              </Box>
            </Box>

            <Box
              component="button"
              type="button"
              onClick={handleResetFilters}
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

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(200px, 200px))' : '1fr',
                gap: '16px',
                width: '100%',
                justifyContent: 'start',
              }}
            >
              {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} viewMode={viewMode} />
              ))}
            </Box>

            <Box sx={{ mt: '12px', display: 'flex', justifyContent: 'flex-start' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ButtonBase
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  sx={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #D9D9D9',
                    backgroundColor: '#FFFFFF',
                    color: currentPage === 1 ? '#D9D9D9' : '#3E3D45',
                  }}
                >
                  <ChevronLeft sx={{ width: 16, height: 16 }} />
                </ButtonBase>

                {pageNumbers.map((pageNumber) => {
                  const isActive = currentPage === pageNumber

                  return (
                    <ButtonBase
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      sx={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: `1px solid ${isActive ? '#2F80FF' : '#D9D9D9'}`,
                        backgroundColor: '#FFFFFF',
                        color: isActive ? '#2F80FF' : '#3E3D45',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      }}
                    >
                      {pageNumber}
                    </ButtonBase>
                  )
                })}

                <ButtonBase
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  sx={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    border: '1px solid #D9D9D9',
                    backgroundColor: '#FFFFFF',
                    color: currentPage === totalPages ? '#D9D9D9' : '#3E3D45',
                  }}
                >
                  <ChevronRight sx={{ width: 16, height: 16 }} />
                </ButtonBase>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

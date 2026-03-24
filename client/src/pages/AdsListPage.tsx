import { useMemo, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import {
  ImageOutlined,
  KeyboardArrowDown,
  Search,
  ViewAgendaOutlined,
  ViewModuleOutlined,
} from '@mui/icons-material'
import { getAdDeclension } from '../helpers/declension'

type ViewMode = 'grid' | 'list'

type PreviewAd = {
  id: number
  title: string
  category: string
  price: string
  needsRevision?: boolean
}

const previewAds: PreviewAd[] = [
  { id: 1, title: 'Наушники', category: 'Электроника', price: '2990 ₽' },
  { id: 2, title: 'Volkswagen Polo', category: 'Авто', price: '1100000 ₽', needsRevision: true },
  { id: 3, title: 'Студия, 25м²', category: 'Недвижимость', price: '15000000 ₽' },
  { id: 4, title: '1-кк, 44м²', category: 'Недвижимость', price: '19000000 ₽', needsRevision: true },
  { id: 5, title: 'MacBook Pro 16”', category: 'Электроника', price: '64000 ₽', needsRevision: true },
  { id: 6, title: 'Omoda C5', category: 'Авто', price: '2900000 ₽' },
  { id: 7, title: 'iPad Air 11, 2024 г.', category: 'Электроника', price: '37000 ₽' },
  { id: 8, title: 'MAJOR VI', category: 'Электроника', price: '20000 ₽' },
  { id: 9, title: 'Toyota Camry', category: 'Авто', price: '3900000 ₽', needsRevision: true },
  { id: 10, title: 'iPhone 17 Pro Max', category: 'Электроника', price: '107000 ₽' },
]

export function AdsListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(false)

  const filteredAds = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return previewAds.filter((ad) => {
      const matchesSearch = !query || ad.title.toLowerCase().includes(query)
      const matchesRevision = !onlyNeedsRevision || ad.needsRevision

      return matchesSearch && matchesRevision
    })
  }, [onlyNeedsRevision, searchTerm])

  const totalCount = 42
  const declension = getAdDeclension(totalCount)

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F5F8',
        pt: '12px',
        pr: '32px',
        pb: '12px',
        pl: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
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
              letterSpacing: 0,
              color: 'rgba(0, 0, 0, 0.85)',
            }}
          >
            Мои объявления
          </Typography>

          <Typography
            sx={{
              mt: 0,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              lineHeight: '100%',
              letterSpacing: 0,
              color: 'rgba(132, 131, 136, 1)',
            }}
          >
            {totalCount} {declension}
          </Typography>
        </Box>

        <Box
          sx={{
            borderRadius: '16px',
            bgcolor: '#ffffff',
            border: '1px solid #ece9f0',
            p: 1.25,
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          <TextField
            placeholder="Найти объявление..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            fullWidth
            size="small"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Search sx={{ fontSize: 18, color: '#1f1f24' }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 36,
                borderRadius: '10px',
                bgcolor: '#f7f5f8',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                color: '#1f1f24',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f0edf3',
              },
              '& .MuiInputBase-input': {
                px: 1.5,
                py: 0,
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9c99a1',
                opacity: 1,
              },
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flexShrink: 0,
            }}
          >
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, nextValue: ViewMode | null) => {
                if (nextValue) {
                  setViewMode(nextValue)
                }
              }}
              sx={{
                height: 36,
                borderRadius: '10px',
                overflow: 'hidden',
                border: '1px solid #ece9f0',
                '& .MuiToggleButtonGroup-grouped': {
                  m: 0,
                  border: 0,
                  borderRadius: '0 !important',
                },
              }}
            >
              <ToggleButton
                value="grid"
                sx={{
                  width: 38,
                  px: 0,
                  bgcolor: '#fff',
                  color: viewMode === 'grid' ? '#2f80ff' : '#8c8c95',
                }}
              >
                <ViewModuleOutlined sx={{ fontSize: 18 }} />
              </ToggleButton>
              <ToggleButton
                value="list"
                sx={{
                  width: 38,
                  px: 0,
                  bgcolor: '#fff',
                  color: viewMode === 'list' ? '#2f80ff' : '#8c8c95',
                }}
              >
                <ViewAgendaOutlined sx={{ fontSize: 18 }} />
              </ToggleButton>
            </ToggleButtonGroup>

            <FormControl size="small" sx={{ minWidth: 238 }}>
              <InputLabel
                shrink={false}
                sx={{
                  display: 'none',
                }}
              >
                Сортировка
              </InputLabel>
              <Select
                displayEmpty
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                IconComponent={KeyboardArrowDown}
                renderValue={(value) => {
                  if (value === 'title') {
                    return 'По названию'
                  }

                  if (value === 'price') {
                    return 'По цене'
                  }

                  return 'По новизне (сначала новые)'
                }}
                sx={{
                  height: 36,
                  borderRadius: '10px',
                  bgcolor: '#fff',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: '#1f1f24',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#ece9f0',
                  },
                  '& .MuiSelect-select': {
                    display: 'flex',
                    alignItems: 'center',
                    px: '14px',
                    py: 0,
                  },
                }}
              >
                <MenuItem value="createdAt">По новизне (сначала новые)</MenuItem>
                <MenuItem value="price">По цене</MenuItem>
                <MenuItem value="title">По названию</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: '224px minmax(0, 1fr)', gap: 2.5 }}>
          <Box>
            <Box
              sx={{
                borderRadius: '16px',
                bgcolor: '#fff',
                border: '1px solid #ece9f0',
                p: 2,
              }}
            >
              <Typography
                sx={{
                  mb: 2,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 700,
                  fontSize: '14px',
                  lineHeight: '20px',
                  color: '#1f1f24',
                }}
              >
                Фильтры
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography sx={{ fontSize: '14px', lineHeight: '20px', color: '#1f1f24' }}>
                  Категория
                </Typography>
                <IconButton size="small" sx={{ p: 0.25, color: '#1f1f24' }}>
                  <KeyboardArrowDown sx={{ transform: 'rotate(180deg)', fontSize: 18 }} />
                </IconButton>
              </Box>

              <Box sx={{ display: 'grid', gap: 1.25 }}>
                {['Авто', 'Электроника', 'Недвижимость'].map((label) => (
                  <FormControlLabel
                    key={label}
                    control={
                      <Box
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
                          border: '1px solid #dbd7de',
                          borderRadius: '3px',
                          display: 'inline-block',
                        }}
                      />
                    }
                    label={label}
                    sx={{
                      m: 0,
                      alignItems: 'center',
                      '& .MuiFormControlLabel-label': {
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#3e3d45',
                      },
                    }}
                  />
                ))}
              </Box>

              <Divider sx={{ my: 2, borderColor: '#f0edf3' }} />

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                <Typography
                  sx={{
                    maxWidth: 116,
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 700,
                    fontSize: '14px',
                    lineHeight: '20px',
                    color: '#1f1f24',
                  }}
                >
                  Только требующие доработок
                </Typography>
                <Switch
                  checked={onlyNeedsRevision}
                  onChange={(event) => setOnlyNeedsRevision(event.target.checked)}
                  sx={{
                    width: 38,
                    height: 22,
                    p: 0,
                    '& .MuiSwitch-switchBase': {
                      p: '2px',
                      '&.Mui-checked': {
                        transform: 'translateX(16px)',
                        color: '#fff',
                        '& + .MuiSwitch-track': {
                          bgcolor: '#b8b5bc',
                          opacity: 1,
                        },
                      },
                    },
                    '& .MuiSwitch-thumb': {
                      width: 18,
                      height: 18,
                      boxShadow: 'none',
                    },
                    '& .MuiSwitch-track': {
                      borderRadius: '999px',
                      bgcolor: '#b8b5bc',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                mt: 1,
                height: 40,
                borderRadius: '10px',
                border: '1px solid #ece9f0',
                bgcolor: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '20px',
                color: '#9c99a1',
              }}
            >
              Сбросить фильтры
            </Box>
          </Box>

          <Box>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                gap: 1.75,
              }}
            >
              {filteredAds.map((ad) => (
                <Card
                  key={ad.id}
                  elevation={0}
                  sx={{
                    borderRadius: '16px',
                    border: '1px solid #ece9f0',
                    bgcolor: '#fff',
                    overflow: 'hidden',
                    boxShadow: 'none',
                  }}
                >
                  <Box
                    sx={{
                      height: 129,
                      bgcolor: '#fbfbfc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#a8a5ad',
                    }}
                  >
                    <ImageOutlined sx={{ fontSize: 64 }} />
                  </Box>

                  <CardContent sx={{ p: 1.5 }}>
                    <Chip
                      label={ad.category}
                      size="small"
                      sx={{
                        mb: 1.25,
                        height: 20,
                        borderRadius: '6px',
                        border: '1px solid #ddd8e0',
                        bgcolor: '#fff',
                        fontSize: '12px',
                        color: '#3e3d45',
                        '& .MuiChip-label': {
                          px: 1,
                        },
                      }}
                    />

                    <Typography
                      sx={{
                        mb: 0.5,
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: '#2b2a31',
                      }}
                    >
                      {ad.title}
                    </Typography>

                    <Typography
                      sx={{
                        fontFamily: 'Inter, sans-serif',
                        fontWeight: 700,
                        fontSize: '15px',
                        lineHeight: '22px',
                        color: '#818089',
                      }}
                    >
                      {ad.price}
                    </Typography>

                    {ad.needsRevision && (
                      <Chip
                        label="Требует доработок"
                        size="small"
                        sx={{
                          mt: 0.75,
                          height: 22,
                          borderRadius: '10px',
                          bgcolor: '#fff6e8',
                          color: '#f59e0b',
                          fontSize: '12px',
                          '& .MuiChip-label': {
                            px: 1,
                          },
                        }}
                      />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>

            <Box sx={{ mt: 1.25, display: 'flex', justifyContent: 'flex-start' }}>
              <Pagination
                count={5}
                page={1}
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                  '& .MuiPaginationItem-root': {
                    minWidth: 28,
                    height: 28,
                    borderRadius: '8px',
                    border: '1px solid #ddd8e0',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: '#5b5963',
                    bgcolor: '#fff',
                    m: 0.25,
                  },
                  '& .Mui-selected': {
                    borderColor: '#2f80ff',
                    color: '#2f80ff',
                    bgcolor: '#fff',
                  },
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

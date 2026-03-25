import type { CategoryOption, SortOption } from './types'

export const PAGE_SIZE = 10

export const categoryOptions: CategoryOption[] = [
  { key: 'auto', label: 'Авто' },
  { key: 'electronics', label: 'Электроника' },
  { key: 'real_estate', label: 'Недвижимость' },
]

export const sortOptions: SortOption[] = [
  {
    value: 'createdAtDesc',
    label: 'По новизне (сначала новые)',
    sortColumn: 'createdAt',
    sortDirection: 'desc',
  },
  {
    value: 'createdAtAsc',
    label: 'По новизне (сначала старые)',
    sortColumn: 'createdAt',
    sortDirection: 'asc',
  },
  {
    value: 'titleAsc',
    label: 'По названию (А → Я)',
    sortColumn: 'title',
    sortDirection: 'asc',
  },
  {
    value: 'titleDesc',
    label: 'По названию (Я → А)',
    sortColumn: 'title',
    sortDirection: 'desc',
  },
  {
    value: 'priceAsc',
    label: 'По цене (сначала дешевле)',
    sortColumn: 'price',
    sortDirection: 'asc',
  },
  {
    value: 'priceDesc',
    label: 'По цене (сначала дороже)',
    sortColumn: 'price',
    sortDirection: 'desc',
  },
]

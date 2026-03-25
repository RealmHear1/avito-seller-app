import { CATEGORY_LABELS } from './items'
import type { CategoryOption, SortOption } from '../types/ads'

export const PAGE_SIZE = 10

export const categoryOptions: CategoryOption[] = [
  { key: 'auto', label: CATEGORY_LABELS.auto },
  { key: 'electronics', label: CATEGORY_LABELS.electronics },
  { key: 'real_estate', label: CATEGORY_LABELS.real_estate },
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

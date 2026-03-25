import type { ItemCategory, ItemSortColumn, SortDirection } from '../../types/items'

export type ViewMode = 'grid' | 'list'

export type SortOption = {
  value: string
  label: string
  sortColumn: ItemSortColumn
  sortDirection: SortDirection
}

export type CategoryOption = {
  key: ItemCategory
  label: string
}

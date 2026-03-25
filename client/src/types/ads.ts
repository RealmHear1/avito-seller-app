import type { ItemCategory, ItemSortColumn, SortDirection } from './items'

export type ViewMode = 'grid' | 'list'

export type AdsListPersistedState = {
  currentPage: number
  isCategoriesOpen: boolean
  onlyNeedsRevision: boolean
  searchInput: string
  searchQuery: string
  selectedCategories: ItemCategory[]
  sortBy: string
  viewMode: ViewMode
}

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

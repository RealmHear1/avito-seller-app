import { sortOptions } from '../constants/ads'
import { ADS_LIST_STATE_KEY } from '../constants/storage'
import type { AdsListPersistedState } from '../types/ads'
import type { ItemCategory } from '../types/items'

export const defaultAdsListState: AdsListPersistedState = {
  currentPage: 1,
  isCategoriesOpen: true,
  onlyNeedsRevision: false,
  searchInput: '',
  searchQuery: '',
  selectedCategories: [],
  sortBy: 'createdAtDesc',
  viewMode: 'grid',
}

function isItemCategory(value: unknown): value is ItemCategory {
  return value === 'auto' || value === 'electronics' || value === 'real_estate'
}

export function readAdsListState(): AdsListPersistedState {
  if (typeof window === 'undefined') {
    return defaultAdsListState
  }

  const rawState = window.sessionStorage.getItem(ADS_LIST_STATE_KEY)

  if (!rawState) {
    return defaultAdsListState
  }

  try {
    const parsedState = JSON.parse(rawState) as Partial<AdsListPersistedState>

    return {
      currentPage:
        typeof parsedState.currentPage === 'number' && parsedState.currentPage > 0
          ? parsedState.currentPage
          : defaultAdsListState.currentPage,
      isCategoriesOpen: parsedState.isCategoriesOpen ?? defaultAdsListState.isCategoriesOpen,
      onlyNeedsRevision:
        parsedState.onlyNeedsRevision ?? defaultAdsListState.onlyNeedsRevision,
      searchInput:
        typeof parsedState.searchInput === 'string'
          ? parsedState.searchInput
          : defaultAdsListState.searchInput,
      searchQuery:
        typeof parsedState.searchQuery === 'string'
          ? parsedState.searchQuery
          : defaultAdsListState.searchQuery,
      selectedCategories: Array.isArray(parsedState.selectedCategories)
        ? parsedState.selectedCategories.filter(isItemCategory)
        : defaultAdsListState.selectedCategories,
      sortBy:
        typeof parsedState.sortBy === 'string' &&
        sortOptions.some((option) => option.value === parsedState.sortBy)
          ? parsedState.sortBy
          : defaultAdsListState.sortBy,
      viewMode: parsedState.viewMode === 'list' ? 'list' : defaultAdsListState.viewMode,
    }
  } catch {
    return defaultAdsListState
  }
}

export function writeAdsListState(state: AdsListPersistedState) {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(ADS_LIST_STATE_KEY, JSON.stringify(state))
}

export function compareNullableNumbers(
  left: number | null | undefined,
  right: number | null | undefined,
) {
  if (left == null && right == null) {
    return 0
  }

  if (left == null) {
    return 1
  }

  if (right == null) {
    return -1
  }

  return left - right
}

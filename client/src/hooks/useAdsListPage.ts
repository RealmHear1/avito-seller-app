import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItemById, getItems } from '../api/items'
import { PAGE_SIZE, sortOptions } from '../constants/ads'
import { ADS_COUNT_STALE_TIME, ADS_SEARCH_DEBOUNCE_MS, ADS_STALE_TIME } from '../constants/query'
import { readAdsListState, writeAdsListState } from '../helpers/adsListState'
import {
  buildItemsWithClientNeedsRevision,
  filterAdsItems,
  sortAdsItems,
} from '../helpers/adsListItems'
import { getAdDeclension } from '../helpers/declension'
import type { ViewMode } from '../types/ads'
import type { ItemCategory, ItemDetails } from '../types/items'

export function useAdsListPage() {
  const navigate = useNavigate()
  const [persistedState] = useState(readAdsListState)

  const [searchInput, setSearchInput] = useState(persistedState.searchInput)
  const [searchQuery, setSearchQuery] = useState(persistedState.searchQuery)
  const [sortBy, setSortBy] = useState(persistedState.sortBy)
  const [viewMode, setViewMode] = useState<ViewMode>(persistedState.viewMode)
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(persistedState.onlyNeedsRevision)
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>(
    persistedState.selectedCategories,
  )
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(persistedState.isCategoriesOpen)
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null)
  const [currentPage, setCurrentPage] = useState(persistedState.currentPage)
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedSearch = searchInput.trim()

      if (trimmedSearch === searchQuery) {
        return
      }

      setSearchQuery(trimmedSearch)
      setCurrentPage(1)
    }, ADS_SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput, searchQuery])

  const sortOption = useMemo(
    () => sortOptions.find((option) => option.value === sortBy) ?? sortOptions[0],
    [sortBy],
  )

  const adsCountQuery = useQuery({
    queryKey: ['ads-count'],
    queryFn: ({ signal }) =>
      getItems(
        {
          limit: 1,
          skip: 0,
        },
        signal,
      ),
    staleTime: ADS_COUNT_STALE_TIME,
  })

  const adsQuery = useQuery({
    queryKey: [
      'ads',
      {
        q: searchQuery,
      },
    ],
    queryFn: ({ signal }) =>
      getItems(
        {
          q: searchQuery,
          limit: 1000,
          skip: 0,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
    staleTime: ADS_STALE_TIME,
  })

  const adDetailsQueries = useQueries({
    queries: (adsQuery.data?.items ?? []).map((item) => ({
      queryKey: ['ad', item.id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getItemById(item.id, signal),
      staleTime: ADS_STALE_TIME,
    })),
  })

  const itemDetailsMap = useMemo(
    () =>
      new Map<number, ItemDetails>(
        adDetailsQueries.flatMap((query) =>
          query.data ? ([[query.data.id, query.data]] as const) : [],
        ),
      ),
    [adDetailsQueries],
  )

  const areDetailsPending = adDetailsQueries.some((query) => query.isPending)

  const itemsWithClientNeedsRevision = useMemo(
    () => buildItemsWithClientNeedsRevision(adsQuery.data?.items ?? [], itemDetailsMap),
    [adsQuery.data?.items, itemDetailsMap],
  )

  const filteredItems = useMemo(() => {
    return filterAdsItems(itemsWithClientNeedsRevision, selectedCategories, onlyNeedsRevision)
  }, [itemsWithClientNeedsRevision, onlyNeedsRevision, selectedCategories])

  const sortedItems = useMemo(() => {
    return sortAdsItems(filteredItems, itemDetailsMap, sortOption)
  }, [filteredItems, itemDetailsMap, sortOption])

  const headerTotalCount = adsCountQuery.data?.total ?? adsQuery.data?.total ?? 0
  const filteredCount = sortedItems.length
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const declension = getAdDeclension(headerTotalCount)
  const hasActiveFilters = selectedCategories.length > 0 || onlyNeedsRevision
  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    writeAdsListState({
      currentPage: safeCurrentPage,
      isCategoriesOpen,
      onlyNeedsRevision,
      searchInput,
      searchQuery,
      selectedCategories,
      sortBy,
      viewMode,
    })
  }, [
    isCategoriesOpen,
    onlyNeedsRevision,
    safeCurrentPage,
    searchInput,
    searchQuery,
    selectedCategories,
    sortBy,
    viewMode,
  ])

  const paginatedItems = useMemo(
    () =>
      sortedItems.slice(
        (safeCurrentPage - 1) * PAGE_SIZE,
        (safeCurrentPage - 1) * PAGE_SIZE + PAGE_SIZE,
      ),
    [safeCurrentPage, sortedItems],
  )

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput.trim())
    setCurrentPage(1)
  }

  const handleCategoryToggle = (categoryKey: ItemCategory) => {
    setSelectedCategories((previousCategories) =>
      previousCategories.includes(categoryKey)
        ? previousCategories.filter((item) => item !== categoryKey)
        : [...previousCategories, categoryKey],
    )
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setSelectedCategories([])
    setOnlyNeedsRevision(false)
    setCurrentPage(1)
  }

  const handleOpenAd = (id: number) => {
    navigate(`/ads/${id}`)
  }

  return {
    headerProps: {
      totalCount: headerTotalCount,
      declension,
    },
    toolbarProps: {
      searchInput,
      sortBy,
      sortMenuAnchor,
      sortOption,
      viewMode,
      isSortMenuOpen: Boolean(sortMenuAnchor),
      onSearchInputChange: setSearchInput,
      onSearchSubmit: handleSearchSubmit,
      onSortMenuClose: () => setSortMenuAnchor(null),
      onSortMenuOpen: setSortMenuAnchor,
      onSortChange: (value: string) => {
        setSortBy(value)
        setSortMenuAnchor(null)
        setCurrentPage(1)
      },
      onViewModeChange: setViewMode,
      sortOptions,
    },
    filtersProps: {
      hasActiveFilters,
      isCategoriesOpen,
      onlyNeedsRevision,
      selectedCategories,
      onCategoryToggle: handleCategoryToggle,
      onResetFilters: handleResetFilters,
      onToggleCategoriesOpen: () => setIsCategoriesOpen((previousValue) => !previousValue),
      onToggleNeedsRevision: () => {
        setOnlyNeedsRevision((previousValue) => !previousValue)
        setCurrentPage(1)
      },
    },
    resultsProps: {
      currentPage: safeCurrentPage,
      error: adsQuery.error,
      isError: adsQuery.isError,
      isFetching: adsQuery.isFetching,
      isPending: adsQuery.isPending || areDetailsPending,
      items: paginatedItems,
      pageNumbers,
      totalPages,
      viewMode,
      onOpenAd: handleOpenAd,
      onPageChange: setCurrentPage,
      onRetry: () => adsQuery.refetch(),
    },
  }
}

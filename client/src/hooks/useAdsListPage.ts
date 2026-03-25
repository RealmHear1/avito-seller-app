import { keepPreviousData, useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItemById, getItems } from '../api/items'
import { PAGE_SIZE, sortOptions } from '../components/ads/constants'
import type { ViewMode } from '../components/ads/types'
import { getAdDeclension } from '../helpers/declension'
import { getNeedsRevision } from '../helpers/itemPresentation'
import type { ItemCategory, ItemDetails } from '../types/items'

const ADS_LIST_STATE_KEY = 'ads-list-state'
type AdsListPersistedState = {
  currentPage: number
  isCategoriesOpen: boolean
  onlyNeedsRevision: boolean
  searchInput: string
  searchQuery: string
  selectedCategories: ItemCategory[]
  sortBy: string
  viewMode: ViewMode
}

function readPersistedState(): AdsListPersistedState {
  if (typeof window === 'undefined') {
    return {
      currentPage: 1,
      isCategoriesOpen: true,
      onlyNeedsRevision: false,
      searchInput: '',
      searchQuery: '',
      selectedCategories: [],
      sortBy: 'createdAtDesc',
      viewMode: 'grid',
    }
  }

  const rawState = window.sessionStorage.getItem(ADS_LIST_STATE_KEY)

  if (!rawState) {
    return {
      currentPage: 1,
      isCategoriesOpen: true,
      onlyNeedsRevision: false,
      searchInput: '',
      searchQuery: '',
      selectedCategories: [],
      sortBy: 'createdAtDesc',
      viewMode: 'grid',
    }
  }

  try {
    const parsedState = JSON.parse(rawState) as Partial<AdsListPersistedState>

    return {
      currentPage:
        typeof parsedState.currentPage === 'number' && parsedState.currentPage > 0
          ? parsedState.currentPage
          : 1,
      isCategoriesOpen: parsedState.isCategoriesOpen ?? true,
      onlyNeedsRevision: parsedState.onlyNeedsRevision ?? false,
      searchInput: typeof parsedState.searchInput === 'string' ? parsedState.searchInput : '',
      searchQuery: typeof parsedState.searchQuery === 'string' ? parsedState.searchQuery : '',
      selectedCategories: Array.isArray(parsedState.selectedCategories)
        ? parsedState.selectedCategories.filter((category): category is ItemCategory =>
            ['auto', 'electronics', 'real_estate'].includes(category),
          )
        : [],
      sortBy:
        typeof parsedState.sortBy === 'string' &&
        sortOptions.some((option) => option.value === parsedState.sortBy)
          ? parsedState.sortBy
          : 'createdAtDesc',
      viewMode: parsedState.viewMode === 'list' ? 'list' : 'grid',
    }
  } catch {
    return {
      currentPage: 1,
      isCategoriesOpen: true,
      onlyNeedsRevision: false,
      searchInput: '',
      searchQuery: '',
      selectedCategories: [],
      sortBy: 'createdAtDesc',
      viewMode: 'grid',
    }
  }
}

function compareNullableNumbers(left: number | null | undefined, right: number | null | undefined) {
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

export function useAdsListPage() {
  const navigate = useNavigate()
  const [persistedState] = useState(readPersistedState)

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
    }, 400)

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
    staleTime: 60_000,
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
    staleTime: 30_000,
  })

  const adDetailsQueries = useQueries({
    queries: (adsQuery.data?.items ?? []).map((item) => ({
      queryKey: ['ad', item.id],
      queryFn: ({ signal }: { signal: AbortSignal }) => getItemById(item.id, signal),
      staleTime: 30_000,
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
    () =>
      (adsQuery.data?.items ?? []).map((item) => {
        const itemDetails = itemDetailsMap.get(item.id)

        return {
          ...item,
          needsRevision: itemDetails ? getNeedsRevision(itemDetails) : item.needsRevision,
        }
      }),
    [adsQuery.data?.items, itemDetailsMap],
  )

  const filteredItems = useMemo(() => {
    let nextItems = itemsWithClientNeedsRevision

    if (selectedCategories.length > 0) {
      nextItems = nextItems.filter((item) => selectedCategories.includes(item.category))
    }

    if (onlyNeedsRevision) {
      nextItems = nextItems.filter((item) => item.needsRevision)
    }

    return nextItems
  }, [itemsWithClientNeedsRevision, onlyNeedsRevision, selectedCategories])

  const sortedItems = useMemo(() => {
    const nextItems = [...filteredItems]

    nextItems.sort((left, right) => {
      if (sortOption.sortColumn === 'title') {
        const titleComparison = left.title.localeCompare(right.title, 'ru', { sensitivity: 'base' })

        return sortOption.sortDirection === 'asc' ? titleComparison : -titleComparison
      }

      if (sortOption.sortColumn === 'price') {
        const priceComparison = compareNullableNumbers(left.price, right.price)

        return sortOption.sortDirection === 'asc' ? priceComparison : -priceComparison
      }

      const leftCreatedAt = itemDetailsMap.get(left.id)?.createdAt ?? ''
      const rightCreatedAt = itemDetailsMap.get(right.id)?.createdAt ?? ''
      const dateComparison = new Date(leftCreatedAt).getTime() - new Date(rightCreatedAt).getTime()

      return sortOption.sortDirection === 'asc' ? dateComparison : -dateComparison
    })

    return nextItems
  }, [filteredItems, itemDetailsMap, sortOption.sortColumn, sortOption.sortDirection])

  const headerTotalCount = adsCountQuery.data?.total ?? adsQuery.data?.total ?? 0
  const filteredCount = sortedItems.length
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const declension = getAdDeclension(headerTotalCount)
  const hasActiveFilters = selectedCategories.length > 0 || onlyNeedsRevision
  const safeCurrentPage = Math.min(currentPage, totalPages)

  useEffect(() => {
    window.sessionStorage.setItem(
      ADS_LIST_STATE_KEY,
      JSON.stringify({
        currentPage: safeCurrentPage,
        isCategoriesOpen,
        onlyNeedsRevision,
        searchInput,
        searchQuery,
        selectedCategories,
        sortBy,
        viewMode,
      } satisfies AdsListPersistedState),
    )
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

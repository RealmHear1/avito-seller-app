import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getItems } from '../api/items'
import { getAdDeclension } from '../helpers/declension'
import { PAGE_SIZE, sortOptions } from '../components/ads/constants'
import type { ViewMode } from '../components/ads/types'
import type { ItemCategory } from '../types/items'

export function useAdsListPage() {
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('createdAtDesc')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [onlyNeedsRevision, setOnlyNeedsRevision] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState<ItemCategory[]>([])
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true)
  const [sortMenuAnchor, setSortMenuAnchor] = useState<HTMLElement | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const trimmedSearch = searchInput.trim()
      setSearchQuery(trimmedSearch)
      setCurrentPage(1)
    }, 400)

    return () => window.clearTimeout(timeoutId)
  }, [searchInput])

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
        page: currentPage,
        categories: selectedCategories,
        needsRevision: onlyNeedsRevision,
        sortBy,
      },
    ],
    queryFn: ({ signal }) =>
      getItems(
        {
          q: searchQuery,
          limit: PAGE_SIZE,
          skip: (currentPage - 1) * PAGE_SIZE,
          categories: selectedCategories,
          needsRevision: onlyNeedsRevision,
          sortColumn: sortOption.sortColumn,
          sortDirection: sortOption.sortDirection,
        },
        signal,
      ),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  })

  const headerTotalCount = adsCountQuery.data?.total ?? adsQuery.data?.total ?? 0
  const filteredCount = adsQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE))
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)
  const declension = getAdDeclension(headerTotalCount)
  const hasActiveFilters = selectedCategories.length > 0 || onlyNeedsRevision
  const isSortMenuOpen = Boolean(sortMenuAnchor)

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
      isSortMenuOpen,
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
      currentPage,
      error: adsQuery.error,
      isError: adsQuery.isError,
      isFetching: adsQuery.isFetching,
      isPending: adsQuery.isPending,
      items: adsQuery.data?.items ?? [],
      pageNumbers,
      totalPages,
      viewMode,
      onOpenAd: handleOpenAd,
      onPageChange: setCurrentPage,
      onRetry: () => adsQuery.refetch(),
    },
  }
}

import { compareNullableNumbers } from './adsListState'
import { getNeedsRevision } from './itemPresentation'
import type { SortOption } from '../types/ads'
import type { ItemCategory, ItemDetails, ListItem } from '../types/items'

export function buildItemsWithClientNeedsRevision(
  items: ListItem[],
  itemDetailsMap: Map<number, ItemDetails>,
): ListItem[] {
  return items.map((item) => {
    const itemDetails = itemDetailsMap.get(item.id)

    return {
      ...item,
      needsRevision: itemDetails ? getNeedsRevision(itemDetails) : item.needsRevision,
    }
  })
}

export function filterAdsItems(
  items: ListItem[],
  selectedCategories: ItemCategory[],
  onlyNeedsRevision: boolean,
): ListItem[] {
  let nextItems = items

  if (selectedCategories.length > 0) {
    nextItems = nextItems.filter((item) => selectedCategories.includes(item.category))
  }

  if (onlyNeedsRevision) {
    nextItems = nextItems.filter((item) => item.needsRevision)
  }

  return nextItems
}

export function sortAdsItems(
  items: ListItem[],
  itemDetailsMap: Map<number, ItemDetails>,
  sortOption: SortOption,
): ListItem[] {
  const nextItems = [...items]

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
}

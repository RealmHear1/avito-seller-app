export type ItemCategory = 'auto' | 'real_estate' | 'electronics'

export type ItemSortColumn = 'title' | 'createdAt' | 'price'
export type SortDirection = 'asc' | 'desc'

export type AutoItemParams = {
  brand?: string
  model?: string
  yearOfManufacture?: number
  transmission?: 'automatic' | 'manual'
  mileage?: number
  enginePower?: number
}

export type RealEstateItemParams = {
  type?: 'flat' | 'house' | 'room'
  address?: string
  area?: number
  floor?: number
}

export type ElectronicsItemParams = {
  type?: 'phone' | 'laptop' | 'misc'
  brand?: string
  model?: string
  condition?: 'new' | 'used'
  color?: string
}

export type ListItem = {
  id: number
  category: ItemCategory
  title: string
  price: number | null
  needsRevision: boolean
}

type BaseItem = {
  id: number
  title: string
  description?: string
  price: number | null
  createdAt: string
  updatedAt: string
  needsRevision: boolean
}

export type AutoItem = BaseItem & {
  category: 'auto'
  params: AutoItemParams
}

export type RealEstateItem = BaseItem & {
  category: 'real_estate'
  params: RealEstateItemParams
}

export type ElectronicsItem = BaseItem & {
  category: 'electronics'
  params: ElectronicsItemParams
}

export type ItemDetails = AutoItem | RealEstateItem | ElectronicsItem

export type ItemUpdateInput =
  | {
      category: 'auto'
      title: string
      description?: string
      price: number
      params: AutoItemParams
    }
  | {
      category: 'real_estate'
      title: string
      description?: string
      price: number
      params: RealEstateItemParams
    }
  | {
      category: 'electronics'
      title: string
      description?: string
      price: number
      params: ElectronicsItemParams
    }

export type UpdateItemResponse = {
  success: boolean
}

export type ItemsListResponse = {
  items: ListItem[]
  total: number
}

export type ItemsListParams = {
  q?: string
  limit: number
  skip: number
  categories?: ItemCategory[]
  needsRevision?: boolean
  sortColumn?: ItemSortColumn
  sortDirection?: SortDirection
}

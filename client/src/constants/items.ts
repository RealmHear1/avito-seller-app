import type {
  AutoItemParams,
  ElectronicsItemParams,
  ItemCategory,
  RealEstateItemParams,
} from '../types/items'

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  auto: 'Авто',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

export const TRANSMISSION_LABELS: Record<NonNullable<AutoItemParams['transmission']>, string> = {
  automatic: 'Автомат',
  manual: 'Механика',
}

export const PROPERTY_TYPE_LABELS: Record<NonNullable<RealEstateItemParams['type']>, string> = {
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
}

export const ELECTRONICS_TYPE_LABELS: Record<
  NonNullable<ElectronicsItemParams['type']>,
  string
> = {
  laptop: 'Ноутбук',
  misc: 'Другое',
  phone: 'Телефон',
}

export const CONDITION_LABELS: Record<NonNullable<ElectronicsItemParams['condition']>, string> = {
  new: 'Новый',
  used: 'Б/у',
}

import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  ELECTRONICS_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from './items'

export const AD_DESCRIPTION_MAX_LENGTH = 1000
export const AD_EDIT_CARD_MAX_WIDTH = '942px'

export const adCategoryOptions = [
  { value: 'electronics', label: CATEGORY_LABELS.electronics },
  { value: 'auto', label: CATEGORY_LABELS.auto },
  { value: 'real_estate', label: CATEGORY_LABELS.real_estate },
] as const

export const electronicsTypeOptions = [
  { value: 'phone', label: ELECTRONICS_TYPE_LABELS.phone },
  { value: 'laptop', label: ELECTRONICS_TYPE_LABELS.laptop },
  { value: 'misc', label: ELECTRONICS_TYPE_LABELS.misc },
] as const

export const electronicsConditionOptions = [
  { value: 'new', label: CONDITION_LABELS.new },
  { value: 'used', label: CONDITION_LABELS.used },
] as const

export const realEstateTypeOptions = [
  { value: 'flat', label: PROPERTY_TYPE_LABELS.flat },
  { value: 'house', label: PROPERTY_TYPE_LABELS.house },
  { value: 'room', label: PROPERTY_TYPE_LABELS.room },
] as const

export const autoTransmissionOptions = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
] as const

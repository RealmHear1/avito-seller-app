import {
  CATEGORY_LABELS,
  CONDITION_LABELS,
  ELECTRONICS_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  TRANSMISSION_LABELS,
} from '../constants/items'
import type { LabeledValue } from '../types/common'
import type { ItemCategory, ItemDetails } from '../types/items'

function isEmptyValue(value: unknown): boolean {
  if (value == null) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  return false
}

export function getCategoryLabel(category: ItemCategory): string {
  return CATEGORY_LABELS[category]
}

export function formatPrice(price: number | null): string {
  if (price == null) {
    return 'Цена не указана'
  }

  return `${new Intl.NumberFormat('ru-RU').format(price)} ₽`
}

export function formatItemDate(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatItemDateTime(date: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  })
    .format(new Date(date))
    .replace(' в ', ' ')
}

export function getItemCharacteristics(item: ItemDetails): LabeledValue[] {
  if (item.category === 'auto') {
    return [
      { label: 'Марка', value: item.params.brand ?? '' },
      { label: 'Модель', value: item.params.model ?? '' },
      {
        label: 'Год выпуска',
        value: item.params.yearOfManufacture ? String(item.params.yearOfManufacture) : '',
      },
      {
        label: 'Коробка',
        value: item.params.transmission ? TRANSMISSION_LABELS[item.params.transmission] : '',
      },
      {
        label: 'Пробег',
        value: item.params.mileage
          ? `${new Intl.NumberFormat('ru-RU').format(item.params.mileage)} км`
          : '',
      },
      {
        label: 'Мощность',
        value: item.params.enginePower ? `${item.params.enginePower} л.с.` : '',
      },
    ].filter((entry) => entry.value)
  }

  if (item.category === 'real_estate') {
    return [
      {
        label: 'Тип',
        value: item.params.type ? PROPERTY_TYPE_LABELS[item.params.type] : '',
      },
      { label: 'Адрес', value: item.params.address ?? '' },
      {
        label: 'Площадь',
        value: item.params.area ? `${item.params.area} м²` : '',
      },
      {
        label: 'Этаж',
        value: item.params.floor ? String(item.params.floor) : '',
      },
    ].filter((entry) => entry.value)
  }

  return [
    {
      label: 'Тип',
      value: item.params.type ? ELECTRONICS_TYPE_LABELS[item.params.type] : '',
    },
    { label: 'Бренд', value: item.params.brand ?? '' },
    { label: 'Модель', value: item.params.model ?? '' },
    {
      label: 'Состояние',
      value: item.params.condition ? CONDITION_LABELS[item.params.condition] : '',
    },
    { label: 'Цвет', value: item.params.color ?? '' },
  ].filter((entry) => entry.value)
}

export function getMissingFieldLabels(item: ItemDetails): string[] {
  const fields: LabeledValue[] = []

  if (item.category === 'auto') {
    fields.push(
      { label: 'Марка', value: item.params.brand ?? '' },
      { label: 'Модель', value: item.params.model ?? '' },
      {
        label: 'Год выпуска',
        value: item.params.yearOfManufacture ? String(item.params.yearOfManufacture) : '',
      },
      {
        label: 'Коробка передач',
        value: item.params.transmission ?? '',
      },
      {
        label: 'Пробег',
        value: item.params.mileage ? String(item.params.mileage) : '',
      },
      {
        label: 'Мощность двигателя',
        value: item.params.enginePower ? String(item.params.enginePower) : '',
      },
    )
  } else if (item.category === 'real_estate') {
    fields.push(
      { label: 'Тип недвижимости', value: item.params.type ?? '' },
      { label: 'Адрес', value: item.params.address ?? '' },
      { label: 'Площадь', value: item.params.area ? String(item.params.area) : '' },
      { label: 'Этаж', value: item.params.floor ? String(item.params.floor) : '' },
    )
  } else {
    fields.push(
      { label: 'Тип устройства', value: item.params.type ?? '' },
      { label: 'Бренд', value: item.params.brand ?? '' },
      { label: 'Модель', value: item.params.model ?? '' },
      { label: 'Состояние', value: item.params.condition ?? '' },
      { label: 'Цвет', value: item.params.color ?? '' },
    )
  }

  if (isEmptyValue(item.description)) {
    fields.unshift({ label: 'Описание', value: '' })
  }

  return fields.filter((field) => isEmptyValue(field.value)).map((field) => field.label)
}

export function getNeedsRevision(item: ItemDetails): boolean {
  return getMissingFieldLabels(item).length > 0
}

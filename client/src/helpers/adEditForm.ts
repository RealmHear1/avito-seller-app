import { z } from 'zod'
import { AD_DESCRIPTION_MAX_LENGTH } from '../constants/adEdit'
import { getNeedsRevision } from './itemPresentation'
import type { ItemDetails, ItemUpdateInput } from '../types/items'

export const emptyParams = {
  address: '',
  area: '',
  brand: '',
  color: '',
  condition: '',
  enginePower: '',
  floor: '',
  mileage: '',
  model: '',
  transmission: '',
  type: '',
  yearOfManufacture: '',
}

export const adFormSchema = z.object({
  category: z
    .enum(['', 'auto', 'real_estate', 'electronics'])
    .refine((value) => value !== '', 'Категория должна быть выбрана'),
  title: z.string().trim().min(1, 'Название должно быть заполнено'),
  price: z
    .string()
    .trim()
    .min(1, 'Цена должна быть заполнена')
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
      'Укажите корректную цену',
    ),
  description: z
    .string()
    .max(
      AD_DESCRIPTION_MAX_LENGTH,
      `Описание должно быть не длиннее ${AD_DESCRIPTION_MAX_LENGTH} символов`,
    ),
  params: z.object({
    address: z.string(),
    area: z.string(),
    brand: z.string(),
    color: z.string(),
    condition: z.enum(['', 'new', 'used']),
    enginePower: z.string(),
    floor: z.string(),
    mileage: z.string(),
    model: z.string(),
    transmission: z.enum(['', 'automatic', 'manual']),
    type: z.string(),
    yearOfManufacture: z.string(),
  }),
})

export const adDraftSchema = z.object({
  category: z.enum(['', 'auto', 'real_estate', 'electronics']),
  title: z.string(),
  price: z.string(),
  description: z.string(),
  params: z.object({
    address: z.string(),
    area: z.string(),
    brand: z.string(),
    color: z.string(),
    condition: z.enum(['', 'new', 'used']),
    enginePower: z.string(),
    floor: z.string(),
    mileage: z.string(),
    model: z.string(),
    transmission: z.enum(['', 'automatic', 'manual']),
    type: z.string(),
    yearOfManufacture: z.string(),
  }),
})

export type AdFormValues = z.infer<typeof adFormSchema>

export function isValidPrice(value: string): boolean {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return false
  }

  const parsedValue = Number(trimmedValue)
  return !Number.isNaN(parsedValue) && parsedValue >= 0
}

export function mapItemToFormValues(item: ItemDetails): AdFormValues {
  return {
    category: item.category,
    description: item.description ?? '',
    price: item.price == null ? '' : String(item.price),
    title: item.title,
    params: {
      ...emptyParams,
      address: 'address' in item.params && item.params.address ? String(item.params.address) : '',
      area: 'area' in item.params && item.params.area ? String(item.params.area) : '',
      brand: 'brand' in item.params && item.params.brand ? String(item.params.brand) : '',
      color: 'color' in item.params && item.params.color ? String(item.params.color) : '',
      condition: 'condition' in item.params && item.params.condition ? item.params.condition : '',
      enginePower:
        'enginePower' in item.params && item.params.enginePower
          ? String(item.params.enginePower)
          : '',
      floor: 'floor' in item.params && item.params.floor ? String(item.params.floor) : '',
      mileage: 'mileage' in item.params && item.params.mileage ? String(item.params.mileage) : '',
      model: 'model' in item.params && item.params.model ? String(item.params.model) : '',
      transmission:
        'transmission' in item.params && item.params.transmission ? item.params.transmission : '',
      type: 'type' in item.params && item.params.type ? String(item.params.type) : '',
      yearOfManufacture:
        'yearOfManufacture' in item.params && item.params.yearOfManufacture
          ? String(item.params.yearOfManufacture)
          : '',
    },
  }
}

function toOptionalNumber(value: string): number | undefined {
  const trimmedValue = value.trim()

  if (!trimmedValue) {
    return undefined
  }

  const parsedValue = Number(trimmedValue)
  return Number.isNaN(parsedValue) ? undefined : parsedValue
}

function omitEmptyValues<T extends Record<string, unknown>>(value: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(value).filter(([, entryValue]) => {
      if (typeof entryValue === 'string') {
        return entryValue.trim().length > 0
      }

      return entryValue !== undefined && entryValue !== null
    }),
  ) as Partial<T>
}

export function buildUpdatePayload(values: AdFormValues): ItemUpdateInput {
  const title = values.title.trim()
  const description = values.description.trim()
  const basePayload = {
    category: values.category,
    description: description || undefined,
    price: Number(values.price),
    title,
  }

  if (values.category === 'auto') {
    return {
      ...basePayload,
      category: 'auto',
      params: omitEmptyValues({
        brand: values.params.brand,
        enginePower: toOptionalNumber(values.params.enginePower),
        mileage: toOptionalNumber(values.params.mileage),
        model: values.params.model,
        transmission: values.params.transmission || undefined,
        yearOfManufacture: toOptionalNumber(values.params.yearOfManufacture),
      }),
    }
  }

  if (values.category === 'real_estate') {
    return {
      ...basePayload,
      category: 'real_estate',
      params: omitEmptyValues({
        address: values.params.address,
        area: toOptionalNumber(values.params.area),
        floor: toOptionalNumber(values.params.floor),
        type: values.params.type || undefined,
      }),
    }
  }

  if (values.category === 'electronics') {
    return {
      ...basePayload,
      category: 'electronics',
      params: omitEmptyValues({
        brand: values.params.brand,
        color: values.params.color,
        condition: values.params.condition || undefined,
        model: values.params.model,
        type: values.params.type || undefined,
      }),
    }
  }

  throw new Error('Категория должна быть выбрана')
}

export function buildOptimisticItem(sourceItem: ItemDetails, values: AdFormValues): ItemDetails {
  const optimisticItem = {
    id: sourceItem.id,
    createdAt: sourceItem.createdAt,
    needsRevision: false,
    updatedAt: new Date().toISOString(),
    ...buildUpdatePayload(values),
  } as ItemDetails

  optimisticItem.needsRevision = getNeedsRevision(optimisticItem)

  return optimisticItem
}

export function parseSuggestedPrice(response: string): number | null {
  const normalizedResponse = response.replace(/\u00A0/g, ' ')

  const parseValueWithMagnitude = (rawValue: string, rawContext?: string): number | null => {
    const cleanedValue = rawValue.replace(',', '.').replace(/[^\d.]/g, '')

    if (!cleanedValue) {
      return null
    }

    const parsedBaseValue = Number(cleanedValue)

    if (Number.isNaN(parsedBaseValue)) {
      return null
    }

    const context = (rawContext ?? rawValue).toLowerCase()

    if (context.includes('млн')) {
      return Math.round(parsedBaseValue * 1_000_000)
    }

    if (context.includes('тыс')) {
      return Math.round(parsedBaseValue * 1_000)
    }

    return Math.round(parsedBaseValue)
  }

  const averageLineMatch = normalizedResponse.match(
    /Средняя цена\s*[:\-—]?\s*([\d][\d\s.,]*)(?:\s*(тыс|млн)\.?)?/iu,
  )

  if (averageLineMatch?.[1]) {
    const averageValue = parseValueWithMagnitude(
      averageLineMatch[1],
      `${averageLineMatch[1]} ${averageLineMatch[2] ?? ''}`,
    )

    if (averageValue != null) {
      return averageValue
    }
  }

  const normalRangeMatch = normalizedResponse.match(
    /Нормальное состояние\s*[:\-—]?\s*([\d][\d\s.,]*)(?:\s*(тыс|млн)\.?)?\s*[-–—]\s*([\d][\d\s.,]*)(?:\s*(тыс|млн)\.?)?/iu,
  )

  if (normalRangeMatch?.[1] && normalRangeMatch?.[3]) {
    const minValue = parseValueWithMagnitude(
      normalRangeMatch[1],
      `${normalRangeMatch[1]} ${normalRangeMatch[2] ?? ''}`,
    )
    const maxValue = parseValueWithMagnitude(
      normalRangeMatch[3],
      `${normalRangeMatch[3]} ${normalRangeMatch[4] ?? ''}`,
    )

    if (minValue != null && maxValue != null) {
      return Math.round((minValue + maxValue) / 2)
    }
  }

  const anyNumberMatch = normalizedResponse.match(/([\d][\d\s.,]*)(?:\s*(тыс|млн)\.?)?/iu)

  if (!anyNumberMatch?.[1]) {
    return null
  }

  return parseValueWithMagnitude(
    anyNumberMatch[1],
    `${anyNumberMatch[1]} ${anyNumberMatch[2] ?? ''}`,
  )
}

export function getDescriptionActionLabel(description: string): string {
  return description.trim().length > 0 ? 'Улучшить описание' : 'Придумать описание'
}

export function getWarningFieldKeys(values: AdFormValues): Set<string> {
  if (!values.category) {
    return new Set()
  }

  if (values.category === 'auto') {
    return new Set(
      [
        !values.params.brand.trim() ? 'params.brand' : null,
        !values.params.model.trim() ? 'params.model' : null,
        !values.params.yearOfManufacture.trim() ? 'params.yearOfManufacture' : null,
        !values.params.transmission ? 'params.transmission' : null,
        !values.params.mileage.trim() ? 'params.mileage' : null,
        !values.params.enginePower.trim() ? 'params.enginePower' : null,
      ].filter(Boolean) as string[],
    )
  }

  if (values.category === 'real_estate') {
    return new Set(
      [
        !values.params.type ? 'params.type' : null,
        !values.params.address.trim() ? 'params.address' : null,
        !values.params.area.trim() ? 'params.area' : null,
        !values.params.floor.trim() ? 'params.floor' : null,
      ].filter(Boolean) as string[],
    )
  }

  return new Set(
    [
      !values.params.type ? 'params.type' : null,
      !values.params.brand.trim() ? 'params.brand' : null,
      !values.params.model.trim() ? 'params.model' : null,
      !values.params.color.trim() ? 'params.color' : null,
      !values.params.condition ? 'params.condition' : null,
    ].filter(Boolean) as string[],
  )
}

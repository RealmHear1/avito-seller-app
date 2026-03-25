import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { getItemById, getRequestErrorMessage, updateItemById } from '../api/items'
import { getNeedsRevision } from '../helpers/itemPresentation'
import { useOllama } from '../hooks/useOllama'
import type {
  ItemDetails,
  ItemsListResponse,
  ItemUpdateInput,
} from '../types/items'

const emptyParams = {
  brand: '',
  model: '',
  yearOfManufacture: '',
  transmission: '',
  mileage: '',
  enginePower: '',
  type: '',
  address: '',
  area: '',
  floor: '',
  condition: '',
  color: '',
}

const adFormSchema = z.object({
  category: z.enum(['auto', 'real_estate', 'electronics']),
  title: z.string().trim().min(1, 'Введите название объявления'),
  price: z
    .string()
    .trim()
    .min(1, 'Укажите цену')
    .refine((value) => !Number.isNaN(Number(value)) && Number(value) >= 0, 'Укажите корректную цену'),
  description: z.string().max(1000, 'Описание должно быть не длиннее 1000 символов'),
  params: z.object({
    brand: z.string(),
    model: z.string(),
    yearOfManufacture: z.string(),
    transmission: z.enum(['', 'automatic', 'manual']),
    mileage: z.string(),
    enginePower: z.string(),
    type: z.string(),
    address: z.string(),
    area: z.string(),
    floor: z.string(),
    condition: z.enum(['', 'new', 'used']),
    color: z.string(),
  }),
})

type AdFormValues = z.infer<typeof adFormSchema>

function mapItemToFormValues(item: ItemDetails): AdFormValues {
  return {
    category: item.category,
    title: item.title,
    price: item.price == null ? '' : String(item.price),
    description: item.description ?? '',
    params: {
      ...emptyParams,
      brand: 'brand' in item.params && item.params.brand ? String(item.params.brand) : '',
      model: 'model' in item.params && item.params.model ? String(item.params.model) : '',
      yearOfManufacture:
        'yearOfManufacture' in item.params && item.params.yearOfManufacture
          ? String(item.params.yearOfManufacture)
          : '',
      transmission:
        'transmission' in item.params && item.params.transmission ? item.params.transmission : '',
      mileage: 'mileage' in item.params && item.params.mileage ? String(item.params.mileage) : '',
      enginePower:
        'enginePower' in item.params && item.params.enginePower ? String(item.params.enginePower) : '',
      type: 'type' in item.params && item.params.type ? String(item.params.type) : '',
      address: 'address' in item.params && item.params.address ? String(item.params.address) : '',
      area: 'area' in item.params && item.params.area ? String(item.params.area) : '',
      floor: 'floor' in item.params && item.params.floor ? String(item.params.floor) : '',
      condition: 'condition' in item.params && item.params.condition ? item.params.condition : '',
      color: 'color' in item.params && item.params.color ? String(item.params.color) : '',
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

function buildUpdatePayload(values: AdFormValues): ItemUpdateInput {
  const title = values.title.trim()
  const description = values.description.trim()
  const basePayload = {
    category: values.category,
    title,
    description: description || undefined,
    price: Number(values.price),
  }

  if (values.category === 'auto') {
    return {
      ...basePayload,
      category: 'auto',
      params: omitEmptyValues({
        brand: values.params.brand,
        model: values.params.model,
        yearOfManufacture: toOptionalNumber(values.params.yearOfManufacture),
        transmission: values.params.transmission || undefined,
        mileage: toOptionalNumber(values.params.mileage),
        enginePower: toOptionalNumber(values.params.enginePower),
      }),
    }
  }

  if (values.category === 'real_estate') {
    return {
      ...basePayload,
      category: 'real_estate',
      params: omitEmptyValues({
        type: values.params.type || undefined,
        address: values.params.address,
        area: toOptionalNumber(values.params.area),
        floor: toOptionalNumber(values.params.floor),
      }),
    }
  }

  return {
    ...basePayload,
    category: 'electronics',
    params: omitEmptyValues({
      type: values.params.type || undefined,
      brand: values.params.brand,
      model: values.params.model,
      condition: values.params.condition || undefined,
      color: values.params.color,
    }),
  }
}

function buildOptimisticItem(sourceItem: ItemDetails, values: AdFormValues): ItemDetails {
  const payload = buildUpdatePayload(values)
  const optimisticItem = {
    id: sourceItem.id,
    createdAt: sourceItem.createdAt,
    updatedAt: new Date().toISOString(),
    needsRevision: false,
    ...payload,
  } as ItemDetails

  optimisticItem.needsRevision = getNeedsRevision(optimisticItem)

  return optimisticItem
}

function parseSuggestedPrice(response: string): number | null {
  const priceMatch = response.match(/\d[\d\s]*/)

  if (!priceMatch) {
    return null
  }

  const normalizedValue = priceMatch[0].replace(/\s+/g, '')
  const parsedValue = Number(normalizedValue)

  return Number.isNaN(parsedValue) ? null : parsedValue
}

export function AdEditPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const itemId = Number(id)
  const draftStorageKey = `ad-edit-draft-${itemId}`

  const [pageError, setPageError] = useState<string | null>(null)
  const [draftRestored, setDraftRestored] = useState(false)
  const [suggestedDescription, setSuggestedDescription] = useState<string | null>(null)
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null)

  const itemQuery = useQuery({
    queryKey: ['ad', itemId],
    queryFn: ({ signal }) => getItemById(itemId, signal),
    enabled: Number.isFinite(itemId),
  })

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: {
      category: 'electronics',
      title: '',
      price: '',
      description: '',
      params: emptyParams,
    },
  })

  const { control, formState, getValues, handleSubmit, reset, setValue, watch } = form
  const selectedCategory = watch('category')
  const descriptionValue = watch('description')

  useEffect(() => {
    if (!itemQuery.data) {
      return
    }

    const savedDraft = window.localStorage.getItem(draftStorageKey)

    if (savedDraft) {
      try {
        const parsedDraft = adFormSchema.parse(JSON.parse(savedDraft))
        reset(parsedDraft)
        setDraftRestored(true)
        return
      } catch {
        window.localStorage.removeItem(draftStorageKey)
      }
    }

    reset(mapItemToFormValues(itemQuery.data))
    setDraftRestored(false)
  }, [draftStorageKey, itemQuery.data, reset])

  useEffect(() => {
    if (!itemQuery.data) {
      return
    }

    let timeoutId = 0
    const subscription = watch((values) => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        window.localStorage.setItem(draftStorageKey, JSON.stringify(values))
      }, 500)
    })

    return () => {
      subscription.unsubscribe()
      window.clearTimeout(timeoutId)
    }
  }, [draftStorageKey, itemQuery.data, watch])

  const getCurrentItemContext = () => {
    const values = getValues()

    return {
      title: values.title || itemQuery.data?.title || '',
      category: values.category || itemQuery.data?.category || 'electronics',
      price: Number(values.price || itemQuery.data?.price || 0),
      description: values.description,
      params: values.params,
    }
  }

  const { estimatePrice, generateDescription, isLoading: isAiLoading } = useOllama({
    onError: (error) => setPageError(error.message),
  })

  const updateMutation = useMutation({
    mutationFn: (values: AdFormValues) => updateItemById(itemId, buildUpdatePayload(values)),
    onMutate: async (values) => {
      setPageError(null)
      await queryClient.cancelQueries({ queryKey: ['ad', itemId] })
      await queryClient.cancelQueries({ queryKey: ['ads'] })

      const previousItem = queryClient.getQueryData<ItemDetails>(['ad', itemId])
      const previousAds = queryClient.getQueriesData<ItemsListResponse>({ queryKey: ['ads'] })

      if (previousItem) {
        const optimisticItem = buildOptimisticItem(previousItem, values)

        queryClient.setQueryData(['ad', itemId], optimisticItem)
        queryClient.setQueriesData<ItemsListResponse>({ queryKey: ['ads'] }, (currentData) => {
          if (!currentData) {
            return currentData
          }

          return {
            ...currentData,
            items: currentData.items.map((item) =>
              item.id === optimisticItem.id
                ? {
                    ...item,
                    title: optimisticItem.title,
                    price: optimisticItem.price,
                    category: optimisticItem.category,
                    needsRevision: optimisticItem.needsRevision,
                  }
                : item,
            ),
          }
        })
      }

      return { previousItem, previousAds }
    },
    onError: (error, _values, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(['ad', itemId], context.previousItem)
      }

      context?.previousAds.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      setPageError(getRequestErrorMessage(error))
    },
    onSuccess: () => {
      window.localStorage.removeItem(draftStorageKey)
      navigate(`/ads/${itemId}`)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ad', itemId] })
      await queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })

  const isBusy = updateMutation.isPending || isAiLoading

  const handleApplySuggestedDescription = () => {
    if (!suggestedDescription) {
      return
    }

    setValue('description', suggestedDescription, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setSuggestedDescription(null)
  }

  const handleApplySuggestedPrice = () => {
    if (suggestedPrice == null) {
      return
    }

    setValue('price', String(suggestedPrice), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setSuggestedPrice(null)
  }

  const handleGenerateDescription = async () => {
    setPageError(null)

    try {
      const description = await generateDescription(getCurrentItemContext())
      setSuggestedDescription(description)
    } catch {
      return
    }
  }

  const handleEstimatePrice = async () => {
    setPageError(null)

    try {
      const response = await estimatePrice(getCurrentItemContext())
      const parsedPrice = parseSuggestedPrice(response)

      if (parsedPrice == null) {
        setPageError('Модель не вернула распознаваемую цену.')
        return
      }

      setSuggestedPrice(parsedPrice)
    } catch {
      return
    }
  }

  if (!Number.isFinite(itemId)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Некорректный идентификатор объявления.</Alert>
      </Box>
    )
  }

  if (itemQuery.isPending) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (itemQuery.isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="error" onClick={() => itemQuery.refetch()}>
              Повторить
            </Button>
          }
        >
          {getRequestErrorMessage(itemQuery.error)}
        </Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#F7F5F8',
        px: '32px',
        py: '24px',
      }}
    >
      <Box sx={{ maxWidth: '1200px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start' }}>
          <Box>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '28px',
                lineHeight: '36px',
                color: 'rgba(0, 0, 0, 0.85)',
                mb: '8px',
              }}
            >
              Редактирование объявления
            </Typography>
            <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#848388' }}>
              Изменения автоматически сохраняются в черновик.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate(`/ads/${itemId}`)} disabled={isBusy}>
              Отменить
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit((values) => updateMutation.mutate(values))}
              disabled={isBusy}
              startIcon={updateMutation.isPending ? <CircularProgress size={18} color="inherit" /> : null}
            >
              {updateMutation.isPending ? 'Сохраняем...' : 'Сохранить'}
            </Button>
          </Box>
        </Box>

        {draftRestored && (
          <Alert severity="info">Черновик был восстановлен из localStorage. После сохранения он удалится.</Alert>
        )}

        {pageError && <Alert severity="error">{pageError}</Alert>}

        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1px solid #ECE9F0',
            backgroundColor: '#FFFFFF',
            p: '24px',
          }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Категория</InputLabel>
                  <Select {...field} label="Категория">
                    <MenuItem value="electronics">Электроника</MenuItem>
                    <MenuItem value="auto">Авто</MenuItem>
                    <MenuItem value="real_estate">Недвижимость</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Название"
                  error={Boolean(formState.errors.title)}
                  helperText={formState.errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Цена"
                  type="number"
                  error={Boolean(formState.errors.price)}
                  helperText={formState.errors.price?.message}
                />
              )}
            />

            <Box
              sx={{
                borderRadius: '12px',
                backgroundColor: '#F9F8FA',
                px: '16px',
                py: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography sx={{ fontFamily: 'Inter, sans-serif', fontSize: '14px', color: '#848388' }}>
                ID объявления
              </Typography>
              <Typography sx={{ fontFamily: 'Roboto, sans-serif', fontSize: '16px', color: '#1F1F24' }}>
                #{itemId}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mt: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#1F1F24',
              }}
            >
              Характеристики
            </Typography>

            {selectedCategory === 'auto' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '16px' }}>
                <Controller
                  control={control}
                  name="params.brand"
                  render={({ field }) => <TextField {...field} fullWidth label="Марка" />}
                />
                <Controller
                  control={control}
                  name="params.model"
                  render={({ field }) => <TextField {...field} fullWidth label="Модель" />}
                />
                <Controller
                  control={control}
                  name="params.yearOfManufacture"
                  render={({ field }) => <TextField {...field} fullWidth label="Год выпуска" type="number" />}
                />
                <Controller
                  control={control}
                  name="params.transmission"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Коробка передач</InputLabel>
                      <Select {...field} label="Коробка передач">
                        <MenuItem value="">Не выбрано</MenuItem>
                        <MenuItem value="automatic">Автомат</MenuItem>
                        <MenuItem value="manual">Механика</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="params.mileage"
                  render={({ field }) => <TextField {...field} fullWidth label="Пробег, км" type="number" />}
                />
                <Controller
                  control={control}
                  name="params.enginePower"
                  render={({ field }) => <TextField {...field} fullWidth label="Мощность, л.с." type="number" />}
                />
              </Box>
            )}

            {selectedCategory === 'real_estate' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <Controller
                  control={control}
                  name="params.type"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип недвижимости</InputLabel>
                      <Select {...field} label="Тип недвижимости">
                        <MenuItem value="">Не выбрано</MenuItem>
                        <MenuItem value="flat">Квартира</MenuItem>
                        <MenuItem value="house">Дом</MenuItem>
                        <MenuItem value="room">Комната</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="params.address"
                  render={({ field }) => <TextField {...field} fullWidth label="Адрес" />}
                />
                <Controller
                  control={control}
                  name="params.area"
                  render={({ field }) => <TextField {...field} fullWidth label="Площадь, м²" type="number" />}
                />
                <Controller
                  control={control}
                  name="params.floor"
                  render={({ field }) => <TextField {...field} fullWidth label="Этаж" type="number" />}
                />
              </Box>
            )}

            {selectedCategory === 'electronics' && (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '16px' }}>
                <Controller
                  control={control}
                  name="params.type"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Тип устройства</InputLabel>
                      <Select {...field} label="Тип устройства">
                        <MenuItem value="">Не выбрано</MenuItem>
                        <MenuItem value="phone">Телефон</MenuItem>
                        <MenuItem value="laptop">Ноутбук</MenuItem>
                        <MenuItem value="misc">Другое</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="params.condition"
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Состояние</InputLabel>
                      <Select {...field} label="Состояние">
                        <MenuItem value="">Не выбрано</MenuItem>
                        <MenuItem value="new">Новый</MenuItem>
                        <MenuItem value="used">Б/у</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  control={control}
                  name="params.brand"
                  render={({ field }) => <TextField {...field} fullWidth label="Бренд" />}
                />
                <Controller
                  control={control}
                  name="params.model"
                  render={({ field }) => <TextField {...field} fullWidth label="Модель" />}
                />
                <Controller
                  control={control}
                  name="params.color"
                  render={({ field }) => <TextField {...field} fullWidth label="Цвет" />}
                />
              </Box>
            )}
          </Box>

          <Box sx={{ mt: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#1F1F24',
              }}
            >
              Описание
            </Typography>

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  minRows={6}
                  label="Описание"
                  error={Boolean(formState.errors.description)}
                  helperText={
                    formState.errors.description?.message || `${descriptionValue.length}/1000 символов`
                  }
                />
              )}
            />

            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button
                variant="outlined"
                onClick={handleGenerateDescription}
                disabled={isBusy}
                startIcon={isAiLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isAiLoading ? 'Генерируем...' : 'Улучшить описание'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleEstimatePrice}
                disabled={isBusy}
                startIcon={isAiLoading ? <CircularProgress size={18} color="inherit" /> : null}
              >
                {isAiLoading ? 'Анализируем...' : 'Узнать рыночную цену'}
              </Button>
            </Box>
          </Box>
        </Paper>

        {suggestedDescription && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #CFE3FF',
              backgroundColor: '#F5FAFF',
              p: '20px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#1F1F24',
                mb: '10px',
              }}
            >
              Предложение от AI для описания
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '15px',
                lineHeight: '160%',
                color: '#3E3D45',
                whiteSpace: 'pre-wrap',
                mb: '16px',
              }}
            >
              {suggestedDescription}
            </Typography>
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={handleApplySuggestedDescription}>
                Применить
              </Button>
              <Button variant="outlined" onClick={() => setSuggestedDescription(null)}>
                Скрыть
              </Button>
            </Box>
          </Paper>
        )}

        {suggestedPrice != null && (
          <Paper
            elevation={0}
            sx={{
              borderRadius: '16px',
              border: '1px solid #CFE3FF',
              backgroundColor: '#F5FAFF',
              p: '20px',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Roboto, sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '24px',
                color: '#1F1F24',
                mb: '10px',
              }}
            >
              Предложение от AI по цене
            </Typography>
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                lineHeight: '160%',
                color: '#3E3D45',
                mb: '16px',
              }}
            >
              {suggestedPrice.toLocaleString('ru-RU')} ₽
            </Typography>
            <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={handleApplySuggestedPrice}>
                Применить
              </Button>
              <Button variant="outlined" onClick={() => setSuggestedPrice(null)}>
                Скрыть
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  )
}

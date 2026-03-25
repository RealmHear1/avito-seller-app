import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { getItemById, getRequestErrorMessage, updateItemById } from '../api/items'
import type {
  AdEditCategorySectionProps,
  AdEditCharacteristicsSectionProps,
  AdEditDescriptionSectionProps,
  AdEditFormActionsProps,
  AdEditPriceSectionProps,
  AdEditSaveNoticeProps,
  AdEditTitleSectionProps,
} from '../components/ad-edit'
import { EDIT_SUCCESS_NOTICE_KEY } from '../constants/storage'
import {
  adDraftSchema,
  adFormSchema,
  buildOptimisticItem,
  buildUpdatePayload,
  emptyParams,
  getDescriptionActionLabel,
  getWarningFieldKeys,
  isValidPrice,
  mapItemToFormValues,
  parseSuggestedPrice,
} from '../helpers/adEditForm'
import { useOllama } from './useOllama'
import type { AdFormValues } from '../helpers/adEditForm'
import type { AiPopoverState, AdEditSaveNotice as AdEditSaveNoticeType } from '../types/ad-edit'
import type { ItemDetails, ItemsListResponse } from '../types/items'

type UseAdEditPageResult = {
  pageState: {
    isInvalidId: boolean
    isLoading: boolean
    isError: boolean
    errorMessage: string
  }
  categorySectionProps: AdEditCategorySectionProps
  titleSectionProps: AdEditTitleSectionProps
  priceSectionProps: AdEditPriceSectionProps
  characteristicsSectionProps: AdEditCharacteristicsSectionProps
  descriptionSectionProps: AdEditDescriptionSectionProps
  formActionsProps: AdEditFormActionsProps
  saveNoticeProps: AdEditSaveNoticeProps
}

export function useAdEditPage(): UseAdEditPageResult {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { id } = useParams<{ id: string }>()
  const itemId = Number(id)
  const draftStorageKey = `ad-edit-draft-${itemId}`

  const [saveNotice, setSaveNotice] = useState<AdEditSaveNoticeType>(null)
  const [isSaveNoticeOpen, setIsSaveNoticeOpen] = useState(false)
  const [descriptionPopoverAnchor, setDescriptionPopoverAnchor] = useState<HTMLElement | null>(null)
  const [descriptionPopoverState, setDescriptionPopoverState] = useState<AiPopoverState>(null)
  const [pricePopoverAnchor, setPricePopoverAnchor] = useState<HTMLElement | null>(null)
  const [pricePopoverState, setPricePopoverState] = useState<AiPopoverState>(null)

  const cachedItem = queryClient.getQueryData<ItemDetails>(['ad', itemId])
  const itemQuery = useQuery({
    queryKey: ['ad', itemId],
    queryFn: ({ signal }) => getItemById(itemId, signal),
    enabled: Number.isFinite(itemId),
    initialData: cachedItem,
  })

  const itemData = itemQuery.data ?? cachedItem

  const form = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: {
      category: '',
      description: '',
      params: emptyParams,
      price: '',
      title: '',
    },
  })

  const { control, formState, getValues, handleSubmit, reset, setValue } = form

  const selectedCategory = useWatch({ control, name: 'category' }) ?? ''
  const descriptionValue = useWatch({ control, name: 'description' }) ?? ''
  const titleValue = useWatch({ control, name: 'title' }) ?? ''
  const priceValue = useWatch({ control, name: 'price' }) ?? ''
  const currentParams = useWatch({ control, name: 'params' }) ?? emptyParams

  const currentValues = useMemo<AdFormValues>(
    () => ({
      category: selectedCategory,
      description: descriptionValue,
      params: currentParams,
      price: priceValue,
      title: titleValue,
    }),
    [currentParams, descriptionValue, priceValue, selectedCategory, titleValue],
  )

  const savedValues = useMemo<AdFormValues>(
    () =>
      itemData
        ? mapItemToFormValues(itemData)
        : {
            category: '',
            description: '',
            params: emptyParams,
            price: '',
            title: '',
          },
    [itemData],
  )

  const warningFieldKeys = useMemo(() => getWarningFieldKeys(currentValues), [currentValues])

  useEffect(() => {
    if (!itemData) {
      return
    }

    const savedDraft = window.localStorage.getItem(draftStorageKey)

    if (savedDraft) {
      try {
        const parsedDraft = adDraftSchema.parse(JSON.parse(savedDraft))
        reset(parsedDraft)
        return
      } catch {
        window.localStorage.removeItem(draftStorageKey)
      }
    }

    reset(mapItemToFormValues(itemData))
  }, [draftStorageKey, itemData, reset])

  useEffect(() => {
    if (!itemData) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      window.localStorage.setItem(draftStorageKey, JSON.stringify(currentValues))
    }, 500)

    return () => window.clearTimeout(timeoutId)
  }, [currentValues, draftStorageKey, itemData])

  const getCurrentItemContext = () => {
    const values = getValues()

    return {
      category: values.category || itemData?.category || 'electronics',
      description: values.description,
      params: values.params,
      price: Number(values.price || itemData?.price || 0),
      title: values.title || itemData?.title || '',
    }
  }

  const descriptionAi = useOllama()
  const priceAi = useOllama()

  const updateMutation = useMutation({
    mutationFn: (values: AdFormValues) => updateItemById(itemId, buildUpdatePayload(values)),
    onMutate: async (values) => {
      setSaveNotice(null)
      setIsSaveNoticeOpen(false)

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

      return { previousAds, previousItem }
    },
    onError: (_error, _values, context) => {
      if (context?.previousItem) {
        queryClient.setQueryData(['ad', itemId], context.previousItem)
      }

      context?.previousAds.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data)
      })

      setSaveNotice({
        severity: 'error',
        message:
          'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
      })
      setIsSaveNoticeOpen(true)
    },
    onSuccess: () => {
      window.localStorage.removeItem(draftStorageKey)
      window.sessionStorage.setItem(
        EDIT_SUCCESS_NOTICE_KEY,
        JSON.stringify({
          severity: 'success',
          message: 'Изменения сохранены',
        }),
      )
      navigate(`/ads/${itemId}`)
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ad', itemId] })
      await queryClient.invalidateQueries({ queryKey: ['ads'] })
    },
  })

  const handleApplySuggestedDescription = () => {
    if (!descriptionPopoverState || descriptionPopoverState.type !== 'success') {
      return
    }

    setValue('description', descriptionPopoverState.content, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setDescriptionPopoverAnchor(null)
  }

  const handleApplySuggestedPrice = () => {
    if (
      !pricePopoverState ||
      pricePopoverState.type !== 'success' ||
      pricePopoverState.parsedPrice == null
    ) {
      return
    }

    setValue('price', String(pricePopoverState.parsedPrice), {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    })
    setPricePopoverAnchor(null)
  }

  const handleGenerateDescription = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const anchorElement = event.currentTarget

    setDescriptionPopoverAnchor(null)
    setDescriptionPopoverState(null)

    try {
      const description = await descriptionAi.generateDescription(getCurrentItemContext())
      setDescriptionPopoverState({
        type: 'success',
        content: description,
      })
      setDescriptionPopoverAnchor(anchorElement)
    } catch (error) {
      setDescriptionPopoverState({
        type: 'error',
        content: error instanceof Error ? error.message : 'Не удалось получить ответ от AI.',
      })
      setDescriptionPopoverAnchor(anchorElement)
    }
  }

  const handleEstimatePrice = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const anchorElement = event.currentTarget

    setPricePopoverAnchor(null)
    setPricePopoverState(null)

    try {
      const response = await priceAi.estimatePrice(getCurrentItemContext())
      const parsedPrice = parseSuggestedPrice(response)

      if (parsedPrice == null) {
        setPricePopoverState({
          type: 'error',
          content: 'Модель не вернула распознаваемую цену. Попробуйте повторить запрос.',
        })
        setPricePopoverAnchor(anchorElement)
        return
      }

      setPricePopoverState({
        type: 'success',
        content: response,
        parsedPrice,
      })
      setPricePopoverAnchor(anchorElement)
    } catch (error) {
      setPricePopoverState({
        type: 'error',
        content: error instanceof Error ? error.message : 'Не удалось получить ответ от AI.',
      })
      setPricePopoverAnchor(anchorElement)
    }
  }

  const handleCancel = () => {
    window.localStorage.removeItem(draftStorageKey)
    navigate(`/ads/${itemId}`)
  }

  const handleSubmitForm = handleSubmit((values) => updateMutation.mutate(values))

  const isSubmitDisabled =
    updateMutation.isPending || !selectedCategory || !titleValue.trim() || !isValidPrice(priceValue)

  const descriptionButtonLabel = descriptionAi.isLoading
    ? 'Выполняется запрос'
    : descriptionPopoverState
      ? 'Повторить запрос'
      : getDescriptionActionLabel(descriptionValue)

  const priceButtonLabel = priceAi.isLoading
    ? 'Выполняется запрос'
    : pricePopoverState
      ? 'Повторить запрос'
      : 'Узнать рыночную цену'

  return {
    pageState: {
      isInvalidId: !Number.isFinite(itemId),
      isLoading: itemQuery.isPending && !itemData,
      isError: itemQuery.isError && !itemData,
      errorMessage: itemQuery.error ? getRequestErrorMessage(itemQuery.error) : '',
    },
    titleSectionProps: {
      control,
      errors: formState.errors,
      savedTitle: savedValues.title,
      setValue,
    },
    categorySectionProps: {
      control,
    },
    priceSectionProps: {
      control,
      errors: formState.errors,
      savedPrice: savedValues.price,
      setValue,
      buttonLabel: priceButtonLabel,
      isLoading: priceAi.isLoading,
      onEstimatePrice: handleEstimatePrice,
      popoverAnchor: pricePopoverAnchor,
      popoverState: pricePopoverState,
      onApplySuggestedPrice: handleApplySuggestedPrice,
      onClosePopover: () => setPricePopoverAnchor(null),
    },
    characteristicsSectionProps: {
      control,
      selectedCategory,
      savedValues,
      warningFieldKeys,
      setValue,
    },
    descriptionSectionProps: {
      control,
      errors: formState.errors,
      descriptionValue,
      savedDescription: savedValues.description,
      buttonLabel: descriptionButtonLabel,
      isLoading: descriptionAi.isLoading,
      onGenerateDescription: handleGenerateDescription,
      popoverAnchor: descriptionPopoverAnchor,
      popoverState: descriptionPopoverState,
      onApplySuggestedDescription: handleApplySuggestedDescription,
      onClosePopover: () => setDescriptionPopoverAnchor(null),
    },
    formActionsProps: {
      isSubmitDisabled,
      isSubmitting: updateMutation.isPending,
      onSubmit: handleSubmitForm,
      onCancel: handleCancel,
    },
    saveNoticeProps: {
      notice: saveNotice,
      open: isSaveNoticeOpen,
      onClose: () => setIsSaveNoticeOpen(false),
      onExited: () => setSaveNotice(null),
    },
  }
}

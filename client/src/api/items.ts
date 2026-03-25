import type { AxiosError } from 'axios'
import { httpClient } from './http'
import type {
  ItemDetails,
  ItemsListParams,
  ItemsListResponse,
  ItemUpdateInput,
  UpdateItemResponse,
} from '../types/items'

export async function getItems(
  params: ItemsListParams,
  signal?: AbortSignal,
): Promise<ItemsListResponse> {
  const response = await httpClient.get<ItemsListResponse>('/items', {
    signal,
    params: {
      q: params.q || undefined,
      limit: params.limit,
      skip: params.skip,
      categories: params.categories?.length ? params.categories.join(',') : undefined,
      needsRevision: params.needsRevision || undefined,
      sortColumn: params.sortColumn,
      sortDirection: params.sortDirection,
    },
  })

  return response.data
}

export async function getItemById(id: number, signal?: AbortSignal): Promise<ItemDetails> {
  const response = await httpClient.get<ItemDetails>(`/items/${id}`, {
    signal,
  })

  return response.data
}

export async function updateItemById(
  id: number,
  data: ItemUpdateInput,
  signal?: AbortSignal,
): Promise<UpdateItemResponse> {
  const response = await httpClient.put<UpdateItemResponse>(`/items/${id}`, data, {
    signal,
  })

  return response.data
}

export function getRequestErrorMessage(error: unknown): string {
  const axiosError = error as AxiosError<{ error?: string }>

  return (
    axiosError.response?.data?.error ||
    axiosError.message ||
    'Не удалось выполнить запрос. Попробуйте ещё раз.'
  )
}

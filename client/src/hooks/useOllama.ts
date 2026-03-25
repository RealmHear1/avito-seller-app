import { useState } from 'react'
import ollama from 'ollama'

type OllamaItemContext = {
  title: string
  category: string
  price: number
  description?: string
  params?: Record<string, unknown>
}

interface UseOllamaOptions {
  model?: string
  onError?: (error: Error) => void
}

function sanitizeGeneratedDescription(text: string): string {
  return text
    .trim()
    .replace(/^["'«„“]+/u, '')
    .replace(/["'»“”]+$/u, '')
    .trim()
}

const categoryLabels: Record<string, string> = {
  auto: 'Авто',
  electronics: 'Электроника',
  real_estate: 'Недвижимость',
}

const paramLabels: Record<string, string> = {
  address: 'Адрес',
  area: 'Площадь',
  brand: 'Бренд',
  color: 'Цвет',
  condition: 'Состояние',
  enginePower: 'Мощность двигателя',
  floor: 'Этаж',
  mileage: 'Пробег',
  model: 'Модель',
  transmission: 'Коробка передач',
  type: 'Тип',
  yearOfManufacture: 'Год выпуска',
}

const valueLabels: Record<string, string> = {
  apartment: 'Квартира',
  automatic: 'Автомат',
  flat: 'Квартира',
  house: 'Дом',
  laptop: 'Ноутбук',
  manual: 'Механика',
  misc: 'Другое',
  new: 'Новый',
  phone: 'Телефон',
  room: 'Комната',
  used: 'Б/у',
}

function stringifyValue(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()

    if (!trimmed) {
      return ''
    }

    return valueLabels[trimmed] ?? trimmed
  }

  if (typeof value === 'number') {
    return String(value)
  }

  return ''
}

function formatParams(params?: Record<string, unknown>): string {
  if (!params) {
    return 'Нет дополнительных характеристик.'
  }

  const lines = Object.entries(params)
    .map(([key, value]) => {
      const formattedValue = stringifyValue(value)

      if (!formattedValue) {
        return null
      }

      return `- ${paramLabels[key] ?? key}: ${formattedValue}`
    })
    .filter(Boolean)

  return lines.length > 0 ? lines.join('\n') : 'Нет дополнительных характеристик.'
}

function getCategoryLabel(category: string): string {
  return categoryLabels[category] ?? category
}

export function useOllama(options: UseOllamaOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const model = import.meta.env.VITE_OLLAMA_MODEL || options.model || 'llama3'

  const generateDescription = async (item: OllamaItemContext): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты — опытный редактор объявлений для Авито.
Твоя задача — написать короткое, конкретное и продающее описание на русском языке.

Данные объявления:
- Название: ${item.title}
- Категория: ${getCategoryLabel(item.category)}
- Цена: ${item.price} руб.
- Текущее описание: ${item.description?.trim() || 'отсутствует'}
Характеристики:
${formatParams(item.params)}

Требования:
1. Напиши итоговое описание длиной 140-220 символов.
2. Используй 2-3 коротких предложения.
3. Делай текст конкретным и информативным, опирайся на характеристики товара.
4. Не используй списки, эмодзи, вводные слова и лишнюю воду.
5. Не пиши фразы вроде "идеальный выбор", "не упустите шанс", "отличный вариант".
6. Если описание уже есть, улучши его и сделай короче и полезнее.
7. Верни только итоговый текст описания без пояснений и заголовков.
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.35,
        },
      })

      return sanitizeGeneratedDescription(response.response)
    } catch (err) {
      const requestError = err as Error
      setError(requestError)
      options.onError?.(requestError)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const estimatePrice = async (item: OllamaItemContext): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты — аналитик рыночных цен для объявлений на Авито.
Оцени рынок по аналогичным товарам в России и верни три диапазона цен по качеству состояния.

Данные объявления:
- Название: ${item.title}
- Категория: ${getCategoryLabel(item.category)}
- Текущее описание: ${item.description?.trim() || 'отсутствует'}
Характеристики:
${formatParams(item.params)}

Важные правила:
1. Оценивай товар только по характеристикам, категории, состоянию и описанию.
2. Верни три диапазона:
- Отличное состояние
- Нормальное состояние
- Срочная продажа / есть недостатки
3. После диапазонов обязательно укажи отдельной строкой "Средняя цена: N руб.".
4. Средняя цена должна быть реалистичной рыночной оценкой для текущего объявления и обычно лежать ближе к центру нормального диапазона.
5. Дай один короткий комментарий на 1 предложение.
6. Пиши только на русском языке.
7. Не добавляй ничего кроме указанного формата.

Строгий формат ответа:
Отличное состояние: X-Y руб.
Нормальное состояние: X-Y руб.
Срочная продажа / есть недостатки: X-Y руб.
Средняя цена: N руб.
Комментарий: ...
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.1,
        },
      })

      return response.response.trim()
    } catch (err) {
      const requestError = err as Error
      setError(requestError)
      options.onError?.(requestError)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  const generateChatResponse = async (
    message: string,
    context: {
      title: string
      category: string
      price: number
      description?: string
    },
  ): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты — AI-ассистент для Авито. Помоги пользователю улучшить объявление.

Контекст объявления:
- Название: ${context.title}
- Категория: ${getCategoryLabel(context.category)}
- Цена: ${context.price} руб.
- Описание: ${context.description || 'отсутствует'}

Вопрос пользователя: ${message}

Требования:
1. Отвечай только на русском языке.
2. Отвечай коротко, в 1-3 предложениях.
3. Давай конкретные и полезные советы.
4. Учитывай контекст объявления.
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
        options: {
          temperature: 0.4,
        },
      })

      return response.response.trim()
    } catch (err) {
      const requestError = err as Error
      setError(requestError)
      options.onError?.(requestError)
      throw requestError
    } finally {
      setIsLoading(false)
    }
  }

  return {
    generateDescription,
    estimatePrice,
    generateChatResponse,
    isLoading,
    error,
  }
}

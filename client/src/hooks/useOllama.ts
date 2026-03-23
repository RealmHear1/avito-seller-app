import { useState } from 'react'
import ollama from 'ollama'

interface UseOllamaOptions {
  model?: string
  onError?: (error: Error) => void
}

export function useOllama(options: UseOllamaOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const model = import.meta.env.VITE_OLLAMA_MODEL || options.model || 'llama3.2:3b'

  const generateDescription = async (item: {
    title: string
    category: string
    price: number
    description?: string
    params?: Record<string, any>
  }): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты - профессиональный копирайтер для Авито. Напиши улучшенное описание объявления на русском языке.

Текущие данные:
- Название: ${item.title}
- Категория: ${item.category}
- Текущее описание: ${item.description || 'отсутствует'}

Требования:
1. Напиши продающее описание на русском языке (200-500 символов)
2. Укажи ключевые преимущества товара
3. НЕ используй emojis
4. Добавь призыв к действию
5. Учитывай категорию товара
6. Сделай текст привлекательным для покупателей

Ответ: только описание без лишнего текста:
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
      })

      return response.response.trim()
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const estimatePrice = async (item: {
    title: string
    category: string
    price: number
    params?: Record<string, any>
    description?: string
  }): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты - эксперт по оценке рыночной стоимости товаров для Авито. Оцени стоимость этого товара на русском рынке.

Данные товара:
- Название: ${item.title}
- Категория: ${item.category}
- Текущая цена: ${item.price} руб.
- Описание: ${item.description || 'отсутствует'}

Требования:
1. Назови среднюю рыночную цену в русских рублях
2. Учти состояние и популярность товара
3. Дай краткое обоснование (1 предложение)
4. Ответ на русском языке

Формат ответа:
"Рыночная цена: X руб. [обоснование]"
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
      })

      const priceText = response.response.trim()
      const priceMatch = priceText.match(/\d+/)
      if (!priceMatch) {
        throw new Error('Не удалось извлечь цену из ответа')
      }
      
      return priceText
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
      throw error
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
    }
  ): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты - AI-ассистент для Авито. Помоги пользователю с объявлением на русском языке.

Контекст объявления:
- Название: ${context.title}
- Категория: ${context.category}
- Цена: ${context.price} руб.
- Описание: ${context.description || 'отсутствует'}

Вопрос пользователя: ${message}

Требования:
1. Отвечай только на русском языке
2. Отвечай коротко (1-3 предложения)
3. Используй контекст объявления
4. Будь дружелюбным и профессиональным
5. Давай конкретные полезные советы

Ответ: `

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
      })

      return response.response.trim()
    } catch (err) {
      const error = err as Error
      setError(error)
      options.onError?.(error)
      throw error
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

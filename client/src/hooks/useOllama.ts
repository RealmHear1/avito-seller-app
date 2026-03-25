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

export function useOllama(options: UseOllamaOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const model = import.meta.env.VITE_OLLAMA_MODEL || options.model || 'llama3.2:3b'

  const generateDescription = async (item: OllamaItemContext): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты — профессиональный копирайтер для Авито. Напиши улучшенное описание объявления на русском языке.

Текущие данные:
- Название: ${item.title}
- Категория: ${item.category}
- Цена: ${item.price} руб.
- Текущее описание: ${item.description || 'отсутствует'}

Требования:
1. Напиши продающее описание на русском языке объёмом 200-300 символов.
2. Укажи ключевые преимущества товара.
3. Не используй эмодзи.
4. Добавь мягкий призыв к действию.
5. Учитывай категорию товара.
6. Ответ должен содержать только итоговое описание без пояснений.
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
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

  const estimatePrice = async (item: OllamaItemContext): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const prompt = `
Ты — эксперт по оценке рыночной стоимости товаров для Авито. Оцени стоимость этого товара на российском рынке.

Данные товара:
- Название: ${item.title}
- Категория: ${item.category}
- Текущая цена: ${item.price} руб.
- Описание: ${item.description || 'отсутствует'}

Требования:
1. Назови примерную рыночную цену в рублях.
2. Дай короткое объяснение в одном предложении.
3. Ответь только на русском языке.

Формат ответа:
Рыночная цена: X руб. Короткое обоснование.
`

      const response = await ollama.generate({
        model,
        prompt,
        stream: false,
      })

      const priceText = response.response.trim()
      const priceMatch = priceText.match(/\d+/)

      if (!priceMatch) {
        throw new Error('Не удалось извлечь цену из ответа модели.')
      }

      return priceText
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
- Категория: ${context.category}
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

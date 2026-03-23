import { useOllama } from '../hooks/useOllama'

export const aiService = {

  async generateDescription(item: {
    title: string
    category: string
    price: number
    description?: string
    params?: Record<string, any>
  }): Promise<string> {
    const { generateDescription } = useOllama()
    return generateDescription(item)
  },

  async estimatePrice(item: {
    title: string
    category: string
    price: number
    params?: Record<string, any>
    description?: string
  }): Promise<string> {
    const { estimatePrice } = useOllama()
    return estimatePrice(item)
  },

  async generateChatResponse(
    message: string,
    context: {
      title: string
      category: string
      price: number
      description?: string
    }
  ): Promise<string> {
    const { generateChatResponse } = useOllama()
    return generateChatResponse(message, context)
  },
}

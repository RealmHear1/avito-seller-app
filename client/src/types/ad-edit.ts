export type AiPopoverState =
  | {
      type: 'success'
      content: string
      parsedPrice?: number
    }
  | {
      type: 'error'
      content: string
    }
  | null

export type AdEditSaveNotice = {
  severity: 'success' | 'error'
  message: string
} | null

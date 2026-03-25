import type { LabeledValue } from './common'
import type { ItemDetails } from './items'

export type AdDetailsViewProps = {
  item: ItemDetails
  characteristics: LabeledValue[]
  createdAtLabel: string
  missingFields: string[]
  onBack: () => void
  onEdit: () => void
  priceLabel: string
  updatedAtLabel?: string
}

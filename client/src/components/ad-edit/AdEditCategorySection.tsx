import { Controller } from 'react-hook-form'
import { AdEditSelectField } from './AdEditSelectField'
import type { Control } from 'react-hook-form'
import type { AdFormValues } from '../../helpers/adEditForm'
import { adCategoryOptions } from '../../constants/adEdit'

export type AdEditCategorySectionProps = {
  control: Control<AdFormValues>
}

export function AdEditCategorySection({ control }: AdEditCategorySectionProps) {
  return (
    <Controller
      control={control}
      name="category"
      render={({ field }) => (
        <AdEditSelectField
          label="Категория"
          value={field.value}
          options={adCategoryOptions}
          onChange={field.onChange}
          width="256px"
        />
      )}
    />
  )
}

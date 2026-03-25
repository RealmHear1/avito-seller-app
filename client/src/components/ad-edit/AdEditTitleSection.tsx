import { Controller } from 'react-hook-form'
import { AdEditTextField } from './AdEditTextField'
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { AdFormValues } from '../../helpers/adEditForm'

export type AdEditTitleSectionProps = {
  control: Control<AdFormValues>
  errors: FieldErrors<AdFormValues>
  savedTitle: string
  setValue: UseFormSetValue<AdFormValues>
}

export function AdEditTitleSection({
  control,
  errors,
  savedTitle,
  setValue,
}: AdEditTitleSectionProps) {
  return (
    <Controller
      control={control}
      name="title"
      render={({ field }) => (
        <AdEditTextField
          label="Название"
          required
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          errorText={errors.title?.message}
          placeholder={savedTitle || 'Название'}
          width="456px"
          onClear={() =>
            setValue('title', '', {
              shouldDirty: true,
              shouldTouch: true,
              shouldValidate: true,
            })
          }
        />
      )}
    />
  )
}

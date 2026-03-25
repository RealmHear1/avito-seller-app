import { Controller } from 'react-hook-form'
import { Box } from '@mui/material'
import { AdAiActionButton } from './AdAiActionButton'
import { AdAiSuggestionPopover } from './AdAiSuggestionPopover'
import { AdEditTextField } from './AdEditTextField'
import type { Control, FieldErrors, UseFormSetValue } from 'react-hook-form'
import type { AdFormValues } from '../../helpers/adEditForm'
import type { AiPopoverState } from '../../types/ad-edit'

export type AdEditPriceSectionProps = {
  control: Control<AdFormValues>
  errors: FieldErrors<AdFormValues>
  savedPrice: string
  setValue: UseFormSetValue<AdFormValues>
  buttonLabel: string
  isLoading: boolean
  onEstimatePrice: (event: React.MouseEvent<HTMLButtonElement>) => void
  popoverAnchor: HTMLElement | null
  popoverState: AiPopoverState
  onApplySuggestedPrice: () => void
  onClosePopover: () => void
}

export function AdEditPriceSection({
  control,
  errors,
  savedPrice,
  setValue,
  buttonLabel,
  isLoading,
  onEstimatePrice,
  popoverAnchor,
  popoverState,
  onApplySuggestedPrice,
  onClosePopover,
}: AdEditPriceSectionProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
      <Controller
        control={control}
        name="price"
        render={({ field }) => (
          <AdEditTextField
            label="Цена"
            required
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorText={errors.price?.message}
            type="number"
            placeholder={savedPrice || 'Цена'}
            width="456px"
            onClear={() =>
              setValue('price', '', {
                shouldDirty: true,
                shouldTouch: true,
                shouldValidate: true,
              })
            }
          />
        )}
      />

      <Box sx={{ pt: '30px' }}>
        <Box sx={{ position: 'relative', width: 'fit-content' }}>
          <AdAiActionButton
            label={buttonLabel}
            loading={isLoading}
            onClick={onEstimatePrice}
            width="210px"
            height="32px"
            iconSrc={popoverState && !isLoading ? '/icons/redo.svg' : '/icons/lamp.svg'}
          />
          {popoverState ? (
            <AdAiSuggestionPopover
              anchorEl={popoverAnchor}
              open={Boolean(popoverAnchor && popoverState)}
              content={popoverState.content}
              isError={popoverState.type === 'error'}
              onApply={popoverState.type === 'success' ? onApplySuggestedPrice : undefined}
              onClose={onClosePopover}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  )
}

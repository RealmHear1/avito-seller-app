import { Controller } from 'react-hook-form'
import { Box, Typography } from '@mui/material'
import { AdAiActionButton } from './AdAiActionButton'
import { AdAiSuggestionPopover } from './AdAiSuggestionPopover'
import { AdEditTextField } from './AdEditTextField'
import { AD_DESCRIPTION_MAX_LENGTH } from '../../constants/adEdit'
import type { Control, FieldErrors } from 'react-hook-form'
import type { AdFormValues } from '../../helpers/adEditForm'
import type { AiPopoverState } from '../../types/ad-edit'

export type AdEditDescriptionSectionProps = {
  control: Control<AdFormValues>
  errors: FieldErrors<AdFormValues>
  descriptionValue: string
  savedDescription: string
  buttonLabel: string
  isLoading: boolean
  onGenerateDescription: (event: React.MouseEvent<HTMLButtonElement>) => void
  popoverAnchor: HTMLElement | null
  popoverState: AiPopoverState
  onApplySuggestedDescription: () => void
  onClosePopover: () => void
}

export function AdEditDescriptionSection({
  control,
  errors,
  descriptionValue,
  savedDescription,
  buttonLabel,
  isLoading,
  onGenerateDescription,
  popoverAnchor,
  popoverState,
  onApplySuggestedDescription,
  onClosePopover,
}: AdEditDescriptionSectionProps) {
  return (
    <Box sx={{ width: '942px', maxWidth: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography
        sx={{
          mb: '8px',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '140%',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        Описание
      </Typography>

      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <AdEditTextField
            label=""
            value={field.value}
            onChange={field.onChange}
            onBlur={field.onBlur}
            errorText={errors.description?.message}
            multiline
            rows={1}
            width="100%"
            clearable={false}
            placeholder={savedDescription || 'Описание'}
            textFieldSx={{ minHeight: '60px' }}
            inputSx={{ minHeight: '60px', maxHeight: '300px' }}
          />
        )}
      />

      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{ mt: '10px' }}>
          <Box sx={{ position: 'relative', width: 'fit-content' }}>
            <AdAiActionButton
              label={buttonLabel}
              loading={isLoading}
              onClick={onGenerateDescription}
              width="205px"
              iconSrc={popoverState && !isLoading ? '/icons/redo.svg' : '/icons/lamp.svg'}
            />
            {popoverState ? (
              <AdAiSuggestionPopover
                anchorEl={popoverAnchor}
                open={Boolean(popoverAnchor && popoverState)}
                content={popoverState.content}
                isError={popoverState.type === 'error'}
                onApply={popoverState.type === 'success' ? onApplySuggestedDescription : undefined}
                onClose={onClosePopover}
              />
            ) : null}
          </Box>
        </Box>

        <Typography
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 400,
            fontSize: '14px',
            lineHeight: '22px',
            color: '#B8B5BC',
            textAlign: 'right',
          }}
        >
          {descriptionValue.length} / {AD_DESCRIPTION_MAX_LENGTH}
        </Typography>
      </Box>
    </Box>
  )
}

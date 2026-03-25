import { Alert, Box, CircularProgress, Typography } from '@mui/material'
import {
  AdEditCategorySection,
  AdEditCharacteristicsSection,
  AdEditDescriptionSection,
  AdEditFormActions,
  AdEditPriceSection,
  AdEditSaveNotice,
  AdEditSectionDivider,
  AdEditTitleSection,
} from '../components/ad-edit'
import { AD_EDIT_CARD_MAX_WIDTH } from '../constants/adEdit'
import { useAdEditPage } from '../hooks/useAdEditPage'

export function AdEditPage() {
  const {
    pageState,
    categorySectionProps,
    titleSectionProps,
    priceSectionProps,
    characteristicsSectionProps,
    descriptionSectionProps,
    formActionsProps,
    saveNoticeProps,
  } = useAdEditPage()

  if (pageState.isInvalidId) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Некорректный идентификатор объявления.</Alert>
      </Box>
    )
  }

  if (pageState.isLoading) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (pageState.isError) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{pageState.errorMessage}</Alert>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FFFFFF',
        pt: '32px',
        pr: '32px',
        pb: '48px',
        pl: '32px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: AD_EDIT_CARD_MAX_WIDTH,
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
        }}
      >
        <Typography
          component="h1"
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
            fontSize: '30px',
            lineHeight: '40px',
            color: 'rgba(0, 0, 0, 0.85)',
          }}
        >
          Редактирование объявления
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <AdEditCategorySection control={categorySectionProps.control} />
          <AdEditSectionDivider />

          <AdEditTitleSection
            control={titleSectionProps.control}
            errors={titleSectionProps.errors}
            savedTitle={titleSectionProps.savedTitle}
            setValue={titleSectionProps.setValue}
          />
          <AdEditSectionDivider />

          <AdEditPriceSection
            control={priceSectionProps.control}
            errors={priceSectionProps.errors}
            savedPrice={priceSectionProps.savedPrice}
            setValue={priceSectionProps.setValue}
            buttonLabel={priceSectionProps.buttonLabel}
            isLoading={priceSectionProps.isLoading}
            onEstimatePrice={priceSectionProps.onEstimatePrice}
            popoverAnchor={priceSectionProps.popoverAnchor}
            popoverState={priceSectionProps.popoverState}
            onApplySuggestedPrice={priceSectionProps.onApplySuggestedPrice}
            onClosePopover={priceSectionProps.onClosePopover}
          />
          <AdEditSectionDivider />

          <AdEditCharacteristicsSection
            control={characteristicsSectionProps.control}
            selectedCategory={characteristicsSectionProps.selectedCategory}
            savedValues={characteristicsSectionProps.savedValues}
            warningFieldKeys={characteristicsSectionProps.warningFieldKeys}
            setValue={characteristicsSectionProps.setValue}
          />
          <AdEditSectionDivider />

          <AdEditDescriptionSection
            control={descriptionSectionProps.control}
            errors={descriptionSectionProps.errors}
            descriptionValue={descriptionSectionProps.descriptionValue}
            savedDescription={descriptionSectionProps.savedDescription}
            buttonLabel={descriptionSectionProps.buttonLabel}
            isLoading={descriptionSectionProps.isLoading}
            onGenerateDescription={descriptionSectionProps.onGenerateDescription}
            popoverAnchor={descriptionSectionProps.popoverAnchor}
            popoverState={descriptionSectionProps.popoverState}
            onApplySuggestedDescription={descriptionSectionProps.onApplySuggestedDescription}
            onClosePopover={descriptionSectionProps.onClosePopover}
          />

          <AdEditFormActions
            isSubmitDisabled={formActionsProps.isSubmitDisabled}
            isSubmitting={formActionsProps.isSubmitting}
            onSubmit={formActionsProps.onSubmit}
            onCancel={formActionsProps.onCancel}
          />
        </Box>
      </Box>

      <AdEditSaveNotice
        notice={saveNoticeProps.notice}
        open={saveNoticeProps.open}
        onClose={saveNoticeProps.onClose}
        onExited={saveNoticeProps.onExited}
      />
    </Box>
  )
}

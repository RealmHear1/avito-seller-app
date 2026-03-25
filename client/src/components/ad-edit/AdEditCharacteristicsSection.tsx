import { Controller } from 'react-hook-form'
import { Box, Typography } from '@mui/material'
import {
  autoTransmissionOptions,
  electronicsConditionOptions,
  electronicsTypeOptions,
  realEstateTypeOptions,
} from '../../constants/adEdit'
import { AdEditSelectField } from './AdEditSelectField'
import { AdEditTextField } from './AdEditTextField'
import type { Control, UseFormSetValue } from 'react-hook-form'
import type { AdFormValues } from '../../helpers/adEditForm'

export type AdEditCharacteristicsSectionProps = {
  control: Control<AdFormValues>
  selectedCategory: AdFormValues['category']
  savedValues: AdFormValues
  warningFieldKeys: Set<string>
  setValue: UseFormSetValue<AdFormValues>
}

const characteristicFieldLabelSx = {
  fontFamily: 'Roboto, sans-serif',
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '22px',
  color: 'rgba(0, 0, 0, 0.85)',
} as const

export function AdEditCharacteristicsSection({
  control,
  selectedCategory,
  savedValues,
  warningFieldKeys,
  setValue,
}: AdEditCharacteristicsSectionProps) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '140%',
          color: 'rgba(0, 0, 0, 0.85)',
        }}
      >
        Характеристики
      </Typography>

      {selectedCategory === 'auto' ? (
        <>
          <Controller
            control={control}
            name="params.brand"
            render={({ field }) => (
              <AdEditTextField
                label="Марка"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.brand')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.brand || 'Марка'}
                onClear={() => setValue('params.brand', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.model"
            render={({ field }) => (
              <AdEditTextField
                label="Модель"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.model')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.model || 'Модель'}
                onClear={() => setValue('params.model', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.yearOfManufacture"
            render={({ field }) => (
              <AdEditTextField
                label="Год выпуска"
                value={field.value}
                onChange={field.onChange}
                type="number"
                warning={warningFieldKeys.has('params.yearOfManufacture')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.yearOfManufacture || 'Год выпуска'}
                onClear={() => setValue('params.yearOfManufacture', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.transmission"
            render={({ field }) => (
              <AdEditSelectField
                label="Коробка передач"
                value={field.value}
                onChange={field.onChange}
                options={autoTransmissionOptions}
                warning={warningFieldKeys.has('params.transmission')}
                includeEmptyOption
                width="456px"
                labelSx={characteristicFieldLabelSx}
              />
            )}
          />
          <Controller
            control={control}
            name="params.mileage"
            render={({ field }) => (
              <AdEditTextField
                label="Пробег"
                value={field.value}
                onChange={field.onChange}
                type="number"
                warning={warningFieldKeys.has('params.mileage')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.mileage || 'Пробег'}
                onClear={() => setValue('params.mileage', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.enginePower"
            render={({ field }) => (
              <AdEditTextField
                label="Мощность"
                value={field.value}
                onChange={field.onChange}
                type="number"
                warning={warningFieldKeys.has('params.enginePower')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.enginePower || 'Мощность'}
                onClear={() => setValue('params.enginePower', '', { shouldDirty: true })}
              />
            )}
          />
        </>
      ) : null}

      {selectedCategory === 'real_estate' ? (
        <>
          <Controller
            control={control}
            name="params.type"
            render={({ field }) => (
              <AdEditSelectField
                label="Тип недвижимости"
                value={field.value}
                onChange={field.onChange}
                options={realEstateTypeOptions}
                warning={warningFieldKeys.has('params.type')}
                includeEmptyOption
                width="456px"
                labelSx={characteristicFieldLabelSx}
              />
            )}
          />
          <Controller
            control={control}
            name="params.address"
            render={({ field }) => (
              <AdEditTextField
                label="Адрес"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.address')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.address || 'Адрес'}
                onClear={() => setValue('params.address', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.area"
            render={({ field }) => (
              <AdEditTextField
                label="Площадь"
                value={field.value}
                onChange={field.onChange}
                type="number"
                warning={warningFieldKeys.has('params.area')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.area || 'Площадь'}
                onClear={() => setValue('params.area', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.floor"
            render={({ field }) => (
              <AdEditTextField
                label="Этаж"
                value={field.value}
                onChange={field.onChange}
                type="number"
                warning={warningFieldKeys.has('params.floor')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.floor || 'Этаж'}
                onClear={() => setValue('params.floor', '', { shouldDirty: true })}
              />
            )}
          />
        </>
      ) : null}

      {selectedCategory === 'electronics' ? (
        <>
          <Controller
            control={control}
            name="params.type"
            render={({ field }) => (
              <AdEditSelectField
                label="Тип"
                value={field.value}
                onChange={field.onChange}
                options={electronicsTypeOptions}
                warning={warningFieldKeys.has('params.type')}
                includeEmptyOption
                width="456px"
                labelSx={characteristicFieldLabelSx}
              />
            )}
          />
          <Controller
            control={control}
            name="params.brand"
            render={({ field }) => (
              <AdEditTextField
                label="Бренд"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.brand')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.brand || 'Бренд'}
                onClear={() => setValue('params.brand', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.model"
            render={({ field }) => (
              <AdEditTextField
                label="Модель"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.model')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.model || 'Модель'}
                onClear={() => setValue('params.model', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.color"
            render={({ field }) => (
              <AdEditTextField
                label="Цвет"
                value={field.value}
                onChange={field.onChange}
                warning={warningFieldKeys.has('params.color')}
                width="456px"
                labelSx={characteristicFieldLabelSx}
                placeholder={savedValues.params.color || 'Цвет'}
                onClear={() => setValue('params.color', '', { shouldDirty: true })}
              />
            )}
          />
          <Controller
            control={control}
            name="params.condition"
            render={({ field }) => (
              <AdEditSelectField
                label="Состояние"
                value={field.value}
                onChange={field.onChange}
                options={electronicsConditionOptions}
                warning={warningFieldKeys.has('params.condition')}
                includeEmptyOption
                emptyOptionLabel="Не выбрано"
                width="456px"
                labelSx={characteristicFieldLabelSx}
              />
            )}
          />
        </>
      ) : null}
    </Box>
  )
}

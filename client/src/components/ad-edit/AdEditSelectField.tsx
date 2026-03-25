import { KeyboardArrowDownRounded } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { useState } from 'react'

type AdEditSelectFieldOption = {
  value: string
  label: string
}

type AdEditSelectFieldProps = {
  label: string
  value: string
  options: readonly AdEditSelectFieldOption[]
  onChange: (value: string) => void
  required?: boolean
  warning?: boolean
  width?: string | number
  includeEmptyOption?: boolean
  emptyOptionLabel?: string
  labelSx?: SxProps<Theme>
  selectSx?: SxProps<Theme>
}

export function AdEditSelectField({
  label,
  value,
  options,
  onChange,
  required = false,
  warning = false,
  width = '340px',
  includeEmptyOption = false,
  emptyOptionLabel = 'Не выбрано',
  labelSx,
  selectSx,
}: AdEditSelectFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const borderColor = isFocused ? '#1677FF' : warning ? '#FFA940' : '#D9D9D9'

  return (
    <Box sx={{ width, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '62px' }}>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '140%',
          color: 'rgba(0, 0, 0, 0.85)',
          ...labelSx,
        }}
      >
        {required ? (
          <Box component="span" sx={{ color: '#FF4D4F', mr: '4px' }}>
            *
          </Box>
        ) : null}
        {label}
      </Typography>

      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '32px',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          backgroundColor: '#FFFFFF',
          transition: 'border-color 0.2s ease',
          '&:hover': {
            borderColor: warning ? '#FFA940' : '#1677FF',
          },
          ...selectSx,
        }}
      >
        <Box
          component="select"
          value={value}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          sx={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            appearance: 'none',
            backgroundColor: 'transparent',
            paddingTop: '4px',
            paddingRight: '32px',
            paddingBottom: '4px',
            paddingLeft: '12px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            lineHeight: '22px',
            color: value ? '#1F1F24' : '#BFBFBF',
            cursor: 'pointer',
          }}
        >
          {includeEmptyOption ? <option value="">{emptyOptionLabel}</option> : null}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '8px',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            color: '#BFBFBF',
          }}
        >
          <KeyboardArrowDownRounded sx={{ fontSize: 18 }} />
        </Box>
      </Box>
    </Box>
  )
}

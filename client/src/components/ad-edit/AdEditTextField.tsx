import { Box, Typography } from '@mui/material'
import type { SxProps, Theme } from '@mui/material/styles'
import { useState } from 'react'
import type { ReactNode } from 'react'

type AdEditTextFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  errorText?: string
  warning?: boolean
  required?: boolean
  placeholder?: string
  type?: string
  multiline?: boolean
  rows?: number
  width?: string | number
  clearable?: boolean
  onClear?: () => void
  helperText?: ReactNode
  clearIconSrc?: string
  labelSx?: SxProps<Theme>
  textFieldSx?: SxProps<Theme>
  inputSx?: SxProps<Theme>
}

function getBorderColor(errorText?: string, warning?: boolean, isFocused?: boolean) {
  if (errorText) {
    return '#FF4D4F'
  }

  if (isFocused) {
    return '#1677FF'
  }

  if (warning) {
    return '#FFA940'
  }

  return '#D9D9D9'
}

export function AdEditTextField({
  label,
  value,
  onChange,
  onBlur,
  errorText,
  warning = false,
  required = false,
  placeholder,
  type = 'text',
  multiline = false,
  rows,
  width = '340px',
  clearable = true,
  onClear,
  helperText,
  clearIconSrc = '/icons/cancel.svg',
  labelSx,
  textFieldSx,
  inputSx,
}: AdEditTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false)
  const actualInputType = type === 'number' ? 'text' : type
  const minHeight = multiline ? '60px' : '32px'
  const helperMessage = errorText || helperText

  return (
    <Box sx={{ width, display: 'flex', flexDirection: 'column', gap: '8px', minHeight: '62px' }}>
      {label ? (
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
      ) : null}

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: '100%',
            minHeight,
            display: 'flex',
            alignItems: multiline ? 'stretch' : 'center',
            border: `1px solid ${getBorderColor(errorText, warning, isFocused)}`,
            borderRadius: '8px',
            backgroundColor: '#FFFFFF',
            transition: 'border-color 0.2s ease',
            overflow: 'hidden',
            '&:hover': {
              borderColor: errorText ? '#FF4D4F' : warning ? '#FFA940' : '#1677FF',
            },
            ...textFieldSx,
          }}
        >
          {multiline ? (
            <Box
              component="textarea"
              value={value}
              onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                onChange(event.target.value)
              }
              onBlur={() => {
                setIsFocused(false)
                onBlur?.()
              }}
              onFocus={() => setIsFocused(true)}
              placeholder={placeholder}
              rows={rows}
              sx={{
                width: '100%',
                minHeight,
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                overflow: 'auto',
                backgroundColor: 'transparent',
                boxSizing: 'border-box',
                padding: '8px 16px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                lineHeight: '22px',
                color: '#1F1F24',
                '&::placeholder': {
                  color: '#BFBFBF',
                  opacity: 1,
                },
                ...inputSx,
              }}
            />
          ) : (
            <>
              <Box
                component="input"
                type={actualInputType}
                inputMode={type === 'number' ? 'numeric' : undefined}
                value={value}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onChange(event.target.value)
                }
                onBlur={() => {
                  setIsFocused(false)
                  onBlur?.()
                }}
                onFocus={() => setIsFocused(true)}
                placeholder={placeholder}
                sx={{
                  width: '100%',
                  height: '30px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  boxSizing: 'border-box',
                  px: '12px',
                  py: '4px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  lineHeight: '22px',
                  color: '#1F1F24',
                  ...inputSx,
                }}
              />

              {clearable ? (
                <Box
                  component="button"
                  type="button"
                  onClick={onClear}
                  tabIndex={-1}
                  sx={{
                    width: '22px',
                    minWidth: '22px',
                    height: '22px',
                    mr: '6px',
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 0,
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component="img"
                    src={clearIconSrc}
                    alt=""
                    sx={{ width: '14px', height: '14px', display: 'block' }}
                  />
                </Box>
              ) : null}
            </>
          )}
        </Box>

        {helperMessage ? (
          <Typography
            sx={{
              ml: 0,
              mt: '6px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '12px',
              lineHeight: '16px',
              color: errorText ? '#FF4D4F' : '#B8B5BC',
            }}
          >
            {helperMessage}
          </Typography>
        ) : null}
      </Box>
    </Box>
  )
}

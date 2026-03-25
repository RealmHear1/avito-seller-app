import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useMemo } from 'react'
import type { ReactNode } from 'react'

type MuiThemeProviderProps = {
  children: ReactNode
}

export function MuiThemeProvider({ children }: MuiThemeProviderProps) {
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: 'light',
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                transition: 'background-color 0.2s ease, color 0.2s ease',
              },
            },
          },
        },
      }),
    [],
  )

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}

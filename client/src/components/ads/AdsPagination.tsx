import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import { Box, ButtonBase } from '@mui/material'

type AdsPaginationProps = {
  currentPage: number
  pageNumbers: number[]
  totalPages: number
  onPageChange: (page: number) => void
}

export function AdsPagination({
  currentPage,
  pageNumbers,
  totalPages,
  onPageChange,
}: AdsPaginationProps) {
  return (
    <Box sx={{ mt: '12px', display: 'flex', justifyContent: 'flex-start' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ButtonBase
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #D9D9D9',
            backgroundColor: '#FFFFFF',
            color: currentPage === 1 ? '#D9D9D9' : '#3E3D45',
          }}
        >
          <ChevronLeft sx={{ width: 16, height: 16 }} />
        </ButtonBase>

        {pageNumbers.map((pageNumber) => {
          const isActive = currentPage === pageNumber

          return (
            <ButtonBase
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              sx={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                border: `1px solid ${isActive ? '#2F80FF' : '#D9D9D9'}`,
                backgroundColor: '#FFFFFF',
                color: isActive ? '#2F80FF' : '#3E3D45',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
              }}
            >
              {pageNumber}
            </ButtonBase>
          )
        })}

        <ButtonBase
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          sx={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            border: '1px solid #D9D9D9',
            backgroundColor: '#FFFFFF',
            color: currentPage === totalPages ? '#D9D9D9' : '#3E3D45',
          }}
        >
          <ChevronRight sx={{ width: 16, height: 16 }} />
        </ButtonBase>
      </Box>
    </Box>
  )
}

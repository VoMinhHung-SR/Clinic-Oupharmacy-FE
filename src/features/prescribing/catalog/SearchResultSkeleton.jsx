import { Box, Skeleton } from "@mui/material"

/** Compact row skeleton for search dropdown / browse list only. */
export default function SearchResultSkeleton({ rows = 4 }) {
  return (
    <Box sx={{ py: 0.5, px: 0.5 }} aria-busy="true" aria-label="Loading results">
      {Array.from({ length: rows }, (_, i) => (
        <Box key={i} sx={{ py: 1, px: 0.5 }}>
          <Skeleton variant="text" width="78%" height={20} />
          <Skeleton variant="text" width="42%" height={16} sx={{ mt: 0.5 }} />
        </Box>
      ))}
    </Box>
  )
}

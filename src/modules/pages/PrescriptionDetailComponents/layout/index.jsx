import { Box, Paper, useTheme } from "@mui/material"

const PrescriptionDetailLayout = ({ headerContent, leftContent, rightContent }) => {
  const theme = useTheme()

  return (
    <Box sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0, width: "100%" }}>

      {headerContent && <Box className="ou-flex-shrink-0 ou-w-full ou-mb-2">{headerContent}</Box>}
      
      <Box
        sx={{ display: "flex", flex: 1, minHeight: 0, width: "100%", gap: theme.spacing(2),
          flexDirection: { xs: "column", md: "row" } }}
      >
        <Box
          component={Paper}
          elevation={5}
          sx={{ 
            flex: { xs: "1 1 0", md: "8 8 0" },
            minHeight: { xs: "50vh", md: 0 },
            minWidth: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            pr: { xs: 0, md: 1 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowX: "hidden",
              overflowY: { xs: "auto", md: "hidden" },
              display: "flex",
              flexDirection: "column",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {leftContent}
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column",
          flex: { xs: "0 0 auto", md: "4 4 0" }, minWidth: 0 }}
        >
          {rightContent}
        </Box>
      </Box>
    </Box>
  )
}

export default PrescriptionDetailLayout
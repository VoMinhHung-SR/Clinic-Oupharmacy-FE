import { Grid } from "@mui/material"
import { Box } from "@mui/system"

const PrescriptionDetailLayout = ({ headerContent, leftContent, rightContent }) => (
  <Box sx={{ width: "100%" }}>
    {headerContent && (
      <Box sx={{ width: "100%", mb: 2 }}>{headerContent}</Box>
    )}
    <Grid container spacing={{ xs: 2, md: 0 }} sx={{ width: "100%" }}>
      <Grid item xs={12} md={9} sx={{ pr: { xs: 0, md: 3 }, minWidth: 0, width: "100%" }}>
        <Box sx={{ width: "100%", minWidth: 0 }}>{leftContent}</Box>
      </Grid>
      <Grid item xs={12} md={3} sx={{ minWidth: 0, width: "100%" }}>
        <Box sx={{ width: "100%", minWidth: 0 }}>{rightContent}</Box>
      </Grid>
    </Grid>
  </Box>
)

export default PrescriptionDetailLayout

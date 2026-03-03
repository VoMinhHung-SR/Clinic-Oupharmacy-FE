import { Grid } from "@mui/material"
import { Box } from "@mui/system"

const PrescriptionDetailLayout = ({ leftContent, rightContent }) => (
  <Grid container>
    <Grid item xs={9} className="ou-pr-6">
      <Box>{leftContent}</Box>
    </Grid>
    <Grid item xs={3} className="ou-w-[100%]">
      {rightContent}
    </Grid>
  </Grid>
)

export default PrescriptionDetailLayout
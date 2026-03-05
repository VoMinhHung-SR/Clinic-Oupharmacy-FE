import { FormControl, Grid } from "@mui/material"

const PrescriptionDraftLineItem = ({ medicineName, packaging, uses, quantity, index = 0 }) => (
  <Grid key={`mdc-${index}`} item xs={12} className="!ou-mt-2">
    <Grid container justifyContent="flex" style={{ margin: "0 auto" }} alignItems="center">
      <Grid item xs={7}>
        <FormControl fullWidth>
          <span className="ou-text-sm">{index + 1}. {medicineName}</span>
          {packaging && (
            <span className="ou-text-xs ou-text-gray-600 ou-block">({packaging})</span>
          )}
        </FormControl>
      </Grid>
      <Grid item xs={3} className="ou-text-center">
        <span className="ou-text-sm">{uses}</span>
      </Grid>
      <Grid item xs={2} className="ou-text-center">
        <span className="ou-text-sm ou-text-center">{quantity}</span>
      </Grid>
    </Grid>
  </Grid>
)

export default PrescriptionDraftLineItem

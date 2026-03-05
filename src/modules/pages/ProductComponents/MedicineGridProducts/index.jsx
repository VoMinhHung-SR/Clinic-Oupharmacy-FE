import { Grid } from "@mui/material"
import { formatNumberCurrency } from "../../../../lib/utils/helper"
import { getMedicineUnitImageUrl } from "../../../../lib/utils/medicineUnitImage"

const MedicineGridProducts = ({ medicines, actionButton }) => (
  <Grid container>
    {medicines?.map((product) => (
      <Grid item xs={4} key={product.id} className="ou-flex">
        <div className="ou-w-[100%] ou-px-2 hover:ou-border-blue-600 hover:ou-border-[2px] ou-rounded-lg ou-m-2 ou-flex ou-flex-col">
          <img
            className="ou-object-contain"
            width={180}
            height={180}
            src={getMedicineUnitImageUrl(product)}
            alt={product.medicine?.name ?? ""}
          />
          <p className="ou-px-2 ou-my-2 ou-list-item-2-text-container">{product.medicine?.name}</p>
          <div className="ou-mt-auto ou-my-2">
            <p className="ou-px-2 ou-mt-2 ou-mb-4 ou-font-bold">
              {formatNumberCurrency(product.price)}vnd / {product.package_size ?? product.packaging ?? "—"}
            </p>
            {actionButton}
          </div>
        </div>
      </Grid>
    ))}
  </Grid>
)

export default MedicineGridProducts
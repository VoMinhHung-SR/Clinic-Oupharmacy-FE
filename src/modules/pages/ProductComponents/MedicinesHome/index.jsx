import { useSelector } from "react-redux"
import { Box, Paper, Stack, Pagination } from "@mui/material"
import { useTranslation } from "react-i18next"
import useMedicine from "../../../../lib/hooks/useMedicine"
import UserContext from "../../../../lib/context/UserContext"
import SchemaModels from "../../../../lib/schema"
import { useLocation } from "react-router"
import { useContext, useMemo } from "react"
import SkeletonListLineItem from "../../../common/components/skeletons/listLineItem"
import { ROLE_DOCTOR } from "../../../../lib/constants"
import MedicineListPrescribing from "../MedicineListPrescribing"
import MedicineGridProducts from "../MedicineGridProducts"

const MedicinesHome = ({ actionButton, onAddMedicineLineItem, medicinesSubmit }) => {
  const { tReady } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine", "product"])
  const { allConfig } = useSelector((state) => state.config)
  const { medicines, page, handleChangePage, pagination, medicineLoading, paramsFilter, handleOnSubmitFilter } =
    useMedicine()
  const { user } = useContext(UserContext)
  const { medicineLineItemSchema } = SchemaModels()
  const { pathname } = useLocation()

  const handleAddToPrescription = (medicine, data) => {
    onAddMedicineLineItem(medicine, data)
  }

  const availableStockMap = useMemo(() => {
    const map = new Map()
    medicines.forEach((medicine) => {
      const existing = medicinesSubmit?.find((item) => item.id === medicine.id)
      const stock = existing ? Math.max(0, medicine.in_stock - existing.quantity) : medicine.in_stock
      map.set(medicine.id, stock)
    })
    return map
  }, [medicines, medicinesSubmit])

  if (!tReady && medicineLoading) {
    return (
      <Box sx={{ height: "300px" }}>
        <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[30vh]">
          <SkeletonListLineItem count={5} className="ou-w-full" />
        </Box>
      </Box>
    )
  }

  const isPrescribingView = pathname !== "/products" && user?.role === ROLE_DOCTOR
  const isProductsView = pathname === "/products"

  if (!isPrescribingView && !isProductsView) {
    return null
  }

  return (
    <>
      <Box component={Paper} elevation={5} className="ou-px-4 ou-py-6">
        {isPrescribingView && (
          <MedicineListPrescribing
            medicines={medicines}
            medicineLoading={medicineLoading}
            paramsFilter={paramsFilter}
            handleOnSubmitFilter={handleOnSubmitFilter}
            categories={allConfig.categories}
            schema={medicineLineItemSchema}
            onAddToPrescription={handleAddToPrescription}
            availableStockMap={availableStockMap}
          />
        )}
        {isProductsView && <MedicineGridProducts medicines={medicines} actionButton={actionButton} />}

        {!medicineLoading && pagination.sizeNumber >= 2 && (
          <Box sx={{ pt: 5, pb: 2 }}>
            <Stack>
              <Pagination
                count={pagination.sizeNumber}
                variant="outlined"
                sx={{ margin: "0 auto" }}
                page={page}
                onChange={handleChangePage}
              />
            </Stack>
          </Box>
        )}
      </Box>
    </>
  )
}

export default MedicinesHome
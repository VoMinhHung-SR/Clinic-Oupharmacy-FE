import { useSelector } from "react-redux"
import { Box, Paper, Stack, Pagination } from "@mui/material"
import { useTranslation } from "react-i18next"
import useMedicine from "../../../../lib/hooks/useMedicine"
import UserContext from "../../../../lib/context/UserContext"
import SchemaModels from "../../../../lib/schema"
import { useLocation } from "react-router"
import { useContext, useMemo } from "react"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import { ROLE_DOCTOR } from "../../../../lib/constants"
import MedicineListPrescribing from "../MedicineListPrescribing"
import MedicineGridProducts from "../MedicineGridProducts"

const MedicinesHome = ({ actionButton, onAddMedicineLineItem, medicinesSubmit }) => {
  const { tReady } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine", "product"])
  const { allConfig } = useSelector((state) => state.config)
  const { medicineUnits, page, handleChangePage, pagination,
    medicineLoading, paramsFilter, handleOnSubmitFilter } = useMedicine()
  const { user } = useContext(UserContext)
  const { medicineLineItemSchema } = SchemaModels()
  const { pathname } = useLocation()

  const handleAddToPrescription = (medicineUnit, data) => {
    onAddMedicineLineItem(medicineUnit, data)
  }

  const availableStockMap = useMemo(() => {
    const map = new Map()
    medicineUnits.forEach((unit) => {
      const reservedBase =
        medicinesSubmit
          ?.filter((item) => item.id === unit.id)
          .reduce(
            (sum, item) =>
              sum + (Number(item.quantity) || 0) * (Number(item.quantityInBase) || 1),
            0
          ) ?? 0
      map.set(unit.id, Math.max(0, Number(unit.in_stock ?? 0) - reservedBase))
    })
    return map
  }, [medicineUnits, medicinesSubmit])

  if (!tReady && medicineLoading) {
    return (
      <Box
        sx={{flex: { xs: "0 0 auto", md: "1 1 0" }, 
        minHeight: { xs: "auto", md: 0 }, 
        display: "flex", flexDirection: "column",
        overflow: "hidden", width: "100%"
      }}
      >
        <Box
          component={Paper}
          elevation={5}
          sx={{
            width: "100%",
            flex: { xs: "0 0 auto", md: "1 1 0" },
            minHeight: { xs: "auto", md: 0 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            px: 3,
            py: 3,
          }}
        >
          <SkeletonPrescribingPage.ListSection />
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
    <Box
      sx={{
        flex: { xs: "0 0 auto", md: "1 1 0" },
        minHeight: { xs: "auto", md: 0 },
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box
        component={Paper}
        elevation={5}
        sx={{
          width: "100%",
          maxWidth: "100%",
          flex: { xs: "0 0 auto", md: "1 1 0" },
          minHeight: { xs: "auto", md: 0 },
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          px: 3,
          py: 3,
        }}
      >
        {isPrescribingView && (
          <MedicineListPrescribing
            medicineUnits={medicineUnits}
            medicineLoading={medicineLoading}
            paramsFilter={paramsFilter}
            handleOnSubmitFilter={handleOnSubmitFilter}
            categories={allConfig.categories}
            schema={medicineLineItemSchema}
            onAddToPrescription={handleAddToPrescription}
            availableStockMap={availableStockMap}
          />
        )}
        {isProductsView && <MedicineGridProducts medicines={medicineUnits} actionButton={actionButton} />}
        {!medicineLoading && pagination.sizeNumber >= 2 && (
          <Box sx={{ flexShrink: 0, pt: 1.5, pb: 0.5 }}>
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
    </Box>
  )
}

export default MedicinesHome
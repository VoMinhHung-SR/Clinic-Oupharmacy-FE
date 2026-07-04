import { Box, Paper, Stack, Pagination } from "@mui/material"
import { useTranslation } from "react-i18next"
import useMedicine from "../../../../lib/hooks/useMedicine"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import MedicineGridProducts from "../MedicineGridProducts"

/** Store product browse for `/products` only — prescribing uses `PrescribingWorkspace`. */
const MedicinesHome = ({ actionButton }) => {
  const { tReady } = useTranslation(["product", "medicine"])
  const { medicineUnits, page, handleChangePage, pagination, medicineLoading } = useMedicine({
    enabled: true,
  })

  if (!tReady && medicineLoading) {
    return (
      <Box sx={{ width: "100%", py: 3 }}>
        <Paper elevation={5} sx={{ px: 3, py: 3 }}>
          <SkeletonPrescribingPage.ListSection />
        </Paper>
      </Box>
    )
  }

  const showPagination = !medicineLoading && pagination.sizeNumber >= 2

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
        <MedicineGridProducts medicines={medicineUnits} actionButton={actionButton} />
        {showPagination ? (
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
        ) : null}
      </Box>
    </Box>
  )
}

export default MedicinesHome

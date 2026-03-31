import { useMemo } from "react"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import MedicineFilter from "../../../common/components/FIlterBar/MedicineFilter"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import MedicineLineItem from "../MedicineLineItem"

/** Cột grid: Liều dùng/Số lượng thu hẹp, cột nút vừa với button */
const LIST_GRID = {
  display: "grid",
  gridTemplateColumns: "minmax(140px, 2fr) minmax(80px, 1fr) 96px 72px 44px",
  gap: 2,
  alignItems: "center",
  minWidth: 0,
}

const groupUnitsByMedicine = (medicineUnits) => {
  if (!Array.isArray(medicineUnits)) return []
  const byMedicine = new Map()
  medicineUnits.forEach((unit) => {
    const medicineId = unit?.medicine?.id ?? unit?.medicine
    if (!byMedicine.has(medicineId)) byMedicine.set(medicineId, [])
    byMedicine.get(medicineId).push(unit)
  })
  return Array.from(byMedicine.entries()).map(([medicineId, units]) => ({
    medicineId,
    medicine: units[0]?.medicine,
    units,
  }))
}

const MedicineListPrescribing = ({
  medicineUnits,
  medicineLoading,
  paramsFilter,
  handleOnSubmitFilter,
  categories,
  schema,
  onAddToPrescription,
  availableStockMap,
}) => {
  const { t } = useTranslation(["prescription-detail", "medicine"])
  const groupedByMedicine = useMemo(() => groupUnitsByMedicine(medicineUnits), [medicineUnits])

  return (
    <Box
      sx={{
        flex: "1 1 auto",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <MedicineFilter
          kw={paramsFilter.kw}
          cateFilter={paramsFilter.cate}
          price={paramsFilter.price}
          onSubmit={handleOnSubmitFilter}
          categories={categories}
          prescribingSearch
        />

        <Box
          sx={{
            ...LIST_GRID,
            py: 1,
            pl: 1.5,
            pr: 2.5, // bù thanh cuộn (~8px) để header khớp với content
            borderBottom: 1,
            borderColor: "divider",
            typography: "body2",
            fontWeight: 600,
          }}
        >
          <Box sx={{ textAlign: "left" }}>{t("prescription-detail:medicineName")}</Box>
          <Box sx={{ textAlign: "center" }}>{t("medicine:packaging")}</Box>
          <Box sx={{ textAlign: "center" }}>{t("prescription-detail:uses")}</Box>
          <Box sx={{ textAlign: "center" }}>{t("prescription-detail:quantity")}</Box>
          <Box sx={{ textAlign: "center" }} />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
          mt: 0.5,
          px: 1.5,
          flexShrink: 0,
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-track": { bgcolor: "action.hover", borderRadius: 1 },
          "&::-webkit-scrollbar-thumb": { bgcolor: "action.selected", borderRadius: 1 },
        }}
      >
        {medicineLoading && <SkeletonPrescribingPage.ListSectionRows />}

        {!medicineLoading && groupedByMedicine.length > 0 &&
          groupedByMedicine.map(({ medicineId, medicine, units }) => (
            <MedicineLineItem
              key={medicineId}
              units={units}
              medicine={medicine}
              schema={schema}
              onAddToPrescription={onAddToPrescription}
              availableStockMap={availableStockMap}
              gridTemplate={LIST_GRID}
            />
          ))}

        {!medicineLoading && medicineUnits.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography color="error">{t("medicine:errMedicinesNull")}</Typography>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default MedicineListPrescribing
import { useMemo } from "react"
import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import MedicineFilter from "../../../common/components/FIlterBar/MedicineFilter"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import MedicineLineItem from "../MedicineLineItem"

/** Cột grid thống nhất cho header và từng dòng thuốc (Tên | Đóng gói | Liều dùng | Số lượng | Nút) */
const LIST_GRID = {
  display: "grid",
  gridTemplateColumns: "minmax(180px, 2fr) minmax(100px, 1fr) 120px 80px 56px",
  gap: 2,
  alignItems: "center",
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
    <div>
      <MedicineFilter
        kw={paramsFilter.kw}
        cateFilter={paramsFilter.cate}
        price={paramsFilter.price}
        onSubmit={handleOnSubmitFilter}
        categories={categories}
        prescribingSearch
      />

      <Box sx={{ ...LIST_GRID, py: 1, px: 0.5, borderBottom: 1, borderColor: "divider", typography: "body2", fontWeight: 600 }}>
        <Box sx={{ textAlign: "left" }}>{t("prescription-detail:medicineName")}</Box>
        <Box sx={{ textAlign: "center" }}>{t("medicine:packaging")}</Box>
        <Box sx={{ textAlign: "center" }}>{t("prescription-detail:uses")}</Box>
        <Box sx={{ textAlign: "center" }}>{t("prescription-detail:quantity")}</Box>
        <Box />
      </Box>

      {medicineLoading && <SkeletonPrescribingPage.ListSection />}

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
    </div>
  )
}

export default MedicineListPrescribing
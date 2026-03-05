import { Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import MedicineFilter from "../../../common/components/FIlterBar/MedicineFilter"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import MedicineLineItem from "../MedicineLineItem"

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

  return (
    <div>
      <Box className="ou-w-full ou-flex ou-items-center ou-justify-end ou-mb-3">
        <MedicineFilter
          kw={paramsFilter.kw}
          cateFilter={paramsFilter.cate}
          onSubmit={handleOnSubmitFilter}
          categories={categories}
        />
      </Box>

      <div className="ou-flex">
        <p className="ou-w-[50%] ou-text-center">{t("prescription-detail:medicineName")}</p>
        <p className="ou-w-[20%] ou-text-center">{t("prescription-detail:uses")}</p>
        <p className="ou-w-[10%] ou-text-center">{t("prescription-detail:quantity")}</p>
      </div>

      {medicineLoading && <SkeletonPrescribingPage.ListSection />}

      {!medicineLoading && medicineUnits.length > 0 &&
        medicineUnits.map((medicineUnit) => (
          <MedicineLineItem
            key={medicineUnit.id}
            medicineUnit={medicineUnit}
            schema={schema}
            onAddToPrescription={onAddToPrescription}
            availableStock={availableStockMap?.get(medicineUnit.id)}
          />
        ))}

      {!medicineLoading && medicineUnits.length === 0 && (
        <Typography>
          <Box className="ou-text-center ou-p-12 ou-text-red-700">
            {t("medicine:errMedicinesNull")}
          </Box>
        </Typography>
      )}
    </div>
  )
}

export default MedicineListPrescribing
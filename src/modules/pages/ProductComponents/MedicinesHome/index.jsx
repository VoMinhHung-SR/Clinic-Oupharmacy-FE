import { Box, Paper, Stack, Pagination } from "@mui/material"
import { useTranslation } from "react-i18next"
import useMedicine from "../../../../lib/hooks/useMedicine"
import { usePrescribingCatalog, CatalogPanel } from "../../../../features/prescribing"
import useStoreCategoryTree from "../../../../features/prescribing/catalog/hooks/useStoreCategoryTree"
import UserContext from "../../../../lib/context/UserContext"
import SchemaModels from "../../../../lib/schema"
import { useLocation } from "react-router"
import { useContext, useEffect, useMemo, useRef } from "react"
import SkeletonPrescribingPage from "../../../common/components/skeletons/pages/prescribing-prescribing-page"
import { ROLE_DOCTOR } from "../../../../lib/constants"
import MedicineGridProducts from "../MedicineGridProducts"

const MedicinesHome = ({ actionButton, onAddMedicineLineItem, medicinesSubmit }) => {
  const { tReady } = useTranslation(["prescription-detail", "yup-validate", "modal", "medicine", "product"])
  const { user } = useContext(UserContext)
  const { medicineLineItemSchema } = SchemaModels()
  const { pathname } = useLocation()

  const isPrescribingView = pathname !== "/products" && user?.role === ROLE_DOCTOR
  const isProductsView = pathname === "/products"

  const productCatalog = useMedicine({ enabled: isProductsView })
  const prescribingCatalog = usePrescribingCatalog({ enabled: isPrescribingView })
  const { handleRootCategoryChange, paramsFilter } = prescribingCatalog
  const didAutoRoot = useRef(false)
  const { tree: categoryTree, loading: categoryTreeLoading } = useStoreCategoryTree({
    enabled: isPrescribingView,
  })

  useEffect(() => {
    if (didAutoRoot.current || !isPrescribingView || !categoryTree.length || paramsFilter.rootCate) return
    const thuoc = categoryTree.find((c) => c.slug === "thuoc") ?? categoryTree.find((c) => c.name === "Thuốc")
    if (thuoc) {
      didAutoRoot.current = true
      handleRootCategoryChange(thuoc.id, { silent: true })
    }
  }, [isPrescribingView, categoryTree, paramsFilter.rootCate, handleRootCategoryChange])

  const {
    medicineUnits,
    page,
    handleChangePage,
    pagination,
    medicineLoading,
  } = isPrescribingView ? prescribingCatalog : productCatalog

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

  if (!isPrescribingView && !isProductsView) {
    return null
  }

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

  const showPagination =
    !medicineLoading &&
    pagination.sizeNumber >= 2 &&
    (!isPrescribingView || prescribingCatalog.hasSearchIntent)

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
          <CatalogPanel
            variants={prescribingCatalog.medicineUnits}
            loading={prescribingCatalog.medicineLoading}
            isIdle={prescribingCatalog.isIdle}
            paramsFilter={prescribingCatalog.paramsFilter}
            categoryTree={categoryTree}
            categoryTreeLoading={categoryTreeLoading}
            onKeywordChange={prescribingCatalog.handleKeywordChange}
            onRootCategoryChange={prescribingCatalog.handleRootCategoryChange}
            onCategoryChange={prescribingCatalog.handleCategoryChange}
            onClearCategories={prescribingCatalog.handleClearCategories}
            onSubmitFilter={prescribingCatalog.handleOnSubmitFilter}
            schema={medicineLineItemSchema}
            onAddToPrescription={handleAddToPrescription}
            availableStockMap={availableStockMap}
            hasBrowseIntent={prescribingCatalog.hasBrowseIntent}
          />
        )}
        {isProductsView && <MedicineGridProducts medicines={medicineUnits} actionButton={actionButton} />}
        {showPagination && (
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

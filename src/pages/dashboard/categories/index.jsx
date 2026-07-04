import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import useCategory from "../../../modules/pages/CategoriesComponents/hooks/useCategory"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import SkeletonCategoryList from "../../../modules/common/components/skeletons/pages/categories"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_TABLE_CONTAINER_SX,
  DASHBOARD_TABLE_SX,
} from "../../../modules/common/layout/dashboard/styleTokens"
import DashboardEmptyState from "../../../modules/common/layout/dashboard/components/DashboardEmptyState"
import DashboardPageShell from "../../../modules/common/layout/dashboard/shell/DashboardPageShell"
import DashboardTableHeadCell from "../../../modules/common/layout/dashboard/components/DashboardTableHeadCell"

const levelLabel = (level, t) => {
  if (level === 0) return t("category:level0", { defaultValue: "Nhóm" })
  if (level === 1) return t("category:level1", { defaultValue: "Danh mục" })
  return t("category:level2", { defaultValue: "Loại" })
}

const CategoryList = () => {
  const { categories, isLoading } = useCategory()
  const { t, ready } = useTranslation(["category", "common"])

  if (!ready && isLoading)
    return (
      <>
        <Helmet>
          <title>Categories</title>
        </Helmet>
        <Box sx={DASHBOARD_PAGE_FRAME_SX}>
          <SkeletonCategoryList />
        </Box>
      </>
    )

  return (
    <>
      <Helmet>
        <title>{t("common:categories")}</title>
      </Helmet>
      <DashboardPageShell
        toolbar={
          <Alert severity="info" sx={{ py: 0.5 }}>
            {t("category:storeReadOnlyHint", {
              defaultValue:
                "Danh mục đọc từ cửa hàng (store). Chỉnh sửa qua quản trị store — không qua mainApp.",
            })}
          </Alert>
        }
      >
        <TableContainer className="ou-scrollbar" sx={DASHBOARD_TABLE_CONTAINER_SX}>
          <Table aria-label="store categories" size="small" stickyHeader sx={DASHBOARD_TABLE_SX}>
            <TableHead>
              <TableRow>
                <DashboardTableHeadCell>{t("category:id")}</DashboardTableHeadCell>
                <DashboardTableHeadCell>{t("category:level", { defaultValue: "Cấp" })}</DashboardTableHeadCell>
                <DashboardTableHeadCell>{t("category:name")}</DashboardTableHeadCell>
                <DashboardTableHeadCell>{t("category:path", { defaultValue: "Đường dẫn" })}</DashboardTableHeadCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <SkeletonListLineItem count={5} height="40px" className="ou-w-full" />
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && Array.isArray(categories) && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ border: 0 }}>
                    <DashboardEmptyState message={t("category:errNullCate")} />
                  </TableCell>
                </TableRow>
              )}

              {!isLoading &&
                categories.length > 0 &&
                categories.map((c) => (
                  <TableRow
                    key={`${c.level}-${c.id}`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Typography>{c.id}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2">{levelLabel(c.level, t)}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography className="ou-table-truncate-text-container">{c.name}</Typography>
                    </TableCell>
                    <TableCell align="left">
                      <Typography variant="body2" color="text.secondary">
                        {c.path}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DashboardPageShell>
    </>
  )
}

export default CategoryList

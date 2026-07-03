import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Alert,
} from "@mui/material"
import CategoryIcon from "@mui/icons-material/Category"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import useCategory from "../../../modules/pages/CategoriesComponents/hooks/useCategory"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import SkeletonCategoryList from "../../../modules/common/components/skeletons/pages/categories"
import {
  DASHBOARD_LIST_HEADER_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

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
      <Box>
        <Helmet>
          <title>Categories</title>
        </Helmet>
        <SkeletonCategoryList />
      </Box>
    )

  return (
    <>
      <Helmet>
        <title>{t("common:categories")}</title>
      </Helmet>
      <Box sx={{ width: "100%", mx: "auto" }}>
        <Paper
          elevation={DASHBOARD_SURFACE.elevation}
          sx={{ borderRadius: DASHBOARD_SURFACE.borderRadius, overflow: "hidden" }}
        >
          <Box sx={DASHBOARD_LIST_HEADER_SX}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, minWidth: 0 }}>
              <CategoryIcon color="primary" />
              <Typography variant="h6" component="h1" fontWeight={600}>
                {t("common:categories")}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ px: 2, pb: 2 }}>
            <Alert severity="info">
              {t("category:storeReadOnlyHint", {
                defaultValue:
                  "Danh mục đọc từ cửa hàng (store). Chỉnh sửa qua quản trị store — không qua mainApp.",
              })}
            </Alert>
          </Box>

          <TableContainer sx={{ overflowX: "auto" }}>
            <Table aria-label="store categories" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>{t("category:id")}</TableCell>
                  <TableCell align="left">{t("category:level", { defaultValue: "Cấp" })}</TableCell>
                  <TableCell align="left">{t("category:name")}</TableCell>
                  <TableCell align="left">{t("category:path", { defaultValue: "Đường dẫn" })}</TableCell>
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
                    <TableCell colSpan={4}>
                      <Typography align="center" color="error" sx={{ py: 6 }}>
                        {t("category:errNullCate")}
                      </Typography>
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
        </Paper>
      </Box>
    </>
  )
}

export default CategoryList

import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert } from "@mui/material";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import useCategory from "../../../modules/pages/CategoriesComponents/hooks/useCategory";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
import SkeletonCategoryList from "../../../modules/common/components/skeletons/pages/categories";

const levelLabel = (level, t) => {
  if (level === 0) return t("category:level0", { defaultValue: "Nhóm" })
  if (level === 1) return t("category:level1", { defaultValue: "Danh mục" })
  return t("category:level2", { defaultValue: "Loại" })
}

const CategoryList = () => {
    const { categories, isLoading } = useCategory();
    const { t, ready } = useTranslation(['category','common'])

    if (!ready && isLoading)
        return <Box>
            <Helmet><title>Categories</title></Helmet>
            <SkeletonCategoryList />
        </Box>

    return(
    <>
        <Helmet>
            <title>{t('common:categories')}</title>
        </Helmet>
        <Box sx={{ minHeight: "300px" }}>
            <TableContainer component={Paper} elevation={4}>
                <div className="ou-flex ou-items-center ou-justify-between">
                    <div className="ou-flex ou-justify-between ou-w-full">
                        <h1 className="ou-text-xl ou-px-4 ou-py-8">{t('common:categories')}</h1>
                    </div>
                </div>
                <Box sx={{ px: 2, pb: 2 }}>
                    <Alert severity="info">
                        {t('category:storeReadOnlyHint', {
                            defaultValue: 'Danh mục đọc từ cửa hàng (store). Chỉnh sửa qua quản trị store — không qua mainApp.',
                        })}
                    </Alert>
                </Box>
                    <Table aria-label="store categories">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('category:id')}</TableCell>
                                <TableCell align="left">{t('category:level', { defaultValue: 'Cấp' })}</TableCell>
                                <TableCell align="left">{t('category:name')}</TableCell>
                                <TableCell align="left">{t('category:path', { defaultValue: 'Đường dẫn' })}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {isLoading &&
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Box className="ou-text-center">
                                        <SkeletonListLineItem count={5} height="40px" className="ou-w-full" />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        }
                        {!isLoading && Array.isArray(categories) && categories.length === 0 &&
                            <TableRow>
                                <TableCell colSpan={4}>
                                    <Typography>
                                        <Box className="ou-text-center ou-p-10 ou-text-red-700">
                                            {t('category:errNullCate')}
                                        </Box>
                                    </Typography>
                                </TableCell>
                            </TableRow>}

                        {!isLoading && categories.length > 0 && categories.map((c) => (
                            <TableRow key={`${c.level}-${c.id}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" >
                                    <Typography>{c.id}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography variant="body2">{levelLabel(c.level, t)}</Typography>
                                </TableCell>
                                <TableCell align="left">
                                    <Typography className="ou-table-truncate-text-container">
                                        {c.name}
                                    </Typography>
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
        </Box>
    </>)
}

export default CategoryList

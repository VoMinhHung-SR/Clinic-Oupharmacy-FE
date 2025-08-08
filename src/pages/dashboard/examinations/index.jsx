import {
  Badge,
  Box,
  Button,
  Collapse,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useExaminationConfirm from "../../../modules/pages/ExaminationListComponents/ExaminationConfirm/hooks/useExaminationConfirm";
import { useTranslation } from "react-i18next";
import ExaminationCard from "../../../modules/common/components/card/ExaminationCard";
import ExaminationFilter from "../../../modules/common/components/FIlterBar/ExaminationFilter";
import { Helmet } from "react-helmet";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, memo } from "react";
import FilterListIcon from '@mui/icons-material/FilterList';

const MemoizedExaminationFilter = memo(ExaminationFilter);

const Examinations = () => {
  const {
    user,
    pagination,
    handleChangePage,
    examinationList,
    isLoadingExamination,
    page,
    paramsFilter,
    handleChangeFlag,
    handleOnSubmitFilter,
    disableOtherCards, handleSendEmailConfirm, loadingState
  } = useExaminationConfirm();

  const { t, ready } = useTranslation(["examinations", "common", "modal"]);
  const [showFilter, setShowFilter] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  if (!ready)
    return <Box sx={{ height: "300px" }}>
        <Helmet>
          <title>Examinations</title>
        </Helmet>

        <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[30vh]">
            <SkeletonListLineItem count={5} className="ou-w-full"/>
        </Box>
      </Box>

  return (
    <>
      <Helmet>
          <title>{t('common:examinations')}</title>
      </Helmet>
      <Box className="ou-flex ou-justify-center ou-flex-col"
      component={Paper} elevation={4}
      sx={{ width: '100%', overflowX: 'auto' }}>
          <TableContainer component={Paper} sx={{ 
            maxWidth: '100%',
            overflowX: 'auto',
            '& .MuiTableCell-root': {
              padding: isMobile ? '8px' : '16px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
            }
          }}>
            <div className="ou-flex ou-items-center ou-justify-between" style={{ 
              flexDirection: isMobile ? 'column' : 'row',
              gap: isMobile ? '1rem' : '0',
              padding: isMobile ? '1rem' : '0'
            }}>
              <div className="ou-flex ou-py-5 ou-items-center ou-justify-between">
                <h1 className="ou-text-xl ou-pl-4" style={{ fontSize: isMobile ? '1rem' : '1.25rem' }}>
                  {t('listOfExaminations')}
                </h1>
              <Button
                variant="outlined"
                startIcon={<Badge badgeContent={pagination.count} color="primary"> <FilterListIcon /> </Badge>}
                endIcon={<ExpandMoreIcon sx={{ transform: showFilter ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
                onClick={() => setShowFilter((prev) => !prev)}
                sx={{ borderRadius: 3, fontWeight: 500, marginLeft: '12px', textTransform: 'none' }}
              >
                <span className="ou-pl-3">{t('examinations:filter')}</span>
              </Button>
              </div>
            </div>
              <Collapse in={showFilter}>
                <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                  <MemoizedExaminationFilter
                    onSubmit={handleOnSubmitFilter}
                    mailStatus={paramsFilter.mailStatus}
                    createdDate={paramsFilter.createdDate}
                    kw={paramsFilter.kw}
                    hasDiagnosis={paramsFilter.hasDiagnosis}
                    isMobile={isMobile}
                  />
                </Paper>
              </Collapse>
            
            <Table sx={{ 
              minWidth: isMobile ? 300 : 650,
              '& .MuiTableCell-root': {
                whiteSpace: isMobile ? 'nowrap' : 'normal',
                maxWidth: isMobile ? '150px' : 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>{t("id")}</TableCell>
                  <TableCell align="center">{t("description")}</TableCell>
                  <TableCell align="center">{t("createdDate")}</TableCell>
                  <TableCell align="center">{t("mailStatus")}</TableCell>
                  <TableCell align="center">{t("diagnosisStatus")}</TableCell>    
                  <TableCell align="center">{t("userCreated")}</TableCell>
                  <TableCell align="center">{t("doctorName")}</TableCell>
                  <TableCell align="center">
                    <Box className="ou-flex ou-justify-center ou-items-center">
                      {t("function")} 
                    </Box>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>

                {isLoadingExamination && 
                  <TableCell colSpan={12} component="th" scope="row">
                      <Box className="ou-text-center">
                          <SkeletonListLineItem count={4} className="ou-w-full" />
                      </Box>
                  </TableCell>
                }
                {
                  !isLoadingExamination && 
                  examinationList.length > 0 && examinationList.map((e) => (
                    <ExaminationCard key={`e-${e.id}`} 
                    examinationData={e} user={user} 
                    callback={handleChangeFlag}
                    disableOtherCards={disableOtherCards}
                    loading={loadingState[e.id] || false} 
                    sendEmailConfirm={() => handleSendEmailConfirm(e.user.id, e.id, user.avatar_path)}
                    />       
                ))} 

                {!isLoadingExamination && 
                  examinationList.length === 0 &&  <TableCell colSpan={12} component="th" scope="row">
                  <Typography> <Box className="ou-text-center ou-p-10 ou-text-red-700">{t('examinations:errExamsNull')}</Box></Typography>
                </TableCell>
                } 

              </TableBody>
            </Table>
          </TableContainer>
          {pagination.sizeNumber >= 2 && (
            <Box sx={{ 
              pt: 5, 
              pb: 2,
              '& .MuiPagination-root': {
                '& .MuiPaginationItem-root': {
                  fontSize: isMobile ? '0.75rem' : '0.875rem',
                  padding: isMobile ? '4px' : '8px'
                }
              }
            }}>
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
  );
};
export default Examinations;

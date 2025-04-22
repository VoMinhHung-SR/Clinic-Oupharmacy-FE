import {
  Box,
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
} from "@mui/material";
import useExaminationConfirm from "../../../modules/pages/ExaminationListComponents/ExaminationConfirm/hooks/useExaminationConfirm";
import { useTranslation } from "react-i18next";
import ExaminationCard from "../../../modules/common/components/card/ExaminationCard";
import ExaminationFilter from "../../../modules/common/components/FIlterBar/ExaminationFilter";
import { Helmet } from "react-helmet";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
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
          <Box className="ou-flex ou-justify-center ou-flex-col" >
          <TableContainer component={Paper} elevation={4}>

            <div className="ou-flex ou-items-center ou-justify-between">
              <div className="ou-flex ou-items-end">
                <h1 className="ou-text-xl ou-pl-4">{t('listOfExaminations')}</h1>
                <span className="ou-pl-2 ou-text-sm">{t('resultOfTotal', {result: pagination.count})}</span>
              </div>

              {/* Filter area */}
              <ExaminationFilter onSubmit={handleOnSubmitFilter} 
                mailStatus={paramsFilter.mailStatus} createdDate={paramsFilter.createdDate} 
                kw={paramsFilter.kw} hasDiagnosis={paramsFilter.hasDiagnosis}
              />
            </div>
            
            {/* Content area */}
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
            <Box sx={{ pt: 5, pb: 2 }}>
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

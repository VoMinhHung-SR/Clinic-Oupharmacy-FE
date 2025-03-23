import { Button, Container, FormControl, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system"
import Loading from "../../../modules/common/components/Loading"
import usePrescriptionList from "../../../modules/pages/PrescriptionListComponents/hooks/usePrescription"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import DiagnosisFilter from "../../../modules/common/components/FIlterBar/DiagnosisFilter"
import DiagnosedCard from "../../../modules/common/components/card/DiagnosedCard"

const PrescriptionList = () => {
    const {user, prescriptionList, isLoadingPrescriptionList,
    pagination, page, handleChangePage, handleOnSubmitFilter, paramsFilter} = usePrescriptionList()
    const {t, ready} = useTranslation(['prescription', 'common'])
    //TODO: add skeletons here
    if(!ready)
        return <Box sx={{ height: "300px" }}>
            <Helmet>
                <title>Prescribing</title>
            </Helmet>

            <Box className='ou-p-5'>
                <Loading/>
            </Box>
        </Box>

    return (
        <>
            <Helmet>
                <title>Prescribing</title>
            </Helmet>
            <Box className='ou-m-auto ou-w-full'>
                <TableContainer component={Paper} elevation={4}>
                <div className="ou-flex ou-items-center ou-justify-between">
                    <div className="ou-flex ou-items-end">
                        <h1 className="ou-text-xl ou-pl-4">{t('listOfDiagnosisForms')}</h1>
                        <span className="ou-pl-2 ou-text-sm">{t('resultOfTotal', {result: pagination.count})}</span>
                    </div>
                    <DiagnosisFilter onSubmit={handleOnSubmitFilter}
                    doctorName={paramsFilter.doctorName} createdDate={paramsFilter.createdDate} 
                    patientName={paramsFilter.patientName} hasPrescription={paramsFilter.hasPrescription}
                    hasPayment={paramsFilter.hasPayment}/>

                </div>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('prescriptionId')}</TableCell>
                                <TableCell>{t('EID')}</TableCell>
                                <TableCell align="center">{t('sign')}</TableCell>
                                <TableCell align="center">{t('diagnosed')}</TableCell>
                                <TableCell align="center">{t('diagnosisDate')}</TableCell>
                                <TableCell align="center">{t('prescribingStatus')}</TableCell>
                                <TableCell align="center">{t('paymentStatus')}</TableCell>
                                <TableCell align="center">{t('patientName')}</TableCell>
                                <TableCell align="center">{t('doctorName')}</TableCell>
                                <TableCell align="center">{t('feature')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoadingPrescriptionList && 
                             <TableCell colSpan={12} component="th" scope="row">
                                <Box className="ou-text-center ou-p-10">
                                    <Loading/>
                                </Box>
                            </TableCell>}

                            {!isLoadingPrescriptionList && prescriptionList.length === 0 &&  
                            <TableCell colSpan={12} component="th" scope="row">
                                <Typography> 
                                    <Box className="ou-text-center ou-p-10 ou-text-red-700">{t('prescription:errNullPrescription')}</Box>
                                </Typography>
                            </TableCell> }
                            
                            {!isLoadingPrescriptionList && prescriptionList.map(diagnosisInfo => (
                                <DiagnosedCard diagnosedInfo={diagnosisInfo} user={user}/>
                            ))}
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
    )
} 
export default PrescriptionList
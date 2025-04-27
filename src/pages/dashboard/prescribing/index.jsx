import { Button, Container, FormControl, Pagination, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material"
import { Box } from "@mui/system"
import usePrescriptionList from "../../../modules/pages/PrescriptionListComponents/hooks/usePrescription"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import DiagnosisFilter from "../../../modules/common/components/FIlterBar/DiagnosisFilter"
import DiagnosedCard from "../../../modules/common/components/card/DiagnosedCard"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"

const PrescriptionList = () => {
    const {user, prescriptionList, isLoadingPrescriptionList,
    pagination, page, handleChangePage, handleOnSubmitFilter, paramsFilter} = usePrescriptionList()
    const {t, ready} = useTranslation(['prescription', 'common'])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    if(!ready)
        return <Box sx={{ height: "300px" }}>
            <Helmet>
                <title>Prescribing</title>
            </Helmet>

            <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[30vh]">
                <SkeletonListLineItem count={5} className="ou-w-full"/>
            </Box>
        </Box>

    return (
        <>
            <Helmet>
                <title>{t('common:prescribing')}</title>
            </Helmet>
            <Box className='ou-m-auto ou-w-full ou-px-4 ou-py-6'>
                <TableContainer component={Paper} elevation={4} className="ou-overflow-x-auto ">
                    <div className={`ou-flex ${isTablet ? 'ou-flex-col' : 'ou-flex-row ou-justify-center ou-items-center'} 
                    ou-items-start ou-justify-between ou-gap-4 ou-p-4`}>
                        <div className="ou-flex ou-items-end">
                            <h1 className="ou-text-xl ">{t('listOfDiagnosisForms')}</h1>
                            <span className="ou-text-sm ou-text-gray-600">{t('resultOfTotal', {result: pagination.count})}</span>
                        </div>
                        <Box className="ou-w-full md:ou-w-auto">
                            <DiagnosisFilter onSubmit={handleOnSubmitFilter}
                            doctorName={paramsFilter.doctorName} createdDate={paramsFilter.createdDate} 
                            patientName={paramsFilter.patientName} hasPrescription={paramsFilter.hasPrescription}
                            hasPayment={paramsFilter.hasPayment}/>
                        </Box>
                    </div>
                    <Table size={isMobile ? "small" : "medium"}>
                        <TableHead>
                            <TableRow>
                                <TableCell className="ou-hidden md:ou-table-cell">{t('prescriptionId')}</TableCell>
                                <TableCell className="ou-hidden md:ou-table-cell">{t('EID')}</TableCell>
                                <TableCell align="center">{t('sign')}</TableCell>
                                <TableCell align="center">{t('diagnosed')}</TableCell>
                                <TableCell align="center">{t('diagnosisDate')}</TableCell>
                                <TableCell align="center">{t('prescribingStatus')}</TableCell>
                                <TableCell align="center">{t('paymentStatus')}</TableCell>
                                <TableCell align="center">{t('patientName')}</TableCell>
                                <TableCell className="ou-hidden md:ou-table-cell" align="center">{t('doctorName')}</TableCell>
                                <TableCell align="center">{t('feature')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoadingPrescriptionList && 
                             <TableCell colSpan={12} component="th" scope="row">
                                <Box className="ou-text-center">
                                    <SkeletonListLineItem count={4} className="ou-w-full"  />
                                </Box>
                            </TableCell>
                            }

                            {!isLoadingPrescriptionList && prescriptionList.length === 0 &&  
                            <TableCell colSpan={12} component="th" scope="row">
                                <Typography> 
                                    <Box className="ou-text-center ou-p-10 ou-text-red-700">{t('prescription:errNullPrescription')}</Box>
                                </Typography>
                            </TableCell> }
                            
                            {!isLoadingPrescriptionList && prescriptionList.map(diagnosisInfo => (
                                <DiagnosedCard diagnosedInfo={diagnosisInfo} user={user} isMobile={isMobile}/>
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
                        size={isMobile ? "small" : "medium"}
                        />
                    </Stack>
                    </Box>
                )}
            </Box>
        </>
    )
} 
export default PrescriptionList
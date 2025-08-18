import { Badge, Button, Pagination, Paper, Stack, Table, TableBody, 
    TableCell, TableContainer, TableHead, TableRow, 
    Typography, useMediaQuery, useTheme } from "@mui/material"
import { Box } from "@mui/system"
import usePrescriptionList from "../../../modules/pages/PrescriptionListComponents/hooks/usePrescription"
import { useTranslation } from "react-i18next"
import { Helmet } from "react-helmet"
import DiagnosisFilter from "../../../modules/common/components/FIlterBar/DiagnosisFilter"
import DiagnosedCard from "../../../modules/common/components/card/DiagnosedCard"
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem"
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, memo } from "react";
import { Collapse } from "@mui/material";
import SkeletonPrescribingList from "../../../modules/common/components/skeletons/pages/prescribing"

const MemoizedDiagnosisFilter = memo(DiagnosisFilter);

const PrescriptionList = () => {
    const {user, prescriptionList, isLoadingPrescriptionList,
    pagination, page, handleChangePage, handleOnSubmitFilter, paramsFilter} = usePrescriptionList()
    const {t, ready} = useTranslation(['prescription', 'common'])
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const [showFilter, setShowFilter] = useState(false);
    if(!ready)
        return <Box className="ou-h-[80vh]">
            <Helmet>
                <title>Prescribing</title>
            </Helmet>
            <SkeletonPrescribingList />
        </Box>

    return (
        <>
            <Helmet>
                <title>{t('common:prescribing')}</title>
            </Helmet>
            <Box className='ou-m-auto ou-w-full'>
                <TableContainer component={Paper} elevation={4} className="ou-overflow-x-auto ">
                    <div className={`ou-flex ${isTablet ? 'ou-flex-col' : 'ou-flex-row ou-justify-center ou-items-center'} 
                    ou-items-start ou-justify-between ou-gap-4 ou-p-4`}>
                        <div className="ou-flex ou-items-center">
                            <h1 className="ou-text-xl ">{t('listOfDiagnosisForms')}</h1>
                            <Button
                                variant="outlined"
                                startIcon={<Badge badgeContent={pagination.count} color="primary"> <FilterListIcon /> </Badge>}
                                endIcon={<ExpandMoreIcon sx={{ transform: showFilter ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
                                onClick={() => setShowFilter((prev) => !prev)}
                                sx={{ borderRadius: 3, fontWeight: 500, marginLeft: '12px', textTransform: 'none' }}
                            >
                                <span className="ou-pl-3">{t('prescription:filter')}</span>
                            </Button>
                        </div>
                    </div>
                        <Collapse in={showFilter}>
                            <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, width: '100%' }}>
                            <Box className="ou-w-full md:ou-w-auto">
                                <MemoizedDiagnosisFilter onSubmit={handleOnSubmitFilter}
                                doctorName={paramsFilter.doctorName} createdDate={paramsFilter.createdDate} 
                                patientName={paramsFilter.patientName} hasPrescription={paramsFilter.hasPrescription}
                                hasPayment={paramsFilter.hasPayment}/>
                            </Box>
                            </Paper>
                        </Collapse>
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
                                    <SkeletonListLineItem count={10} height="40px" className="ou-w-full"  />
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
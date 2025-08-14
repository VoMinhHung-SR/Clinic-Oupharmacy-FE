import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Chip, Divider, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ROLE_DOCTOR, ROLE_NURSE, SERVICE_FEE } from "../../../../../lib/constants";
import { useContext } from "react";
import UserContext from "../../../../../lib/context/UserContext";

const PrescriptionDetailCard = ({ prescriptionData }) => {
    const { t, tReady } = useTranslation(['prescription-detail', 'common']);

    const {user} = useContext(UserContext)

    if (tReady) {
        return (
            <Box className="ou-flex ou-justify-center ou-items-center ou-h-64">
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!prescriptionData) {
        return (
            <Box className="ou-flex ou-justify-center ou-items-center ou-h-64">
                <Typography color="error">{t('prescription-detail:errNullPrescription')}</Typography>
            </Box>
        );
    }

    const {
        listPrescribingId,
        created_date,
        medicineUnits = [],
        bill_status,
        examination,
        patient,
        user: doctor
    } = prescriptionData;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const totalAmount = medicineUnits?.reduce((acc, prescribingDetail) => {
        return acc + (prescribingDetail.medicine_unit.price || 0) * prescribingDetail.quantity;
    }, 0) || 0;

    // Get bill amount if available
    // const billAmount = bill_status?.amount || 0;
    const renderButtons = () => {
        return (
            <Box className="ou-flex ou-items-center ou-gap-2">
                {!bill_status && user.role === ROLE_NURSE && (
                    <Button variant="contained" color="primary">
                        {t('prescription-detail:pay')}
                    </Button>
                )}
                {user.role === ROLE_DOCTOR && (
                    <Button variant="contained" color="primary">
                        {t('prescription-detail:print')}
                    </Button>
                )}
            </Box>
        )
    }
    return (
        <Box className="ou-mb-8 ou-w-[100%] ou-m-auto"
        key={'prescription-detail-card-'+listPrescribingId[0]}>
            <Paper elevation={4} className="ou-p-6">
                {/* Header */}
                <Box className="ou-flex ou-justify-between ou-items-center ou-mb-6">
                    <Box className="ou-flex ou-items-center ou-gap-3">
                        <LocalHospitalIcon className="ou-text-blue-600" sx={{ fontSize: 32 }} />
                        <Typography variant="h4" className="ou-font-bold ou-text-gray-800">
                            {t('prescription-detail:prescriptionDetail')} 
                            {listPrescribingId && listPrescribingId.map((id, index) => {
                                return (
                                    <span key={id} className="ou-text-gray-500">
                                        {index === 0 ? "" : " - "} #{id.toString().padStart(3, '0')}
                                    </span>
                                )
                            })}
                            
                        </Typography>
                    </Box>
                    {
                        user.role === ROLE_NURSE && (
                            <Chip
                                label={bill_status ? "Đã thanh toán" : "Chưa thanh toán"}
                                color={bill_status ? "success" : "warning"}
                                variant="filled"
                                size="large"
                            />
                        )
                    }
                </Box>

                <Divider className="ou-mb-6" />

                {/* Basic Information */}
                <Grid container className="ou-mb-6">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" className="ou-font-semibold ou-mb-4 ou-flex 
                        ou-items-center ou-gap-2 ou-py-3">
                            <PersonIcon className="ou-text-blue-600" />
                            {t('prescription-detail:patientInfo')}
                        </Typography>
                        <Box className="ou-space-y-3">
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:patientFullName')}:
                                </Typography>
                                <Typography>{patient?.first_name && patient?.last_name ? 
                                    `${patient.first_name} ${patient.last_name}` : 'N/A'}</Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <CalendarTodayIcon className="ou-text-gray-500" />
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:dateOfBirth')}:
                                </Typography>
                                <Typography>
                                    {patient?.date_of_birth ? moment(patient.date_of_birth).format('DD/MM/YYYY') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <PhoneIcon className="ou-text-gray-500" />
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:phoneNumber')}:
                                </Typography>
                                <Typography>{patient?.phone_number || 'N/A'}</Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <EmailIcon className="ou-text-gray-500" />
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:email')}:
                                </Typography>
                                <Typography>{patient?.email || 'N/A'}</Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <LocationOnIcon className="ou-text-gray-500" />
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:address')}:
                                </Typography>
                                <Typography>{patient?.address || 'N/A'}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" className="ou-font-semibold ou-mb-4 ou-flex 
                        ou-items-center ou-gap-2 ou-py-3">
                            <LocalHospitalIcon className="ou-text-green-600" />
                            {t('prescription-detail:basicInformation')}
                        </Typography>
                        <Box className="ou-space-y-3">
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:prescriptionId')}:
                                </Typography>
                                <Typography className="ou-font-bold ou-text-blue-600">
                                    #{examination.id.toString().padStart(3, '0')}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:createdDate')}:
                                </Typography>
                                <Typography>
                                    {examination?.created_date ? moment(examination.created_date).format('DD/MM/YYYY') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:diagnosisDate')}:
                                </Typography>
                                <Typography>
                                    {created_date ? moment(created_date).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:doctorName')}:
                                </Typography>
                                <Typography className="ou-font-semibold">
                                    {doctor?.first_name && doctor?.last_name ? 
                                        `${doctor.first_name} ${doctor.last_name}` : 'N/A'}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Divider className="ou-mb-6" />

                {/* Medicine List */}
                <Box className="ou-mb-6">
                    <Typography variant="h6" className="ou-font-semibold ou-mb-4 ou-py-3">
                        {t('prescription-detail:prescriptionDetail')}
                    </Typography>
                    
                    {medicineUnits.length === 0 ? (
                        <Box className="ou-text-center ou-py-8">
                            <Typography color="textSecondary" className="ou-text-lg">
                                {t('prescription-detail:nullMedicine')}
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} elevation={2}>
                            <Table>
                                <TableHead>
                                    <TableRow className="ou-bg-gray-50">
                                        <TableCell align="center" className="ou-font-semibold">
                                            STT
                                        </TableCell>
                                        <TableCell align="center" className="ou-font-semibold">
                                            {t('prescription-detail:medicineName')}
                                        </TableCell>
                                        <TableCell align="center" className="ou-font-semibold">
                                            {t('prescription-detail:uses')}
                                        </TableCell>
                                        <TableCell align="center" className="ou-font-semibold">
                                            {t('prescription-detail:quantity')}
                                        </TableCell>
                                        <TableCell align="center" className="ou-font-semibold">
                                            {t('prescription-detail:price')} (VND)
                                        </TableCell>
                                        <TableCell align="center" className="ou-font-semibold">
                                            {t('prescription-detail:amount')} (VND)
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {medicineUnits.map((prescribingDetail, index) => (
                                        <TableRow key={"m-unit-"+prescribingDetail.medicine_unit.id} className="ou-hover:ou-bg-gray-50">
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center" className="ou-font-medium">
                                                {prescribingDetail.medicine_unit.medicine.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {prescribingDetail.uses}
                                            </TableCell>
                                            <TableCell align="center">
                                                {prescribingDetail.quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                                {formatCurrency(prescribingDetail.medicine_unit.price || 0)}
                                            </TableCell>
                                            <TableCell align="center" className="ou-font-semibold">
                                                {formatCurrency((prescribingDetail.medicine_unit.price || 0) 
                                                * prescribingDetail.quantity)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>

                <Box className="ou-flex ou-items-center ou-gap-2 ou-py-3">
                    <Typography className="ou-font-semibold ou-text-gray-500">
                        {t('prescription-detail:note')}
                    </Typography>
                    <Typography className="ou-font-medium ou-text-gray-500">
                        
                    </Typography>
                </Box>
                <Divider className="ou-mb-6" />

                {/* Total Amount */}
                {medicineUnits.length > 0 && (
                    <Box className="ou-flex ou-justify-end ou-mt-6">
                        <Box className="ou-flex ou-flex-col ou-items-end ou-gap-2">
                            <Box className="ou-font-semibold ou-text-gray-500">
                                {t('prescription-detail:serviceFee')} : {formatCurrency(SERVICE_FEE)}
                            </Box>
                        
                            <Box className="ou-bg-blue-50 ou-p-4 ou-rounded-lg ou-border-2 ou-border-blue-200">
                                <Typography variant="h6" className="ou-font-bold ou-text-blue-800">
                                    {t('prescription-detail:totalAmount')}: 
                                    {formatCurrency(totalAmount + SERVICE_FEE)}
                                </Typography>
                            </Box>

                            <Box className="ou-flex ou-items-center ou-gap-2">
                               {renderButtons()}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PrescriptionDetailCard;
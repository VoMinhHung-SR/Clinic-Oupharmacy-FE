import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Chip, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const PrescriptionDetailCard = ({ prescriptionData }) => {
    const { t, tReady } = useTranslation(['prescription-detail', 'common']);

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
        id,
        patient,
        doctor,
        created_at,
        diagnosis_date,
        medicines = [],
        total_amount = 0,
        status = 'completed'
    } = prescriptionData;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'pending':
                return 'warning';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'completed':
                return 'Hoàn tất';
            case 'pending':
                return 'Đang xử lý';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return 'Không xác định';
        }
    };

    return (
        <Box className="ou-my-5 ou-mb-8 ou-w-[100%] ou-m-auto">
            <Paper elevation={4} className="ou-p-6">
                {/* Header */}
                <Box className="ou-flex ou-justify-between ou-items-center ou-mb-6">
                    <Box className="ou-flex ou-items-center ou-gap-3">
                        <LocalHospitalIcon className="ou-text-blue-600" sx={{ fontSize: 32 }} />
                        <Typography variant="h4" className="ou-font-bold ou-text-gray-800">
                            {t('prescription-detail:prescriptionDetail')}
                        </Typography>
                    </Box>
                    {/* TODO: add status */}
                    {/* <Chip
                        icon={<CheckCircleOutlineIcon />}
                        label={getStatusText(status)}
                        color={getStatusColor(status)}
                        variant="filled"
                        size="large"
                    /> */}
                </Box>

                <Divider className="ou-mb-6" />

                {/* Basic Information */}
                <Grid container className="ou-mb-6">
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" className="ou-font-semibold ou-mb-4 
                        ou-flex ou-items-center ou-gap-2 ou-py-2">
                            <PersonIcon className="ou-text-blue-600" />
                            {t('prescription-detail:patientInfo')}
                        </Typography>
                        <Box className="ou-space-y-3">
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:patientFullName')}:
                                </Typography>
                                <Typography>{patient?.full_name || 'N/A'}</Typography>
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
                        <Typography variant="h6" className="ou-font-semibold ou-mb-4 ou-flex ou-items-center ou-gap-2 ou-py-2">
                            <LocalHospitalIcon className="ou-text-green-600 " />
                            {t('prescription-detail:basicInformation')}
                        </Typography>
                        <Box className="ou-space-y-3">
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:prescriptionId')}:
                                </Typography>
                                <Typography className="ou-font-bold ou-text-blue-600">#{id}</Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:createdDate')}:
                                </Typography>
                                <Typography>
                                    {created_at ? moment(created_at).format('DD/MM/YYYY HH:mm') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:diagnosisDate')}:
                                </Typography>
                                <Typography>
                                    {diagnosis_date ? moment(diagnosis_date).format('DD/MM/YYYY') : 'N/A'}
                                </Typography>
                            </Box>
                            <Box className="ou-flex ou-items-center ou-gap-2">
                                <Typography className="ou-font-medium ou-min-w-24">
                                    {t('prescription-detail:doctorName')}:
                                </Typography>
                                <Typography className="ou-font-semibold">{doctor?.full_name || 'N/A'}</Typography>
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
                    
                    {medicines.length === 0 ? (
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
                                            {t('prescription-detail:availableQuantity')}
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
                                    {medicines.map((medicine, index) => (
                                        <TableRow key={medicine.id} className="ou-hover:ou-bg-gray-50">
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell align="center" className="ou-font-medium">
                                                {medicine.medicine_name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {medicine.uses}
                                            </TableCell>
                                            <TableCell align="center">
                                                {medicine.quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                                {medicine.available_quantity || medicine.quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                                {formatCurrency(medicine.unit_price || 0)}
                                            </TableCell>
                                            <TableCell align="center" className="ou-font-semibold">
                                                {formatCurrency((medicine.unit_price || 0) * medicine.quantity)}
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
                {medicines.length > 0 && (
                    <Box className="ou-flex ou-justify-end ou-mt-6">
                        <Box className="ou-bg-blue-50 ou-p-4 ou-rounded-lg ou-border-2 ou-border-blue-200">
                            <Typography variant="h6" className="ou-font-bold ou-text-blue-800">
                                {t('prescription-detail:totalAmount')}: {formatCurrency(total_amount)}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PrescriptionDetailCard;
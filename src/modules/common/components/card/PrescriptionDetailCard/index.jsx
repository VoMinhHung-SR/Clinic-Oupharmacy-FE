import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Chip, Divider, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import moment from "moment";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { SERVICE_FEE } from "../../../../../lib/constants";
import { canShowPaymentButtons, canShowPrintButton, canViewPayments } from "../../../../../lib/auth";
import { useContext } from "react";
import UserContext from "../../../../../lib/context/UserContext";
import Loading from "../../Loading";
import PrintIcon from '@mui/icons-material/Print';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { resolvePrescriptionDetailUnitPrice, getPrescriptionLineDisplayName } from "../../../../../lib/adapters/storeProduct";

const PrescriptionDetailCard = ({ prescriptionData, handlePayment, isLoadingButton, onPrint, printActionsEmphasized = false }) => {
    const { t, tReady } = useTranslation(['prescription-detail', 'common', 'payment']);

    const {user} = useContext(UserContext)
    if (tReady) {
        return (
            <Box className="ou-flex ou-justify-center ou-items-center ou-h-64 ou-p-5">
                <Loading />
            </Box>
        );
    }

    if (!prescriptionData) {
        return (
            <Box className="ou-flex ou-justify-center ou-items-center ou-h-64 ou-p-5">
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

    const getUnitPrice = (prescribingDetail = {}) =>
        resolvePrescriptionDetailUnitPrice(prescribingDetail);

    const getMedicineName = (prescribingDetail = {}) => getPrescriptionLineDisplayName(prescribingDetail);

    const getPackagingLabel = (prescribingDetail = {}) => {
        return (
            prescribingDetail?.medicine_unit?.package_size
            || prescribingDetail?.medicine_unit?.packaging
            || prescribingDetail?.unit_name_snapshot
            || prescribingDetail?.product_variant_unit?.unit_name
            || prescribingDetail?.product_variant?.packing
            || ""
        );
    };

    const totalAmount = medicineUnits?.reduce((acc, prescribingDetail) => {
        return acc + getUnitPrice(prescribingDetail) * prescribingDetail.quantity;
    }, 0) || 0;

    const isPaymentsMode = typeof handlePayment === "function"
    const isPaid = Boolean(bill_status)

    const handlePrintClick = () => {
        if (onPrint) {
            const firstId = Array.isArray(listPrescribingId) ? listPrescribingId[0] : undefined;
            onPrint(firstId);
        } else {
            window.print();
        }
    };

    const renderButtons = () => {
        return (
            <Box
                className={
                    isPaymentsMode
                        ? "ou-flex ou-flex-col ou-items-end ou-gap-2 no-print"
                        : "ou-flex ou-items-center ou-gap-2 no-print"
                }
            >
                {canShowPaymentButtons(user, bill_status) && (
                    <Box>
                        <Button
                            variant="contained"
                            className="!ou-min-w-[160px] !ou-btn-momo !ou-mt-3 !ou-mr-2"
                            onClick={() => handlePayment({ momoWallet: true })}
                            disabled={isLoadingButton}
                        >
                            {t('payment:momoPayment')}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            className="!ou-min-w-[160px] !ou-btn-base !ou-mt-3"
                            disabled={isLoadingButton}
                            onClick={() => handlePayment({ momoWallet: false })}
                        >
                            {t('payment:pay')}
                        </Button>
                    </Box>
                )}

                {/* Payments page: only show print receipt when paid (nurse) */}
                {isPaymentsMode ? (
                    isPaid && canViewPayments(user) ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            size="medium"
                            className="!ou-min-w-[200px]"
                            startIcon={<ReceiptLongIcon />}
                            onClick={handlePrintClick}
                        >
                            {t("payment:printReceipt")}
                        </Button>
                    ) : null
                ) : (
                    canShowPrintButton(user) && (
                        <Button
                            variant={printActionsEmphasized ? "contained" : "outlined"}
                            color="primary"
                            size={printActionsEmphasized ? "large" : "medium"}
                            className={printActionsEmphasized ? "!ou-min-w-[200px]" : "!ou-min-w-[160px]"}
                            sx={printActionsEmphasized ? { width: { xs: "100%", sm: "auto" } } : undefined}
                            startIcon={<PrintIcon />}
                            onClick={handlePrintClick}
                        >
                            {t("prescription-detail:printPrescription")}
                        </Button>
                    )
                )}
            </Box>
        );
    };
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
                    {canViewPayments(user) && (
                        <Chip
                            label={bill_status ? t('payment:paid') : t('payment:unpaid')}
                            color={bill_status ? "success" : "warning"}
                            variant="filled"
                            size="large"
                        />
                    )}
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
                                        <TableRow key={prescribingDetail?.id ?? `m-unit-${index}`} className="ou-hover:ou-bg-gray-50">
                                            <TableCell align="center">{index + 1}</TableCell>
                                            <TableCell className="ou-font-medium">
                                                {getMedicineName(prescribingDetail)}
                                                
                                                {getPackagingLabel(prescribingDetail) && (
                                                    <Typography component="span" variant="caption" display="block" className="ou-text-gray-600">
                                                        ({getPackagingLabel(prescribingDetail)})
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell align="center">
                                                {prescribingDetail.uses}
                                            </TableCell>
                                            <TableCell align="center">
                                                {prescribingDetail.quantity}
                                            </TableCell>
                                            <TableCell align="center">
                                                {formatCurrency(getUnitPrice(prescribingDetail))}
                                            </TableCell>
                                            <TableCell align="center" className="ou-font-semibold">
                                                {formatCurrency(getUnitPrice(prescribingDetail) * prescribingDetail.quantity)}
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
                        {t('prescription-detail:doctorNote')}: 
                    </Typography>
                </Box>
                <Divider className="ou-mb-6" />

                {/* Total Amount */}
                {medicineUnits.length > 0 && (
                    <Box
                        className={
                            printActionsEmphasized
                                ? "ou-flex ou-justify-end ou-mt-6 no-print"
                                : "ou-flex ou-justify-end ou-mt-6"
                        }
                    >
                        <Box className="ou-flex ou-flex-col ou-items-end ou-gap-2 ou-w-full sm:ou-w-auto">
                            <Box className="ou-font-semibold ou-text-gray-500">
                                {t('prescription-detail:serviceFee')} : {formatCurrency(SERVICE_FEE)}
                            </Box>

                            <Box className="ou-bg-blue-50 ou-p-4 ou-rounded-lg ou-border-2 ou-border-blue-200 ou-w-full sm:ou-w-auto">
                                <Typography variant="h6" className="ou-font-bold ou-text-blue-800">
                                    {t('prescription-detail:totalAmount')}:
                                    {formatCurrency(totalAmount + SERVICE_FEE)}
                                </Typography>
                            </Box>

                            {printActionsEmphasized ? (
                                <Box
                                    sx={{
                                        width: "100%",
                                        pt: 1.5,
                                        mt: 0.5,
                                        borderTop: "1px solid",
                                        borderColor: "divider",
                                        display: "flex",
                                        justifyContent: { xs: "stretch", sm: "flex-end" },
                                    }}
                                >
                                    <Box sx={{ width: { xs: "100%", sm: "auto" } }}>{renderButtons()}</Box>
                                </Box>
                            ) : (
                                <Box className="ou-flex ou-items-center ou-gap-2">{renderButtons()}</Box>
                            )}
                        </Box>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default PrescriptionDetailCard;
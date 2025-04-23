import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import Loading from "../../Loading"
import useBillCard from "./hooks/useBillCard"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { calculateAmount } from "./utils/helper";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { formatNumber, formatNumberCurrency } from "../../../../../lib/utils/helper";
import useAppointment from "../../../../../firebase/hooks/useAppointment";
import { WAITING_STATUS_DONE } from "../../../../../lib/constants";
import SkeletonBillCard from "../../skeletons/card/BillCard";

const BillCard = (props) => {
    const { id: prescribingId, date, slotID, wage, bill_status } = props;
    const { t } = useTranslation(['payment', 'common', 'modal', 'prescription-detail']);
    const { 
        isLoading,
        onSubmit, 
        prescriptionDetail, 
        isLoadingButton,
        momoPayment, 
        zaloPayPayment 
    } = useBillCard(prescribingId);
    
    const { updateAppointmentStatus } = useAppointment(date, slotID);
    const router = useNavigate();

    const renderPaymentButtons = () => {
        if (isLoadingButton) {
            return (
                <Box className="!ou-mt-4 ou-flex ou-justify-end">
                    <Loading />
                </Box>
            );
        }

        const amount = calculateAmount(prescriptionDetail, wage);

        return (
            <Box className="!ou-mt-4 ou-flex ou-justify-end ou-items-center ou-flex-wrap ou-gap-2">
                {/* ZaloPay button can be re-enabled later */}
                {/* <Button ... onClick={() => zaloPayPayment(amount, prescribingId)}>...</Button> */}
                <Button 
                    variant="contained"  
                    className="!ou-bg-[#a50064]"
                    onClick={() => momoPayment(amount, prescribingId)}
                >
                    {t('momoPayment')}
                </Button>
                <Button 
                    onClick={() => onSubmit(
                        amount, 
                        prescribingId, 
                        async () => {
                            try {
                                await updateAppointmentStatus(WAITING_STATUS_DONE);
                            } catch (error) {
                                console.error('Failed to update appointment status:', error);
                            }
                        }, 
                        () => {}
                    )} 
                    variant="contained" 
                    color="success"
                >
                    {t('pay')}
                </Button>
            </Box>
        );
    };

    const renderContent = () => {
        if (prescriptionDetail.length === 0) {
            return (
                <Box className='ou-p-5 ou-text-center ou-flex ou-flex-col ou-items-center'>
                    <h3 className='ou-text-lg ou-text-red-600'>
                        {t('payment:errLoadPrescriptionDetailFailed', { id: prescribingId })}
                    </h3>
                </Box>
            );
        }

        return (
            <Box className="ou-p-3">
                <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}> 
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center">{t('payment:medicineName')}</TableCell>
                                <TableCell align="center">{t('payment:uses')}</TableCell>
                                <TableCell align="center">{t('payment:quantity')}</TableCell>
                                <TableCell align="center">{t('payment:unitPrice')}</TableCell>
                                <TableCell align="center">{t('payment:total')} (VND)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {prescriptionDetail.map((p) => (
                                <TableRow
                                    key={p.medicine_unit.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {p.medicine_unit.medicine.name}
                                    </TableCell>
                                    <TableCell align="center">{p.uses}</TableCell>
                                    <TableCell align="center">{formatNumber(p.quantity)}</TableCell>
                                    <TableCell align="center">{formatNumberCurrency(p.medicine_unit.price)}</TableCell>
                                    <TableCell align="center" className="!ou-font-medium">
                                        {formatNumberCurrency(p.medicine_unit.price * p.quantity)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                
                <Box className="ou-text-right ou-space-y-1">
                    <Typography>{t('payment:serviceFee')}: {formatNumberCurrency(wage, 'VND')}</Typography>
                    <Typography variant="h6" component="h4" className="!ou-font-bold">{t('payment:amount')}: 
                        {formatNumberCurrency(calculateAmount(prescriptionDetail, wage))} VND</Typography>
                    
                    {bill_status ? ( 
                        <Typography 
                            variant="h6" 
                            component="h3" 
                            className="!ou-mt-4 !ou-text-green-700 !ou-font-bold ou-flex ou-justify-end ou-items-center ou-gap-1"
                        >
                            {t('payment:done')} <CheckCircleOutlineIcon fontSize="inherit" />
                        </Typography>
                    ) : renderPaymentButtons()} 
                </Box>
            </Box>
        );
    }

    return (
        <Box component={Paper} elevation={6} className="ou-overflow-hidden">
             <h2 className="ou-text-center ou-text-xl ou-py-4">
                 {t('payment:prescriptionDetail', {id: prescribingId})}
            </h2>
            
            {isLoading ? (
                <Box className="ou-p-5">
                    <SkeletonBillCard count={3} height="30px" /> 
                </Box>
            ) : (
                renderContent()
            )}
        </Box>
    );
}

export default BillCard; 
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

const BillCard = (props) =>{
    const {t} = useTranslation(['payment','common', 'modal', 'prescription-detail']);

    const {isLoadingPrescriptionDetail, onSubmit,prescriptionDetail,
         isLoadingButton, momoPayment, zaloPayPayment} = useBillCard(props.id)

    const {updateAppointmentStatus} = useAppointment(props.date, props.slotID)
    const router = useNavigate();


    const renderLoadingButton = () => {
        if(isLoadingButton)
            return(<Box className="!ou-mt-2">
                <Loading/>
            </Box>
            )
        else return (
            <Box className="!ou-mt-2 ">
                {/* <Button className="!ou-mr-5 !ou-bg-[#1e88e5"
                    variant="contained" 
                    disabled
                    onClick={()=> zaloPayPayment(calculateAmount(prescriptionDetail, props.wage), props.id)}
                    >
                        {t('zalopayPayment')}
                </Button> */}
                <Button variant="contained"  className="!ou-bg-[#a50064]"
                    onClick={()=> momoPayment(calculateAmount(prescriptionDetail, props.wage), props.id)}>
                        {t('momoPayment')}
                </Button>
                
                <Button className="!ou-ml-5" onClick={()=>
                    onSubmit(calculateAmount(prescriptionDetail, props.wage), props.id, 
                    async () => {
                        try {
                            await updateAppointmentStatus(WAITING_STATUS_DONE);
                        } catch (error) {
                            console.error('Failed to update appointment status:', error);
                        }
                    }, () => {})} 
                    variant="contained" color="success">
                    {t('pay')}
                </Button>
            </Box>
        )
    }
    

    return (<>
        {isLoadingPrescriptionDetail && prescriptionDetail.length === 0 ?
            (<Box sx={{ height: "50px" }}>
                <Box className='p-5'>
                    <Loading/>                
                </Box>
            </Box>)
          
            : prescriptionDetail.length === 0 ?
                (<Box>
                    <Box className='ou-text-center  ou-flex ou-flex-col ou-items-center'>
                        <h2 className='ou-text-xl ou-text-red-600'>
                            {t('errNullPrescriptionDetail')}
                        </h2>
                        <Typography className='text-center'>
                            <h3>{t('common:backToHomepage')} </h3>
                            <Button onClick={() => { router('/dashboard') }}>{t('common:here')}!</Button>
                        </Typography>
                    </Box>
                </Box>)
                : (
                    <>
                        <Box component={Paper} elevation={6}>
                            <h2 className="ou-text-center ou-mt-8 ou-mb-4 ou-pt-4 ou-text-xl">{t('prescriptionDetail')}</h2>
                            <Box className="ou-p-3">
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell colSpan={1} align="center">{t('prescriptionDetailId')}</TableCell>
                                                <TableCell colSpan={5} align="center">{t('medicineName')}</TableCell>
                                                <TableCell colSpan={1} align="center">{t('uses')}</TableCell>
                                                <TableCell colSpan={1} align="center">{t('quantity')}</TableCell>
                                                <TableCell colSpan={1} align="center">{t('unitPrice')}</TableCell>
                                                <TableCell colSpan={2} align="center">{t('total')} (VND)</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>

                                            {prescriptionDetail.map((p) => (
                                                <TableRow
                                                    key={p.medicine_unit.id}
                                                    id={p.medicine_unit.id}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                >
                                                    <TableCell component="th" scope="row" align="center" >
                                                        <Typography>
                                                            {p.prescribing.id}
                                                        </Typography>
                                                    </TableCell >

                                                    <TableCell colSpan={5} align="left" >
                                                        <Typography>
                                                            {p.medicine_unit.medicine.name}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography>
                                                            {p.uses}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        {formatNumber(p.quantity)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Typography>
                                                            {formatNumberCurrency(p.medicine_unit.price)}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center" className="!ou-text-[16px]">
                                                        {formatNumberCurrency(p.medicine_unit.price * p.quantity)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                    </Table>

                                </TableContainer>
                                <Box className="ou-p-3" style={{ textAlign: "right" }}>
                                    <Typography className="ou-p-2">{t('serviceFee')}:  {formatNumberCurrency(props.wage, 'VND')} VND</Typography>
                                    <h4 className="p-2">{t('amount')}:   {formatNumberCurrency(calculateAmount(prescriptionDetail, props.wage))}  VND</h4>
                                    {props.bill_status ? ( <h3 className="ou-text-xl ou-mt-4 ou-text-green-700 ou-font-bold ou-flex ou-justify-end ou-items-center">{t('done')} <CheckCircleOutlineIcon /></h3>)
                                        : renderLoadingButton()}

                                </Box>
                            </Box>
                        </Box>
                    </>
                )
        }

    </>)
}
export default BillCard
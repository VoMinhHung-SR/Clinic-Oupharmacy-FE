import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchReceipt } from "../../../../../../pages/PaymentComponents/services"
import Loading from "../../../../Loading"
import { fetchPrescriptionDetailBillCard } from "../../../BillCard/services"
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';


const PrescribingCard = ({prescribing}) => {
    const {t, tReady} = useTranslation(['payment'])
    const [isLoading, setIsLoading] = useState(true)
    const [receiptStatus, setReceiptStatus] = useState(false)
    const [p , setP]  = useState([])
    useEffect(()=> {

        if(!prescribing) return;
      
        const loadData = async () => {
            setIsLoading(true)

            // Load Prescribing Data
            try{
                const {data} = await fetchPrescriptionDetailBillCard(prescribing)
                setP(data);
            }catch(err){
                console.log(err)
            }

            // Load Receipt Data
            try{
                const {status} = await fetchReceipt(prescribing)
                setReceiptStatus(status === 200) // will be true if status === 200 else is false
            }catch(err){
                setReceiptStatus(false);
            }
            setIsLoading(false);
        }

        loadData()
        
    }, [prescribing])

    if(isLoading || !prescribing || tReady) 
        return <Box className="ou-mt-3"><Loading/></Box>

    return(
        <Box>

        <Box component={Paper} elevation={4}>
            <h1 className="ou-text-center ou-mt-5 ou-mb-4 ou-pt-4 ou-text-xl">{t('prescriptionDetail')}</h1>
            <Box className="ou-p-3">
                <TableContainer >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={1} align="center">{t('prescriptionDetailId')}</TableCell>
                                <TableCell colSpan={3} align="center">{t('medicineName')}</TableCell>
                                <TableCell colSpan={1} align="center">{t('uses')}</TableCell>
                                <TableCell colSpan={1} align="center">{t('quantity')}</TableCell>
                                <TableCell colSpan={2} align="center">{t('unitPrice')}</TableCell>
                                <TableCell colSpan={2} align="center">{t('total')} (VND)</TableCell>
                            </TableRow>
                        </TableHead>    
                        <TableBody>
                            {p.map((p) => (
                                <TableRow
                                    key={p.medicine_unit.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" align="center" >
                                        <Typography>
                                            {p?.prescribing?.id}
                                        </Typography>
                                    </TableCell >

                                    <TableCell colSpan={3} align="left" className="ou-truncate" >
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
                                        <Typography>
                                            {p.quantity}
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={2} className="ou-text-sm" align="center">
                                        <Typography>
                                            {p.medicine_unit.price}
                                        </Typography>
                                    </TableCell>
                                    <TableCell colSpan={2} align="center">
                                        <Typography>
                                            {p.medicine_unit.price * p.quantity}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                </TableContainer>
            </Box>
        </Box>

        <Box className="ou-mt-6 ou-text-xl ou-text-right">
            {t('paymentStatus')}: {receiptStatus === true ? 
            <span className="ou-text-xl ou-mt-4 ou-text-green-700 ou-font-bold">
                {t('done')} <CheckCircleOutlineIcon />
            </span>
            : <span className="ou-text-xl ou-mt-4 ou-text-red-700 ou-font-bold">
              {t('unDone')}
            </span>
            }
        </Box>
    </Box>
    )
}
export default PrescribingCard
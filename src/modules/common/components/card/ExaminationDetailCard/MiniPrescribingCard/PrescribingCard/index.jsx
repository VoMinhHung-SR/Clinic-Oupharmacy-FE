import { Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { fetchPrescriptionDetailBillCard } from "../../../BillCard/services"
import SkeletonListLineItem from "../../../../skeletons/listLineItem"
import SkePrescriptionDetailCard from "../../../../skeletons/card/SkePrescriptionDetailCard"


const PrescribingCard = ({prescribing}) => {
    const {t, tReady} = useTranslation(['payment'])
    const [isLoading, setIsLoading] = useState(true)
    const [prescriptionDetail , setPrescriptionDetail]  = useState([])
    const prescribingID = prescribing
    useEffect(()=> {

        if(!prescribingID) return;
        const loadData = async () => {
            setIsLoading(true)
            try{
                const {data} = await fetchPrescriptionDetailBillCard(prescribingID)
                setPrescriptionDetail(data)
            }catch(err){
                console.log(err)
            }
            setIsLoading(false);
        }

        loadData()
        
    }, [prescribingID])

    if(isLoading || !prescribingID || tReady) 
        return <SkePrescriptionDetailCard key={`mini-load-prescribing-${prescribingID}`}/>
    return(
        <Box>

        <Box component={Paper} elevation={4} className="ou-relative ou-mt-5"  >
            {/* Header Area */}
            <Box className="ou-text-center ou-p-5 ou-text-lg ">
                <h3 className="">{t('prescriptionDetail', {id: prescriptionDetail[0]?.prescribing?.id})}</h3>
                <Box className="ou-absolute ou-top-0 ou-right-0 ou-p-3 ou-text-sm ">
                    <Chip
                        label={prescriptionDetail[0]?.prescribing?.bill_status ? t('paid') : t('unpaid')}
                        color={prescriptionDetail[0]?.prescribing?.bill_status ? "success" : "error"}
                        variant="filled" 
                        size="medium"
                    />
                </Box>
            </Box>    
            {/* Table Area */}
            <Box >
                <TableContainer >
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell colSpan={3} align="center">{t('medicineName')}</TableCell>
                                <TableCell colSpan={1} align="center">{t('uses')}</TableCell>
                                <TableCell colSpan={1} align="center">{t('quantity')}</TableCell>
                                <TableCell colSpan={2} align="center">{t('unitPrice')}</TableCell>
                                <TableCell colSpan={2} align="center">{t('total')} (VND)</TableCell>
                            </TableRow>
                        </TableHead>    
                        <TableBody>
                            {prescriptionDetail && prescriptionDetail.map((p, index) => (
                                <TableRow
                                    key={p.medicine_unit.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell colSpan={3} align="left" className="ou-truncate" >
                                        <Typography>
                                            {index + 1}. {p.medicine_unit.medicine.name}
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
    </Box>
    )
}
export default PrescribingCard
import { Box, Button, Paper, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import Loading from "../../../modules/common/components/Loading";
import useExaminationList from "../../../modules/pages/ExaminationListComponents/hooks/useExaminationList"
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CustomModal from "../../../modules/common/components/Modal";
import ExaminationUpdate from "../../../modules/pages/ExaminationListComponents/ExaminationUpdate";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
import useCustomNavigate from "../../../lib/hooks/useCustomNavigate";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ExaminationList = () =>{
    const { isLoading, examinationList, handleDeleteExamination, 
        handleChangePage, page,pagination, handleChangeFlag} = useExaminationList();
    const {navigate} = useCustomNavigate();
 
    const {t,ready} = useTranslation(['examinations','common'])   
    
    if(!ready)
        return <Box sx={{ minHeight: "300px" }}>
        <Helmet>
            <title>Booking list</title>
        </Helmet>
        <Box className='ou-p-5'>
            <Loading></Loading>
        </Box>
    </Box>

    return(
    <>
        <Helmet>
            <title>{t('examinations:appointmentList')} - OUpharmacy</title>
        </Helmet>
        <Box sx={{ minHeight: "300px", margin: 0, padding: 0 }}>
            <TableContainer component={Paper} elevation={6} sx={{ margin: 0, overflowX: "hidden" }}>
                <Table aria-label="simple table" sx={{ tableLayout: "fixed", width: "100%" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ width: "8%", py: 1.5 }}>{t('id')}</TableCell>
                            <TableCell align="center" sx={{ width: "24%", py: 1.5 }}>{t('description')}</TableCell>
                            <TableCell align="center" sx={{ width: "12%", py: 1.5 }}>{t('createdDate')}</TableCell>
                            <TableCell align="center" sx={{ width: "10%", py: 1.5 }}>{t('mailStatus')}</TableCell>
                            <TableCell align="center" sx={{ width: "20%", py: 1.5 }}>{t('patientName')}</TableCell>
                            <TableCell align="center" sx={{ width: "14%", py: 1.5 }}>{t('function')}</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {isLoading && (
                            <TableRow>
                                <TableCell colSpan={6}>
                                    <Box className="ou-text-center">
                                        <SkeletonListLineItem count={4} className="ou-w-full" />
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )}
                          {!isLoading && examinationList.length === 0 && (
                            <TableRow>
                            <TableCell colSpan={6} component="th" scope="row">
                                <Typography> 
                                    <Box className="ou-text-center ou-p-10 ou-text-red-700">
                                        {t('examinations:errExamsNull')}
                                        <br/>
                                        <br/>
                                        <Button color="primary" onClick={() => navigate('/booking')}>
                                            {t('common:goToBooking')}
                                        </Button>
                                    </Box>
                                </Typography>
                            </TableCell>
                            </TableRow>
                        )}
                        {!isLoading && examinationList.length > 0 && examinationList.map(e => (
                            <OwnerExaminationUpdate e={e} key={`own-e-${e.id}`} 
                            onUpdateSuccess={handleChangeFlag}
                            handleDeleteExamination={() => handleDeleteExamination(e.id)}/>
                        ))}
                    </TableBody>
                </Table>
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
            </TableContainer>
        </Box>   
    </>)
} 
export default ExaminationList


export const OwnerExaminationUpdate = ({e, handleDeleteExamination, onUpdateSuccess}) => {
    const {t} = useTranslation(['examinations','common'])  
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal(); 
    return (
        <>
            <TableRow key={e.id} sx={{ '&:last-child td, &:last-child th': { border: 0 }}}>
                <TableCell component="th" scope="row" sx={{ py: 1.5 }}>
                    <Typography variant="body2">{e.id}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Typography variant="body2" noWrap title={e.description}>{e.description}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>
                    <Typography variant="body2">{e.schedule_appointment?.day ? moment(e.schedule_appointment.day).format("DD/MM/YYYY") : moment(e.created_date).format("DD/MM/YYYY")}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>{e.mail_status === true ? <CheckCircleIcon className="!ou-text-green-700" sx={{ fontSize: 22 }} /> : <CancelIcon className="!ou-text-red-700" sx={{ fontSize: 22 }} />}</TableCell>
                <TableCell align="center" sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    <Typography variant="body2" noWrap title={e.patient?.first_name + " " + e.patient?.last_name}>{e.patient?.first_name + " " + e.patient?.last_name}</Typography>
                </TableCell>
                <TableCell align="center" sx={{ py: 1.5 }}>
                    <Box className="!ou-flex ou-justify-center ou-items-center ou-gap-1">
                        {!e.mail_status && (
                            <Tooltip followCursor title={t('common:edit')} className="hover:ou-cursor-pointer">
                                <Button variant="contained" className="!ou-min-w-0 !ou-p-1.5 hover:ou-cursor-pointer" color="success" size="small" onClick={handleOpenModal}>
                                    <EditIcon sx={{ fontSize: 22 }} />
                                </Button>
                            </Tooltip>
                        )}
                        <Tooltip followCursor title={t('common:delete')} className="hover:ou-cursor-pointer">
                            <Button className="!ou-min-w-0 !ou-p-1.5 hover:ou-cursor-pointer" variant="contained" size="small" onClick={() => handleDeleteExamination()} color="error">
                                <DeleteIcon sx={{ fontSize: 22 }} />
                            </Button>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>

            <CustomModal
                className="ou-w-[900px] ou-text-center"
                open={isOpen}
                onClose={handleCloseModal}
                content={<Box>
                        <ExaminationUpdate examination={e} onUpdateSuccess={onUpdateSuccess}
                        handleClose={handleCloseModal}/>
                </Box>}
                actions={[
                <Button key="cancel" onClick={handleCloseModal}>
                    {t('modal:cancel')}
                </Button>
                ]}
            />
        </>
     
    )
}

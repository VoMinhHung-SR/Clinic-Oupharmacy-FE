import { Box, Button, Pagination, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { useNavigate } from "react-router";
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

const ExaminationList = () =>{
    const { isLoading, examinationList, handleDeleteExamination, 
        handleChangePage, page,pagination, handleChangeFlag} = useExaminationList();
    const router = useNavigate();
 
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
            <title>{t('examinations:appointmentList')}</title>
        </Helmet>
        <Box sx={{ minHeight: "300px" }}>
            <TableContainer className="md:ou-min-w-0">
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>{t('id')}</TableCell>
                            <TableCell align="center">{t('description')}</TableCell>
                            <TableCell align="center">{t('createdDate')}</TableCell>
                            <TableCell align="center">{t('mailStatus')}</TableCell>
                            <TableCell align="center">{t('patientName')}</TableCell>
                            <TableCell align="center">{t('function')}</TableCell>
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
                            <TableCell colSpan={12} component="th" scope="row">
                                <Typography> 
                                    <Box className="ou-text-center ou-p-10 ou-text-red-700">
                                        {t('examinations:errExamsNull')}
                                        <br/>
                                        <br/>
                                        <Button color="primary" onClick={() => router('/booking')}>
                                            {t('common:goToBooking')}
                                        </Button>
                                    </Box>
                                </Typography>
                            </TableCell>
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
           <TableRow
        key={e.id}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <TableCell component="th" scope="row" >
            <Typography>
                {e.id}
            </Typography>
        </TableCell>

        <TableCell align="center">
            <Typography className="ou-table-truncate-text-container">
                {e.description}
            </Typography>
        </TableCell>
        <TableCell align="center">
            <Typography>{e.schedule_appointment.day ? <span>{moment(e.schedule_appointment.day).format("DD/MM/YYYY")}</span> 
                      :  <span>{moment(e.created_date).format("DD/MM/YYYY")}</span> }</Typography>
        </TableCell>
        <TableCell align="center">{e.mail_status === true ? t('sent') : t('noSent')}</TableCell>
        <TableCell align="center">
            <Typography>
                {e.patient.first_name +" "+ e.patient.last_name}
            </Typography>
        </TableCell>
        <TableCell align="center">
            <Box  className="!ou-flex ou-justify-center ou-items-center">
                {!e.mail_status  &&  
                <Tooltip followCursor title={t('common:edit')} className="hover:ou-cursor-pointer ">
                {/* <span> */}
                    <Button variant="contained"
                            className="!ou-mr-2 !ou-min-w-[68px]  !ou-p-2  hover:ou-cursor-pointer"
                            color="success"
                            onClick={handleOpenModal}
                            >
                            <EditIcon></EditIcon>
                    </Button>
                {/* </span> */}
            </Tooltip>
            }
                <Tooltip followCursor title={t('common:delete')} className="hover:ou-cursor-pointer">
                    <span>
                    <Button 
                        className="!ou-min-w-[68px]  !ou-p-2 hover:ou-cursor-pointer"
                            variant="contained"
                            onClick={()=> handleDeleteExamination()}
                            color="error" >
                                <DeleteIcon></DeleteIcon>

                        </Button>
                    </span>
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

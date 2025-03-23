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
            <title>Booking list</title>
        </Helmet>
        {isLoading && examinationList.length === 0 ?
            (<Box sx={{ minHeight: "300px" }}>
                <Box className='ou-p-5'>
                    <Loading></Loading>
                </Box>
            </Box>)
            : examinationList.length === 0 ?
                (<Box className="ou-relative ou-items-center  ou-h-full">
                    <Box className='ou-absolute ou-p-5 ou-text-center 
                    ou-flex-col ou-flex ou-justify-center ou-items-center
                    ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center'>
                        <h2 className='ou-text-xl ou-text-red-600'>
                            {t('errExaminationList')}
                        </h2>
                        <Typography className='text-center'>
                            <h3>{t('common:goToBooking')}</h3>
                            <Button onClick={() => { router('/booking') }}>{t('common:here')}!</Button>
                        </Typography>
                    </Box>
                </Box>)
                : (
                    <Box sx={{ minHeight: "300px" }}>
                        <TableContainer >
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
                                    {examinationList.map(examination => (
                                        <OwnerExaminationUpdate e={examination} key={`own-e-${examination.id}`} 
                                        onUpdateSuccess={handleChangeFlag}
                                        handleDeleteExamination={() => handleDeleteExamination(examination.id)}/>
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
                            />
                        </Stack>
                        </Box>
                    )}
                    </Box>
                 
                )
        }
        
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

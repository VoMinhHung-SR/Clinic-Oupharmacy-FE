import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Typography, Button, Tooltip } from "@mui/material"
import { Helmet } from "react-helmet"
import { useTranslation } from "react-i18next"
import Loading from "../../../modules/common/components/Loading"
import FormAddPatient from "../../../modules/pages/BookingComponents/FormAddPatient"
import moment from "moment"
import usePatient from "../../../lib/hooks/usePatient"
import EditIcon from '@mui/icons-material/Edit';
import CustomModal from "../../../modules/common/components/Modal"
import useCustomModal from "../../../lib/hooks/useCustomModal"
import { useState } from "react"
import clsx from "clsx"
import BackdropLoading from "../../../modules/common/components/BackdropLoading"
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';

const PatientManagement = () => {
    
    const {patientList, isLoading} = usePatient()
    const {t, tReady} = useTranslation(['booking', 'common'])
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal(); 
    const [patient, setPatient] = useState(null)
    const [isAddNewPatient, setIsAddNewPatient] = useState(true)
    const [step, setStep] = useState(1)
    if (tReady)
        return <Box sx={{ minHeight: "300px" }}>
             <Helmet>
                <title>Patient Management</title>
            </Helmet>
            <Box className='ou-p-5'>
                <Loading></Loading>
            </Box>
    </Box>;
    const openModal = (patient) => {
        handleOpenModal()
        setPatient(patient)
    }
    
    const renderFirstState = () => {
        if (isLoading)
            return <BackdropLoading/>
        if(patientList.length !== 0)
            return (
                <div className="ou-flex ou-justify-center ou-space-x-10 ">
                        <button onClick={()=>{setIsAddNewPatient(true)}} 
                            className={
                                clsx("ou-btn-booking ou-border-opacity-60",{
                                    "ou-btn-booking__focus": isAddNewPatient === true,
                                })
                            }>  
                            <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                                <AddIcon className="!ou-text-[120px] ou-mb-3 "/>
                                <span className="ou-pt-5 ou-font-bold">{t("booking:addingNewPatient")}</span>
                            </div>
                        </button>
                        
                        <div>
                            <button onClick={()=>{setIsAddNewPatient(false)}} className={
                                clsx("ou-btn-booking ou-border-opacity-60",{
                                    "ou-btn-booking__focus": isAddNewPatient === false,
                                })
                            }
                            >  
                                <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                                    <PersonIcon  className="!ou-text-[120px] ou-mb-3 "/>
                                    <span className="ou-pt-5 ou-font-bold">{t("booking:existingPatient")}</span>
                                </div>
                            </button>
                        </div>
                </div>
            )
        else
            return (
                <div className="ou-flex ou-justify-center">
                    <button onClick={()=>{setIsAddNewPatient(true)}}  className={
                                    clsx("ou-btn-booking ou-border-opacity-60",{
                                        "ou-btn-booking__focus": isAddNewPatient === true,
                                    })
                                }>  
                        <div className="ou-flex ou-flex-col ou-justify-center ou-items-center">
                            <AddIcon className="!ou-text-[120px] ou-mb-3 "/>
                            <span className="ou-pt-5 ou-font-bold">{t("booking:addingNewPatient")}</span>
                        </div>
                    </button>
            </div>
            )
    }

    const renderSecondState = () => {
        if(isAddNewPatient)
            return <FormAddPatient/>
        return (
            <Box sx={{ minHeight: "300px" }}>
                <TableContainer component={Paper} elevation={6}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{t('id')}</TableCell>
                                <TableCell align="center">{t('fullName')}</TableCell>
                                <TableCell align="center">{t('phoneNumber')}</TableCell>
                                <TableCell align="center">{t('email')}</TableCell>
                                <TableCell align="center">{t('gender')}</TableCell>
                                <TableCell align="center">{t('dateOfBirth')}</TableCell>
                                <TableCell align="center">{t('address')}</TableCell>
                                <TableCell align="center">{t('common:function')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientList.map(patient => (
                                <TableRow>
                                    <TableCell>{patient.id}</TableCell>
                                    <TableCell align="center">{patient.first_name + ' ' + patient.last_name}</TableCell>
                                    <TableCell align="center">{patient.phone_number}</TableCell>
                                    <TableCell align="center">{patient.email}</TableCell>
                                    <TableCell align="center">{patient.gender === 0 ? t('booking:man') : patient.gender === 1 
                                    ? t('booking:woman') : t('common:secret') }</TableCell>
                                    <TableCell align="center">{moment(patient.date_of_birth).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell sx={{
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>
                                        {patient.address?.split(' ').slice(0, 2).join(' ')}
                                        {patient.address?.split(' ').length > 2 ? '...' : ''}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip followCursor title={t('common:edit')} className="hover:ou-cursor-pointer ">
                                            <Button variant="contained"
                                                    className="!ou-mr-2 !ou-min-w-[68px]  !ou-p-2  hover:ou-cursor-pointer"
                                                    color="success"
                                                    onClick={() => openModal(patient)}
                                                    >
                                                    <EditIcon/> 
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    const renderButtonStep = () => {
        if(step === 1)
            return <button className="ou-btn-base ou-min-w-[120px] ou-mr-3" onClick={()=>{setStep(2)}}>{t('booking:next')}</button>
        if(step === 2)
            return <button className="ou-btn-base ou-min-w-[120px] ou-mr-3" onClick={()=>{setStep(1)}}>{t('booking:previous')}</button>
    }
    return (
        <>
        
            <Helmet>
                <title>{t('common:patientManagement')} - OUpharmacy</title>
            </Helmet>
            <Box className="ou-relative ou-py-8 ou-flex">
                <Box className="ou-relative ou-w-full
                            ou-m-auto ou-flex ou-items-center ou-justify-center">        
                    {/* Main content */}
                    <div className="ou-text-center ou-py-20 ou-w-[100%]">           
                        {step === 1 && renderFirstState()}
                        {step === 2 && renderSecondState()}
                    </div>
                    {/* Button area */}
                    <div className="ou-bottom-0 ou-absolute ou-right-0 ou-m-3">
                        {renderButtonStep()}
                    </div>
                </Box>
            </Box>
        {patient && (
            <CustomModal
                className="ou-text-center"
                open={isOpen}
                onClose={handleCloseModal}
                content={<Box>
                    <FormAddPatient patientData={patient} onCallbackSuccess={() => {
                        setStep(1)
                        handleCloseModal()
                    }}/>
                </Box>}
                actions={[
                <Button key="cancel" onClick={handleCloseModal}>
                    {t('modal:cancel')}
                </Button>
                ]}
            />
        )}
        </>
    )
}
export default PatientManagement
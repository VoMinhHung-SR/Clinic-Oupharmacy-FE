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
            return (
                <>
                    <Box className="ou-p-8"><FormAddPatient/></Box>
                    <div className="ou-mb-4 ou-flex ou-justify-end">
                        {renderButtonStep()}
                    </div>
                </>
            )
        return (
            <Box sx={{ minHeight: "300px", position: "relative", display: "block", margin: 0, padding: 0 }}>
                <TableContainer component={Paper} elevation={6} sx={{ margin: 0, overflowX: "hidden" }}>
                    <Table aria-label="simple table" sx={{ tableLayout: "fixed", width: "100%" }}>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ width: "16%", py: 1.5 }}>{t('fullName')}</TableCell>
                                <TableCell align="center" sx={{ width: "12%", py: 1.5 }}>{t('phoneNumber')}</TableCell>
                                <TableCell align="center" sx={{ width: "20%", py: 1.5 }}>{t('email')}</TableCell>
                                <TableCell align="center" sx={{ width: "8%", py: 1.5 }}>{t('gender')}</TableCell>
                                <TableCell align="center" sx={{ width: "11%", py: 1.5 }}>{t('dateOfBirth')}</TableCell>
                                <TableCell align="center" sx={{ width: "20%", py: 1.5 }}>{t('address')}</TableCell>
                                <TableCell align="center" sx={{ width: "10%", py: 1.5 }}>{t('common:function')}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {patientList.map(patient => (
                                <TableRow key={patient.id}>
                                    <TableCell align="center" sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{patient.first_name + ' ' + patient.last_name}</TableCell>
                                    <TableCell align="center" sx={{ py: 1.5 }}>{patient.phone_number}</TableCell>
                                    <TableCell align="center" sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{patient.email}</TableCell>
                                    <TableCell align="center" sx={{ py: 1.5 }}>{patient.gender === 0 ? t('booking:man') : patient.gender === 1 ? t('booking:woman') : t('common:secret')}</TableCell>
                                    <TableCell align="center" sx={{ py: 1.5 }}>{moment(patient.date_of_birth).format('DD/MM/YYYY')}</TableCell>
                                    <TableCell align="center" sx={{ py: 1.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                        {patient.address?.split(' ').slice(0, 2).join(' ')}
                                        {patient.address?.split(' ').length > 2 ? '...' : ''}
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 1.5 }}>
                                        <Tooltip followCursor title={t('common:edit')} className="hover:ou-cursor-pointer">
                                            <Button variant="contained" size="small" className="!ou-min-w-0 !ou-p-1.5 hover:ou-cursor-pointer" color="success" onClick={() => openModal(patient)}>
                                                <EditIcon sx={{ fontSize: 22 }} />
                                            </Button>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <div className="ou-mt-4 ou-flex ou-justify-end">
                    {renderButtonStep()}
                </div>
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
            <Box className={clsx("ou-relative ou-flex", { "ou-py-8": step === 1 })}>
                <Box className={clsx("ou-relative ou-w-full ou-m-auto ou-flex ou-justify-center", {
                    "ou-items-center": step === 1,
                    "ou-items-start": step === 2,
                })}>        
                    {/* Main content */}
                    <div className={clsx("ou-w-[100%]", {
                        "ou-text-center ou-py-20": step === 1,
                        "ou-text-left ou-m-0 ou-p-0": step === 2,
                    })}>           
                        {step === 1 && renderFirstState()}
                        {step === 2 && renderSecondState()}
                    </div>
                    {/* Button area - only for step 1 (step 2 button is inside renderSecondState below table) */}
                    {step === 1 && (
                        <div className="ou-bottom-0 ou-absolute ou-right-0 ou-m-3">
                            {renderButtonStep()}
                        </div>
                    )}
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
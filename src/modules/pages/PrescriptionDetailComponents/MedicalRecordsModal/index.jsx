import { useTranslation } from "react-i18next";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import CustomModal from "../../../common/components/Modal";
import { Box, Button, Paper, Tooltip, Typography } from "@mui/material";
import useMedicalRecordsModal from "../hooks/useMedicalRecordsModal";
import Loading from "../../../common/components/Loading";
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton";
import moment from "moment";
import DiagnosisForm from "../../DiagnosisComponents/DiagnosisForm";
import MiniDiagnosisCard from "../../../common/components/card/ExaminationDetailCard/MiniDiagnosisCard";
import MiniPrescribingCard from "../../../common/components/card/ExaminationDetailCard/MiniPrescribingCard";

const MedicalRecordsModal = ({patientID}) => {
    const { t } = useTranslation(["prescription-detail", "common", "modal"]);
    const {medicalRecords, isLoading} = useMedicalRecordsModal(patientID)
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    const renderMedicalRecords = () => {
        if(!medicalRecords.length)
            return <Box>{t('unDiagnosed')}</Box>
        else 
            return medicalRecords.map((m,index) => 
                <Box className="ou-p-5" component={Paper} elevation={4}> 
                    <CustomCollapseListItemButton 
                        isOpen = {index === 0}
                        title={index === 0 ? t('lastRecord') + ': ' + moment(medicalRecords[0].created_date).format('DD-MM-YYYY') 
                            : index === medicalRecords.length - 1 ?   t('firstRecord') + ': ' + moment(medicalRecords[medicalRecords.length - 1].created_date).format('DD-MM-YYYY')
                            : t('nextRecord', {index: index + 1}) + ': ' + moment(m.created_date).format('DD-MM-YYYY')}
                        content={
                            <Box>
                                <Box className="ou-p-2">
                                    <MiniDiagnosisCard diagnosis={m} isLoading={isLoading}/>
                                </Box>
                                <Box className="ou-p-2">
                                    <MiniPrescribingCard prescribing={m.prescribing_info} isLoading={isLoading}/>
                                </Box>
                            </Box>
                            /* <DiagnosisForm id={medicalRecords[0].id} sign={medicalRecords[0].sign} diagnosed={medicalRecords[0].diagnosed} seen/> */
                        }
                    />
                </Box>
            )
    }
    return (
        <>
         <Typography>

               <Button
                    variant="contained"
                    className="ou-bg-blue-700 !ou-min-w-[68px]  !ou-min-h-[40px] !ou-px-8  ou-w-[50%] !ou-py-2 !ou-mx-2"
                    size="small"
                    onClick={()=>handleOpenModal()}
                >
                    {t('medicalRecords')}
                </Button>
        
        </Typography>

        <CustomModal
            title={t('medicalRecords')}
            className="ou-w-[900px] ou-text-center"
            open={isOpen}
            onClose={handleCloseModal}
            content={<Box>
                {isLoading&& <Box><Loading/></Box>}
                {renderMedicalRecords()}
             
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

export default MedicalRecordsModal
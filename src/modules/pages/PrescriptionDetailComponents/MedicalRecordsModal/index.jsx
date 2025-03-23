import { useTranslation } from "react-i18next";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import CustomModal from "../../../common/components/Modal";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import useMedicalRecordsModal from "../hooks/useMedicalRecordsModal";
import Loading from "../../../common/components/Loading";
import CustomCollapseListItemButton from "../../../common/components/collapse/ListItemButton";
import moment from "moment";
import DiagnosisForm from "../../DiagnosisComponents/DiagnosisForm";

const MedicalRecordsModal = ({patientID}) => {
    const { t } = useTranslation(["prescription-detail", "common", "modal"]);
    const {medicalRecords, isLoading} = useMedicalRecordsModal(patientID)
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    const renderMedicalRecords = () => {
        if(!medicalRecords.length)
            return <Box>{t('unDiagnosed')}</Box>
        else 
            if(medicalRecords.length === 1)
               return <CustomCollapseListItemButton 
                isOpen
                title={t('firstRecord') + ': ' + moment(medicalRecords[0].created_date).format('DD-MM-YYYY')}
                content={<DiagnosisForm id={medicalRecords[0].id} sign={medicalRecords[0].sign} diagnosed={medicalRecords[0].diagnosed} seen/>}
            />
            else    
            return medicalRecords.map((m,index) => 
                <Box className="ou-my-2">
                    <CustomCollapseListItemButton  title={`${t('diagnosedSheet')} ${medicalRecords.length - index } ${t('at')}: ` + moment(m.created_date).format('DD-MM-YYYY')}
                        content={<DiagnosisForm id={m.id} sign={m.sign} diagnosed={m.diagnosed} seen/>}
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
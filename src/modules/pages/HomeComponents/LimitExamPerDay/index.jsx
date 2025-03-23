import { Box, Button, Tooltip } from "@mui/material"
import { CURRENT_DATE, MAX_EXAM_PER_DAY, ROLE_USER } from "../../../../lib/constants"
import moment from "moment"
import useLimitExamPerDay from "../hooks/useLimitExamPerDay"
import CustomModal from "../../../common/components/Modal"
import { useTranslation } from "react-i18next"
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useContext } from "react"
import { userContext } from "../../../../App"
import UserContext from "../../../../lib/context/UserContext"

const LimitExamPerDay = () => {
    const {t} = useTranslation(['modal', "common"])
    const {totalExams, handleOpenModal, handleCloseModal, isOpen} = useLimitExamPerDay(CURRENT_DATE) 
    const {user} = useContext(UserContext);


    if(!user || user.role === ROLE_USER){
        return;
    }

    return (
        <>
            <Tooltip  title={t('common:totalExamsList')}>
                <span
                    className="ou-right-[30px] ou-bottom-[100px] !ou-fixed "
                    onClick={handleOpenModal}
                >
                        <AssignmentTurnedInIcon className="ou-text-white hover:ou-cursor-pointer !ou-w-[60px] !ou-h-[60px] ou-p-2  !ou-bg-green-700 !ou-rounded-full !ou-z-999"/>
                </span>
            </Tooltip>
            
                

            <CustomModal
                open={isOpen}
                title={t('common:totalCheckUpsToday')+ ": " +`${moment(CURRENT_DATE).format('DD-MM-yyyy')}`}
                onClose={handleCloseModal}
                content={<Box>
                <div>
                    <Box className="ou-text-center">
                        {t("common:currentSystem")}: {totalExams}/{MAX_EXAM_PER_DAY}
                    </Box>
                </div> 
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

export default LimitExamPerDay
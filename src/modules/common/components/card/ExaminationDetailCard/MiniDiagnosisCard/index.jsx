import { Box, Fade } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../Loading"
import DiagnosisCard from "../../DiagnosisCard"
import useListItemButton from "../hooks/useListItemButton"
import ListItemButton from "../ListItemButton"

const MiniDiagnosisCard = ({diagnosis,isLoading}) => {
    const {t, ready} = useTranslation(['diagnosis'])
    const { isOpen , handleIsOpen } = useListItemButton()
    const {id, sign, diagnosed} = diagnosis

    if(!ready && isLoading)
        return <Box sx={{ height: "300px" }}>
        <Box className='ou-p-5'>
            <Loading/>
        </Box>
    </Box>
    
    if(!id)
        return   <Box className="ou-text-red-700">{t("errNullDiagnosis")}</Box>

    return (
        <>
            <ListItemButton callback={()=>{handleIsOpen();}} arrayContent={diagnosis ? [diagnosis] : []}  title={t('diagnosisExist')}/>
            { isOpen ? <DiagnosisCard id={id} diagnosed={diagnosed} sign={sign}/>: <></>}
        </>
    )
}
export default MiniDiagnosisCard
import { Box, Fade } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../Loading"
import DiagnosisCard from "../../DiagnosisCard"
import useListItemButton from "../hooks/useListItemButton"
import ListItemButton from "../ListItemButton"
import SkeletonListLineItem from "../../../skeletons/listLineItem"
import SkeDiagnosisCard from "../../../skeletons/card/SkeDiagnosisCard"

const MiniDiagnosisCard = ({diagnosis,isLoading}) => {
    const {t, ready} = useTranslation(['diagnosis'])
    const { isOpen , handleIsOpen } = useListItemButton()
    const {id, sign, diagnosed} = diagnosis

    if(!ready && !isLoading)
        return <SkeDiagnosisCard key={`mini-load-diagnosis-${id}`}/>
    
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
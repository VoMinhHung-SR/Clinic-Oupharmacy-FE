import { Box, Fade, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Loading from "../../../Loading"
import useListItemButton from "../hooks/useListItemButton"
import ListItemButton from "../ListItemButton"
import PrescribingCard from "./PrescribingCard"

const MiniPrescribingCard = ({prescribing, isLoading, receipt}) => {
    const {t, tReady} = useTranslation("prescription-detail")
    const { selectedId,handleSelectId, isOpen, loading } = useListItemButton()
   
    if(!tReady && isLoading)
        return <Box sx={{ height: "300px" }}>
        <Box className='ou-p-5'>
            <Loading/>
        </Box>
    </Box>
    else{
        if(prescribing.length === 0)
            return   <Box className="ou-text-red-700">{t("errNullPrescribing")}</Box>
   
        return (
            <>
                <ListItemButton title={t('prescribingExist')} 
                arrayContent={prescribing ? prescribing : []} 
                callback={(id) => {
                    handleSelectId(id)
                }}
                isLoading={isLoading}
            />
             {(isOpen && selectedId) ? <>

                 <PrescribingCard prescribing={selectedId}/>
                
                </> : <></>}
            </>
            
        )
    }
    
}

export default MiniPrescribingCard
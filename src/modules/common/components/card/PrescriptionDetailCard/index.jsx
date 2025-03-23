import { yupResolver } from "@hookform/resolvers/yup"
import { Autocomplete, Box, Button, Container, createFilterOptions, FormControl, Grid, Paper, TextField, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import usePrescriptionDetailCard from "./hooks/usePrescriptionDetailCard";
import BackdropLoading from "../../BackdropLoading";
import { useTranslation } from "react-i18next";
import Loading from "../../Loading";
import { useSelector } from "react-redux";
import MedicinesHome from "../../../../pages/ProductComponents/MedicinesHome";
import CustomModal from "../../Modal";
import useCustomModal from "../../../../../lib/hooks/useCustomModal";
import MedicineLineItemCard from "../MedicineLineItemCard";
import { useContext } from "react";
import PrescribingContext from "../../../../../lib/context/PrescribingContext";

const PrescriptionDetailCard = ({examID, recipientID}) => {
    const {addMedicine} = useContext(PrescribingContext)
    const {
        // medicinesSubmit, openBackdrop, handleAddPrescriptionDetail,
        // medicineUnits, setMedicine, 
        // onSubmit, handleDeleteItem,
        prescriptionDetailSchema} = usePrescriptionDetailCard()

    const {t, ready} = useTranslation(['prescription-detail', 'yup-validate', 'modal'])
    
    const { allConfig } = useSelector((state) => state.config);


    const methods = useForm({
        mode:"onSubmit",
        resolver: yupResolver(prescriptionDetailSchema),
        default: {
            uses: "",
            quantity:""
        }
    })
    //TODO: add skeletons here
    if(!ready)
        return <Box sx={{ height: "300px" }}>
        <Box className='ou-p-5'>
            <Loading/>
        </Box>
    </Box>
    if(!allConfig.categories)
        return  <Container><div>Hien tai khong co danh muc phu hop</div></Container>

    
    return (
        <>
            <Grid container>   
                <Grid item xs={12}>
                    <MedicinesHome 
                    onAddMedicineLineItem={addMedicine} 
                    actionButton={
                        <Button fullWidth className="!ou-p-3 !ou-bg-blue-600 !ou-text-white"> Prescribing 
                        </Button>
                    }
                />
                </Grid>             
            </Grid>
        </>
    )
}
export default PrescriptionDetailCard
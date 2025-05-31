
import { useSelector } from "react-redux";
import { Box, Container, Grid, Paper } from "@mui/material";
import ProductHomeLeft from "../LeftSide";
import ProductHomeRight from "../RightSide";
import { useTranslation } from "react-i18next";
import MedicineFilter from "../../../common/components/FIlterBar/MedicineFilter";

const MedicinesHome = ({actionButton, onAddMedicineLineItem}) => {
   
    const { t, tReady } = useTranslation(['product'])
    const { allConfig } = useSelector((state) => state.config);

    if(!allConfig.categories)
        return  <Container><div>{t('product:errNullCate')}</div></Container>

    return (
        <Box component={Paper} elevation={5} className="ou-px-4 ou-py-6">
            <Grid container>
                {/* <Box className="ou-w-full ou-flex ou-items-center ou-justify-end">
                    <MedicineFilter categories={allConfig.categories} />    
                </Box> */}

                <Grid item xs={12}>
                    <Box className="ou-w-full"> 
                       <ProductHomeRight actionButton={actionButton} categories={allConfig.categories} 
                       onAddMedicineLineItem={onAddMedicineLineItem}/>
                    </Box>
                </Grid>
        
            </Grid>
      
        </Box>
            
        )
}

export default MedicinesHome
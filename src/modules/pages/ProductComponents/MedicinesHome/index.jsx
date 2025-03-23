
import { useSelector } from "react-redux";
import { Box, Container, Grid, Paper } from "@mui/material";
import ProductHomeLeft from "../LeftSide";
import ProductHomeRight from "../RightSide";
import { useTranslation } from "react-i18next";

const MedicinesHome = ({actionButton, onAddMedicineLineItem}) => {
   
    const { t, tReady } = useTranslation(['product'])
    const { allConfig } = useSelector((state) => state.config);

    if(!allConfig.categories)
        return  <Container><div>{t('errNullCate')}</div></Container>

    return (
        <Box component={Paper} elevation={5} className="ou-px-4 ou-py-6">
            <Grid container>
                {/* Product Left Bar is for categories */}
                {/* <Grid item xs={3}>
                    <h2 className="ou-text-center ou-text-xl">{t('categories')}</h2>
                    <Box>
                        <ProductHomeLeft cates={allConfig.categories}/>
                    </Box>
                </Grid> */}


                {/* Product Right Bar is for products */}
                <Grid item xs={12}>
                    <Box> 
                       <ProductHomeRight actionButton={actionButton} onAddMedicineLineItem={onAddMedicineLineItem}/>
                    </Box>
                </Grid>
        
            </Grid>
      
        </Box>
            
        )
}

export default MedicinesHome
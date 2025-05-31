import { Box, Grid, Pagination, Paper, Stack, Button, TextField } from "@mui/material"
import useMedicine from "../../../../lib/hooks/useMedicine";
import Loading from "../../../common/components/Loading";
import { formatNumberCurrency } from "../../../../lib/utils/helper";
import { useLocation } from "react-router";
import UserContext from "../../../../lib/context/UserContext";
import { useContext } from "react";
import { ROLE_DOCTOR } from "../../../../lib/constants";
import { useTranslation } from "react-i18next";
import PrescribingMedicine from "./prescribingMedicine";
import usePrescriptionDetailCard from "../../../common/components/card/PrescriptionDetailCard/hooks/usePrescriptionDetailCard";
import MedicineFilter from "../../../common/components/FIlterBar/MedicineFilter";
import SkeletonListLineItem from "../../../common/components/skeletons/listLineItem";

const ProductHomeRight = ({actionButton, onAddMedicineLineItem, categories, callback}) => {
    const { medicines, page, handleChangePage, pagination, medicineLoading, paramsFilter, handleOnSubmitFilter } = useMedicine();
    const {user} = useContext(UserContext);
    const {prescriptionDetailSchema} = usePrescriptionDetailCard();
    
    const {t, ready} = useTranslation(['prescription-detail', 'yup-validate', 'modal', 'medicine'])

    const router = useLocation()

    const handleAddToPrescription = (medicine, data) => {
        onAddMedicineLineItem(medicine, data)
    };

    if (!ready && medicineLoading)
        return (
          <Box sx={{ height: "300px" }}>
            <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[30vh]">
              <SkeletonListLineItem count={5} className="ou-w-full"/>
            </Box>
          </Box>
        )

    const renderScreenMedicine = () => {
        if (router.pathname !== '/products')
            if (user && user.role === ROLE_DOCTOR)
                return (
                    <div>
                        <Box className="ou-w-full ou-flex ou-items-center ou-justify-end ou-mb-3">
                            <MedicineFilter kw={paramsFilter.kw} cateFilter={paramsFilter.cate}
                                onSubmit={handleOnSubmitFilter}
                                categories={categories}
                            /> 
                        </Box>

                         <div className="ou-flex">
                            <p className="ou-w-[50%] ou-text-center">{t('prescription-detail:medicineName')}</p>
                            <p className="ou-w-[20%] ou-text-center">{t('prescription-detail:uses')}</p>
                            <p className="ou-w-[10%] ou-text-center">{t('prescription-detail:quantity')}</p>
                        </div>

                        {medicineLoading && 
                            <Box className="ou-text-center ou-mt-3">
                                <SkeletonListLineItem count={4} className="ou-w-full" />
                            </Box>
                        }

                        {!medicineLoading && medicines.length > 0 && medicines.map(medicine => (
                            <PrescribingMedicine key={medicine.id} 
                            medicine={medicine} schema={prescriptionDetailSchema}
                            onAddToPrescription={handleAddToPrescription} />
                          ))}

                        {!medicineLoading && medicines.length === 0 &&  
                              <Typography> 
                                  <Box className="ou-text-center ou-p-12 ou-text-red-700">
                                      {t('medicine:errMedicinesNull')}
                                  </Box>
                              </Typography>
                        }
                    </div>
                  );
            else 
                return 
        return  (
            <Grid container>
                {medicines && medicines.map(product => (
                    <Grid item xs={4}  className="ou-flex">
                        <div key={product.id} className="ou-w-[100%] ou-px-2  hover:ou-border-blue-600 
                            hover:ou-border-[2px] ou-rounded-lg ou-m-2 ou-flex ou-flex-col">
                            <img 
                                className="ou-object-contain"
                                width={180} height={180} 
                                src={product.image_path} 
                                alt={product.medicine.name}/>
                            <p className="ou-px-2 ou-my-2 ou-list-item-2-text-container">{product.medicine.name}</p>
                            
                            <div className="ou-mt-auto ou-my-2">
                                <p className="ou-px-2 ou-mt-2 ou-mb-4 ou-font-bold">{formatNumberCurrency(product.price)}vnd / {product.packaging ?  product.packaging : "default"}</p>
                                
                                {actionButton && actionButton}
                            </div>
                        </div>
                    </Grid>
            ))}
        </Grid>    
        )
    }
    return (
        <>
            {renderScreenMedicine()}

            {!medicineLoading && pagination.sizeNumber >= 2 && (
                <Box sx={{ pt: 5, pb: 2 }}>
                    <Stack>
                        <Pagination
                        count={pagination.sizeNumber}
                        variant="outlined"
                        sx={{ margin: "0 auto" }}
                        page={page}
                        onChange={handleChangePage}
                        />
                    </Stack>
                </Box>
            )}
            
        </>
       
        
    
    )
}
export default ProductHomeRight
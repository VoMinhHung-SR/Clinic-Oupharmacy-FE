import { yupResolver } from "@hookform/resolvers/yup"
import { Box, Button, TextField, Tooltip, Typography } from "@mui/material"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import AddIcon from '@mui/icons-material/Add';
import React from "react";

const MedicineLineItem = ({medicine, onAddToPrescription, schema, availableStock}) => {
    const {t, ready} = useTranslation(['prescription-detail', 'yup-validate', 'modal'])
   
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = (data) => {
    if (parseInt(data.quantity) > parseInt(medicine.in_stock))
        return setError('quantity', {
            type: 'custom',
            message: t('yup-validate:yupQuantityOverStock'),
        });
        
    else
        reset();
        onAddToPrescription(medicine, data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}> 
            <Box item xs={4} style={{"display":"flex"}}>
                <div key={medicine.id} className="ou-w-[100%] ou-px-2  hover:ou-border-blue-600 
                hover:ou-border-[2px] ou-rounded-lg ou-m-2 ou-flex  ou-items-center">
                    <div className="ou-w-[50%]">
                        <div className="ou-flex ou-items-center ">
                            <img 
                                className="ou-object-contain"
                                width={72} height={72} 
                                src={medicine.image_path} 
                                alt={medicine.medicine.name}/>
                            <div className="ou-flex ou-px-2 ou-flex-col ou-justify-center">
                                <p className="ou-list-item-2-text-container ">{medicine.medicine.name}</p>

                                <p className="ou-text-xs">(SL: {availableStock})</p>
                            </div>
                        </div>
                        
                            <Box>
                            <p className="ou-pl-4 ou-text-red-600 ou-text-sm">{errors.uses ? errors.uses.message : ""}</p>
                            <p className="ou-pl-4 ou-text-red-600 ou-text-sm">{errors.quantity ? errors.quantity.message : ""}</p>
                            </Box>
                        

                    </div>
                    <div className="ou-w-[20%]">
                        <TextField
                            fullWidth
                            autoComplete="given-name"
                            variant="outlined"
                            id={`medicine-uses-${medicine.id}`}
                            name="uses"
                            type="text"
                            label={t('prescription-detail:uses')}
                            inputProps={{ "aria-label": t("prescription-detail:uses") }}
                            {...register('uses')}
                        />
                    </div>

                    <div className="ou-ml-2 ou-w-[10%]">
                        <TextField
                            fullWidth
                            id={`medicine-quantity-${medicine.id}`}
                            type="number"
                            name="quantity"
                            label={t('prescription-detail:quantity')}
                            InputLabelProps={{ shrink: true }}
                            inputProps={{ "aria-label": t("prescription-detail:quantity") }}
                            {...register('quantity')}
                        />
                    </div>

                        <Tooltip title={t('prescription-detail:addMedicine')} followCursor>
                            <div className="ou-ml-auto">
                                <Button
                                    variant="contained"
                                    color="success"
                                    type="submit"
                                    aria-label={t('prescription-detail:addMedicine')}
                                >
                                    <AddIcon />
                                </Button>
                            </div>
                        </Tooltip>         
                    
                </div>
                        
            </Box>
        </form>
    )
}
export default React.memo(MedicineLineItem)
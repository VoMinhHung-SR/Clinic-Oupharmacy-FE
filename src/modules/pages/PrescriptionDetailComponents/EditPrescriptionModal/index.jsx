import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import { Button, Grid, Box, Paper, Typography, Tooltip, TextField, FormControl } from "@mui/material";
import CustomModal from "../../../common/components/Modal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { TOAST_SUCCESS } from "../../../../lib/constants";
import createToastMessage from "../../../../lib/utils/createToastMessage";
import BackdropLoading from "../../../common/components/BackdropLoading";
import SchemaModels from "../../../../lib/schema";

const EditPrescriptionModal = ({medicinesSubmitData, handleOnEdit}) => {
    
    const [medicinesSubmitDataDraft, setMedicinesSubmitDataDraft] = useState(medicinesSubmitData);
    const [loading, setLoading] = useState(false)
    const { medicineSubmitUpdateSchema } = SchemaModels()
    const { t } = useTranslation(["prescription-detail", "common", "modal" , 'yup-validate']);
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();

    const [deletedArray, setDeletedArray] = useState([])

    const handleUnSaveChange = () => {
        reset()
        setDeletedArray([])
        setMedicinesSubmitDataDraft(medicinesSubmitData)
        handleCloseModal()
    }
    // Update local state when prop changes
    useEffect(() => {
      setMedicinesSubmitDataDraft(prevData => medicinesSubmitData);
    }, [medicinesSubmitData, deletedArray]);

    const { register, handleSubmit, formState: { errors }, 
    reset, unregister, setError, getValues, setValue } = useForm({
        resolver: yupResolver(medicineSubmitUpdateSchema), mode:"onChange"
    });

    const handleUnregisterLastIndex = (index) => {

        const value = getValues(`medicineSubmit[${index}]`)
        const isNullable = value.quantity === '' || value.uses === ''

        if(isNullable){
          setValue(`medicineSubmit[${index}].quantity`, -1)
          setValue(`medicineSubmit[${index}].uses`, -1)
        }

        unregister(`medicineSubmit[${index}].quantity`)
        unregister(`medicineSubmit[${index}].uses`)
        unregister(`medicineSubmit[${index}].medicineName`)
      
    }
  
    const handleOnSubmit = (data, callBackError) =>{
      let err = false
      try{
        if(data){
          const medicineArray = data.medicineSubmit
          if (!medicineArray)
            return;
          medicineArray.forEach((medicine, index) => {
            const { quantity } = medicine;
            const { inStock } = medicinesSubmitData[index];

            if (parseInt(quantity) > inStock) {
              err = true
              setError(`medicineSubmit[${index}].quantity`, {
                type: 'custom',
                message: t('yup-validate:yupQuantityOverRaw')
              });
            }
          });
        }
      }catch(err){
          console.error(err)
      }finally{
        if (!err){
          handleOnEdit(data.medicineSubmit, deletedArray)
          handleCloseModal()
          reset()
          setDeletedArray([])
          createToastMessage({message:t('common:updateSuccess'), type:TOAST_SUCCESS})
          setLoading(false)
        }
      }
    }
    
    const swapValue = (curIndex, nextIndex) => {
      try{
        setValue(`medicineSubmit[${curIndex}].quantity`, getValues(`medicineSubmit[${nextIndex}].quantity`))
        setValue(`medicineSubmit[${curIndex}].uses`, getValues(`medicineSubmit[${nextIndex}].uses`))
        setValue(`medicineSubmit[${curIndex}].medicineName`, getValues(`medicineSubmit[${nextIndex}].medicineName`))
      } catch (err){
        console.log(err)
      } 
    }
  
    const handleDeleteLineItem = (itemID) => {
      const removedIndex = medicinesSubmitDataDraft.findIndex(medicine => medicine.id === itemID) - deletedArray.length;
      try {
        for (let i = removedIndex; i <= medicinesSubmitData.length - deletedArray.length - 1; i++) {
          if(i === medicinesSubmitData.length - deletedArray.length - 1)
            handleUnregisterLastIndex(i)
          else
            swapValue(i, i + 1);
        }

      } catch (err) {
        console.log(err);
      }
    };  

    const addItemDeleted = (itemID) => {
      try{
        setDeletedArray(prev => {
          // Check if itemID already exists in the array
          if (!prev.includes(itemID)) {
            // If not, add it to the array and return the new array
            return [...prev, itemID];
          }
          // If it exists, just return the previous array without modifications
          return prev;
        });  
      }catch(err){
        console.log(err)
      } finally {
        handleDeleteLineItem(itemID);
      }
    }

    const handleRenderLineItems = () => {
        return medicinesSubmitData.filter(m => !deletedArray.includes(m.id)).map((medicine, index) => (
              <Grid id={'m-unit_' + medicine.id} key={'mdc-update-' + index} 
              container justifyContent="flex" className="ou-mt-2">
                <Grid item xs={5}>
                  <FormControl fullWidth>
                    <TextField
                      fullWidth
                      autoComplete="given-name"
                      className="!ou-pr-2"
                      variant="outlined"
                      id={'medicineName' + index}
                      name={`medicineSubmit[${index}].medicineName`}
                      value={medicine.medicineName}
                      type="text"
                      InputProps={{
                        readOnly: true,
                      }}
                      {...register(`medicineSubmit[${index}].medicineName`)}
                    />
                  </FormControl>
                </Grid>
                  
                <Grid item xs={3} className="ou-text-center">
                  <div className="ou-flex">
                  <TextField
                    fullWidth
                    autoComplete="given-name"
                    className="!ou-px-2"
                    variant="outlined"
                    id={'medicineUses_' + index}
                    name={`medicineSubmit[${index}].uses`}
                    type="text"
                    {...register(`medicineSubmit[${index}].uses`)}
                    error={!!errors.medicineSubmit?.[index]?.uses}
                    helperText={errors.medicineSubmit?.[index]?.uses?.message}
                  />
                  </div>

                </Grid>
    
                <Grid item xs={3} className="ou-text-center">
                  <div className="ou-flex">
                  <TextField
                    fullWidth
                    autoComplete="given-name"
                    className="!ou-pl-2"
                    variant="outlined"
                    id={'medicineQuantity_' + index}
                    name={`medicineSubmit[${index}].quantity`}
                    type="number"
                    {...register(`medicineSubmit[${index}].quantity`)}
                    error={!!errors.medicineSubmit?.[index]?.quantity}
                    helperText={errors.medicineSubmit?.[index]?.quantity?.message}
                    >
                      <span>{medicine.quantity}</span>

                    </TextField>
                
                  </div>
                </Grid>
    
                <Grid item xs={1} className="ou-pl-2 ou-flex">
                  <Button
                    type="button"
                    onClick={() => addItemDeleted(medicine.id)}
                    className="ou-text-red-700"
                    sx={{ color: "red", width: '100%', height: '100%' }}>
                    <RemoveCircleIcon />
                  </Button>
                </Grid>
                    
              </Grid>
        ))

    }
  
    return (
        <>
         {loading && <BackdropLoading/>}
         <Typography>
                <Button
                    variant="contained"      
                    className="ou-w-[100%]"
                    onClick={handleOpenModal}
                >
                    {t('common:edit')}
                </Button>
       
        </Typography>

        <CustomModal
            className="ou-text-center"
            title={t('prescription-detail:editPrescriptionDetail')}
            open={isOpen}
            onClose={handleUnSaveChange}
            isClosingDropOutside={false}
            content={
                    <>
                        <Grid container xs={12} component={Paper} elevation={4} className="!ou-mt-6 ou-p-6">
                            <Grid item xs={5} className="!ou-mb-2">{t('prescription-detail:medicineName')}</Grid>
                            <Grid item xs={3} className="!ou-mb-2 ou-text-center ou-pl-2">{t('prescription-detail:uses')}</Grid>
                            <Grid item xs={3} className="!ou-mb-2 ou-text-center ou-pl-2">{t('prescription-detail:quantity')}</Grid>
                            
                        <form className="ou-w-full" onSubmit={handleSubmit(data =>{ 
                            handleOnSubmit(data);
                          })}>
                            
                            {deletedArray.length === medicinesSubmitData.length &&
                                <Grid item xs={12}>
                                    <Typography className="ou-text-center !ou-mt-3 ou-text-red-600">{t('nullMedicine')}
                                    </Typography>
                                </Grid>
                            }

                            {handleRenderLineItems(medicinesSubmitDataDraft)}
                            
                            <Box className="ou-text-right ou-w-full ou-mb-2 ou-mt-6">                             
                              <span className="ou-ml-3">
                                <Tooltip title={t("common:update")} followCursor>
                                    <span>
                                      <Button className="" type="submit" color="success" variant="contained">
                                          {t("common:update")}
                                      </Button>
                                    </span>
                                </Tooltip>
                              </span>
                            </Box>
                        </form>
                        </Grid>
                    </> 
    
            }            
            actions={[
            <Button key="cancel" onClick={() => {handleUnSaveChange()}}>
                {t('modal:cancel')}
            </Button>
            
            ]}
            />
        </>
       
    )
}

export default EditPrescriptionModal
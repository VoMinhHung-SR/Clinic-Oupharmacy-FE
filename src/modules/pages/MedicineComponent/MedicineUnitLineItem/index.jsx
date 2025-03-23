import { Box, Button, Divider, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Select, TableCell, TableRow, TextField, Tooltip, Typography } from "@mui/material"
import useCustomModal from "../../../../lib/hooks/useCustomModal";
import { useTranslation } from "react-i18next";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatNumberCurrency } from "../../../../lib/utils/helper";
import CustomModal from "../../../common/components/Modal";
import { useForm } from "react-hook-form";
import SchemaModels from "../../../../lib/schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
const MedicineUnitLineItem = ({data, removeMedicine, categories, updateMedicine}) => {
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    const { t } = useTranslation(["medicine", "common", "modal"]);
    
    const medicineUnit = data
    const {medicineUnitSchema} = SchemaModels()
    
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const methods = useForm({
      mode: "onSubmit",
      resolver: yupResolver(medicineUnitSchema)
    })
    const handleExitEditModal = () => {
      handleCloseModal()
      methods.reset()
      setSelectedImage(null)
      setImageUrl(null)
    }

    useEffect(() => {
            if (selectedImage) {
                setImageUrl(URL.createObjectURL(selectedImage));
            }
      }, [selectedImage]);

    return (
      <>
        <TableRow key={medicineUnit.id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <img src={medicineUnit.image_path} height={40} width={40}
            alt={`${medicineUnit.image}-${medicineUnit.id}`} />
          </TableCell>
         
          <TableCell align="left">
            <Typography className="ou-table-truncate-text-container ou-flex">
              <span>
                {medicineUnit.medicine.name}
              </span>
            </Typography>
          </TableCell>
          <TableCell align="center">
            <Typography>{medicineUnit.in_stock}</Typography>
          </TableCell >
          <TableCell align="center"> 
              <Typography>{formatNumberCurrency(medicineUnit.price)}</Typography>
            </TableCell>
            <TableCell align="center"> 
              <Typography>{medicineUnit.packaging}</Typography>
            </TableCell>
            <TableCell align="center">
            <Typography>{medicineUnit.category.name}</Typography>
          </TableCell>
        
          <TableCell align="center">
            <Box   className="ou-flex ou-justify-center ou-items-center">
              <Typography>
                <Tooltip followCursor title={t("common:seeDetail")} >
                  <span>
                    <Button
                        variant="contained"
                        className="ou-bg-blue-700 !ou-min-w-[68px]  !ou-min-h-[40px] !ou-py-2 !ou-mx-2"
                        size="small"
                        onClick={()=>handleOpenModal()}
                      >
                        <EditIcon/>
                      </Button>
                  </span>
                </Tooltip>

                <Tooltip followCursor title={t("common:delete")} >
                  <span>
                    <Button
                        variant="contained"
                        color="error"
                        className=" !ou-min-w-[68px]  !ou-min-h-[40px] !ou-py-2 !ou-mx-2"
                        size="small"
                        onClick={()=>removeMedicine(medicineUnit.medicine.id, medicineUnit.id, () => {})}
                      >
                        <DeleteIcon/>
                      </Button>
                  </span>
                </Tooltip>
              </Typography>
            </Box>
        
          </TableCell>
        </TableRow>

        <CustomModal
          title={t('medicine:updateMedicine')}
          className="ou-w-[800px]"
          open={isOpen}
          onClose={handleExitEditModal}
          content={
            <Box className="ou-p-8">
                <form onSubmit={methods.handleSubmit((data) =>  
                updateMedicine({...data, image: selectedImage},
                  medicineUnit.medicine.id, medicineUnit.id, 
                  handleExitEditModal, methods.setError))}>
                    <h3 className="ou-text-center ou-pb-3 ou-text-xl">
                      {t('medicine:medicineInfo')}
                      <Divider/>
                    </h3>
                    <div className="ou-mb-3">
                      <FormControl className="ou-w-full !ou-mb-2">
                        <TextField
                            className="ou-w-full"
                            variant="outlined"
                            defaultValue={medicineUnit.medicine.name}
                            label={t('medicine:medicineName')}
                            error={methods.formState.errors.name}
                            {...methods.register("name")} 
                        />
                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                          {methods.formState.errors.name?.message}</p>) : <></>}

                      </FormControl>

                        <FormControl fullWidth className="!ou-mb-2">
                          <InputLabel htmlFor="medicine-effect">{t('medicine:effect')}</InputLabel>
                          <OutlinedInput
                              fullWidth
                              autoComplete="given-name"
                              multiline
                              rows={2}
                              defaultValue={medicineUnit.medicine.effect}
                              type="text"
                              label={t('medicine:effect')}
                              error={methods.formState.errors.effect}
                              {...methods.register("effect")}
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.effect?.message}</p>) : <></>}
                        </FormControl>

                        <FormControl fullWidth className="!ou-mb-3">
                          <InputLabel htmlFor="medicine-contraindications">{t('medicine:contraindications')}</InputLabel>
                          <OutlinedInput
                              fullWidth
                              autoComplete="given-name"
                              multiline
                              rows={2}
                              defaultValue={medicineUnit.medicine.contraindications}
                              type="text"
                              label={t('medicine:contraindications')}
                              error={methods.formState.errors.contraindications}
                              {...methods.register("contraindications")}
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.contraindications?.message}</p>) : <></>}
                        </FormControl>

                      <h3 className="ou-text-center ou-pb-3 ou-text-xl">
                        {t('medicine:medicineInStock')}
                        <Divider/>
                      </h3>

                      <div className="ou-flex ou-mb-3">
                        <FormControl className="ou-w-[50%] !ou-mr-2">
                          <InputLabel htmlFor="medicine-form-price-label">{t('medicine:price')}</InputLabel>
                          <OutlinedInput
                            id="medicine-form-price"
                            label={t('medicine:price')}
                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                            error={methods.formState.errors.price}
                            {...methods.register("price")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.price?.message}</p>) : <></>}
                        </FormControl> 
                        <FormControl className="ou-w-[50%]">
                          <TextField
                              className="ou-w-full"
                              variant="outlined"
                              label={t('medicine:quantity')}
                              error={methods.formState.errors.inStock}
                              {...methods.register("inStock")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.inStock?.message}</p>) : <></>}
                        </FormControl>
                      
                      </div>

                      <div className="ou-flex">
                        <FormControl className="ou-w-[40%] !ou-mr-2">
                          <TextField
                              variant="outlined"
                              label={t('medicine:packaging')}
                              error={methods.formState.errors.packaging}
                              {...methods.register("packaging")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.packaging?.message}</p>) : <></>}

                        </FormControl>
                        
                        <FormControl className='ou-w-[60%]'>
                            <InputLabel id="medicine-update-cate">{t('medicine:category')}</InputLabel>
                                <Select
                                  className="ou-w-full"
                                    id="form__addMedicine_category"      
                                    name="category"
                                    defaultValue={medicineUnit.category && medicineUnit.category.id}
                                    label={t('medicine:category')}
                                    {...methods.register("category")} 
                                >
                                  {categories && categories.map(c =>
                                    <MenuItem key={`medicine-update-cate-${c.id}`} value={c.id}>{c.name}</MenuItem> 
                                  )}
                                </Select>
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.category?.message}</p>) : <></>} 
                        </FormControl>
                      </div>
                        <Box className="ou-py-2">
                            <input accept="image/*" type="file" id="select-image" style={{ display: 'none' }}
                                onChange={(e) => {
                                    setSelectedImage(e.target.files[0]);
                                }}
                            />
                            <label htmlFor="select-image">
                                <Button className="!ou-min-w-[150px]"  variant="contained" color="primary" component="span">
                                    {t('medicine:uploadMedicineImage')}
                                </Button>
                            </label>
                            {imageUrl && selectedImage && (
                                <Box className="ou-my-4 ou-border-solid" textAlign="center">
                                    <img src={imageUrl} alt={selectedImage.name} height="250px" width={250} className="ou-mx-auto"/>
                                </Box>
                            )}
                        </Box>
                    </div>
                    <div className="ou-text-right">
                        <Button type="submit" color="success" variant="contained">{t('common:update')}</Button>
                    </div>
                </form>
            </Box>
          }
        />
      </>
    )
}

export default MedicineUnitLineItem
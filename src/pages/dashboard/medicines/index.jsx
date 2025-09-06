import { useTranslation } from "react-i18next";
import useMedicine from "../../../lib/hooks/useMedicine"
import { Box, Button, Divider, FormControl, InputAdornment, InputLabel, MenuItem, OutlinedInput, Pagination, Paper, Select, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, Grid, Badge } from "@mui/material";
import { Helmet } from "react-helmet";
import MedicineUnitLineItem from "../../../modules/pages/MedicineComponent/MedicineUnitLineItem";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useCategory from "../../../modules/pages/CategoriesComponents/hooks/useCategory";
import { useEffect } from "react";
import SchemaModels from "../../../lib/schema";
import BackdropLoading from "../../../modules/common/components/BackdropLoading";
import MedicineFilter from "../../../modules/common/components/FIlterBar/MedicineFilter";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, memo } from "react";
import { Collapse } from "@mui/material";
import SkeletonMedicineList from "../../../modules/common/components/skeletons/pages/medicines";

const MemoizedMedicineFilter = memo(MedicineFilter);

const MedicineList = () => {
    const {page, pagination, handleChangePage, selectedImage, setSelectedImage, imageUrl, 
    setImageUrl, medicineLoading, medicines, updateMedicine, handleOnSubmitFilter, paramsFilter,
    addMedicine, backdropLoading, deleteMedicine} = useMedicine()

    const {categories, isLoading} = useCategory()
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();

    const { t, ready } = useTranslation(["medicine", "common", "modal"]);
    const [showFilter, setShowFilter] = useState(false);
    const {medicineUnitSchema} = SchemaModels()
    
    const methods = useForm({
      mode: "onSubmit",
      resolver: yupResolver(medicineUnitSchema),
      defaultValues: {
          name: ""
      }
    })

  useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
  }, [selectedImage]);

  if (!ready && medicineLoading && isLoading)
      return (
        <Box>
          <Helmet><title>Medicine List</title></Helmet>
          <SkeletonMedicineList />
        </Box>
      )

  if(backdropLoading)
    return <BackdropLoading/>;
  
  return (
      <>
        <Helmet>
            <title>{t('medicine:medicineList')}</title>
        </Helmet>
            <Box className="ou-flex ou-flex-col" >
            <TableContainer component={Paper} elevation={4}>
  
              <Box className="ou-flex ou-flex-col sm:ou-flex-row ou-items-start sm:ou-items-center ou-justify-between ou-p-4">
                <Box className="ou-w-full ou-flex ou-items-center">
                  <Typography variant="h6" className="ou-text-xl">{t('medicine:listOfMedicines')}</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<Badge badgeContent={pagination.count} color="primary"> <FilterListIcon /> </Badge>}
                    endIcon={<ExpandMoreIcon sx={{ transform: showFilter ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
                    onClick={() => setShowFilter((prev) => !prev)}
                    sx={{ borderRadius: 3, fontWeight: 500, marginLeft: '12px', textTransform: 'none' }}
                  >
                    <span className="ou-pl-3">{t('medicine:filter')}</span>
                  </Button>
                </Box>

              </Box>
                <Collapse in={showFilter}>
                  <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3, boxShadow: 2, width: '100%' }}>    
                  <Box className="ou-flex ou-flex-col sm:ou-flex-row ou-items-start sm:ou-items-center ou-gap-4 ou-w-full sm:ou-w-auto">
                      <Button 
                        color="success" 
                        variant="contained"
                        onClick={() => {handleOpenModal()}}
                        className="ou-w-full sm:ou-w-auto !ou-py-4"
                      >
                          <AddCircleOutlineIcon className="ou-mr-1"/> {t('medicine:addMedicine')}
                      </Button>
                      <MemoizedMedicineFilter 
                        onSubmit={handleOnSubmitFilter} 
                        kw={paramsFilter.kw}
                        categories={categories} 
                        cateFilter={paramsFilter.cate}
                        className="ou-w-full sm:ou-w-auto"
                      />
                  </Box>
                  </Paper>
                </Collapse>
              
              {/* Content area */}
              <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell align="center">{t("medicine:medicineName")}</TableCell>
                      <TableCell align="center">{t("medicine:inStock")}</TableCell>
                      <TableCell align="center">{t("medicine:price")}</TableCell>    
                      <TableCell align="center">{t("medicine:packaging")}</TableCell>
                      <TableCell align="center">{t("medicine:category")}</TableCell>
                      <TableCell align="center">
                        <Box className="ou-flex ou-justify-center ou-items-center">
                          {t("function")} 
                        </Box>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {medicineLoading && 
                      <TableCell colSpan={12} component="th" scope="row">
                        <Box className="ou-text-center">
                            <SkeletonListLineItem count={10} height="40px" className="ou-w-full" />
                        </Box>
                    </TableCell>}

                    {!medicineLoading && medicines.length > 0 && medicines.map(medicine => (
                        <MedicineUnitLineItem 
                        key={`medicine-unit-${medicine.id}`}  
                        categories={categories} 
                        updateMedicine={updateMedicine}
                        data={medicine} 
                        removeMedicine={deleteMedicine}/>
                    ))}

                    {!medicineLoading && medicines.length === 0 &&  
                      <TableCell colSpan={12} component="th" scope="row">
                          <Typography> 
                              <Box className="ou-text-center ou-p-10 ou-text-red-700">
                                  {t('medicine:errMedicinesNull')}
                              </Box>
                          </Typography>
                      </TableCell>
                    } 
                  </TableBody>
                </Table>
              </Box>
            </TableContainer>
            {pagination.sizeNumber >= 2 && (
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
        </Box>
      
        <CustomModal
          title={t('medicine:addMedicine')}
          open={isOpen}
          onClose={handleCloseModal}
          content={
          <Box className="ou-p-4 sm:ou-p-8">
              <form onSubmit={methods.handleSubmit((data) =>  
              addMedicine(data,() => {methods.reset(); handleCloseModal()}, methods.setError))}
                >
                  <Typography variant="h6" className="ou-text-center ou-pb-3">
                    {t('medicine:medicineInfo')}
                    <Divider/>
                  </Typography>
                  <Box className="ou-mb-3">
                    <FormControl className="ou-w-full !ou-mb-2">
                      <TextField
                          className="ou-w-full"
                          variant="outlined"
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
                          id="effect"
                          name="effect"
                          type="text"
                          label={t('medicine:effect')}
                          error={methods.formState.errors.effect}
                          {...methods.register("effect")}
                      />
                      {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.effect?.message}</p>) : <></>}
                    </FormControl>

                    <FormControl fullWidth className="!ou-mb-3">
                      <InputLabel htmlFor="medicine-contraindications">{t('medicine:contraindications')}</InputLabel>
                      <OutlinedInput
                          fullWidth
                          autoComplete="given-name"
                          multiline
                          rows={2}
                          id="contraindications"
                          name="contraindications"
                          type="text"
                          label={t('medicine:contraindications')}
                          error={methods.formState.errors.contraindications}
                          {...methods.register("contraindications")}
                      />
                      {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.contraindications?.message}</p>) : <></>}
                    </FormControl>

                    <Typography variant="h6" className="ou-text-center ou-pb-3">
                      {t('medicine:medicineInStock')}
                      <Divider/>
                    </Typography>

                    <Grid container spacing={2} className="ou-mb-3">
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <InputLabel htmlFor="medicine-form-price-label">{t('medicine:price')}</InputLabel>
                          <OutlinedInput
                            id="medicine-form-price"
                            label={t('medicine:price')}
                            startAdornment={<InputAdornment position="start">VND</InputAdornment>}
                            error={methods.formState.errors.price}
                            {...methods.register("price")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.price?.message}</p>) : <></>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                          <TextField
                              className="ou-w-full"
                              variant="outlined"
                              label={t('medicine:quantity')}
                              error={methods.formState.errors.inStock}
                              {...methods.register("inStock")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.inStock?.message}</p>) : <></>}
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={5}>
                        <FormControl fullWidth>
                          <TextField
                              variant="outlined"
                              label={t('medicine:packaging')}
                              error={methods.formState.errors.packaging}
                              {...methods.register("packaging")} 
                          />
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">{methods.formState.errors.packaging?.message}</p>) : <></>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={7}>
                        <FormControl fullWidth>
                          <InputLabel id="prescription_filter_email">{t('medicine:category')}</InputLabel>
                          <Select
                            className="ou-w-full"
                            id="form__addMedicine_category"      
                            name="category"
                            label={t('medicine:category')}
                            {...methods.register("category")} 
                          >
                            {categories && categories.map(c =><MenuItem key={`medicine-cate-${c.id}`} value={c.id}>{c.name}</MenuItem> )}
                          </Select>
                          {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.category?.message}</p>) : <></>} 
                        </FormControl>
                      </Grid>
                    </Grid>

                    <Box className="ou-py-4">
                      <input accept="image/*" type="file" id="select-image" style={{ display: 'none' }}
                          onChange={(e) => {
                              setSelectedImage(e.target.files[0]);
                          }}
                      />
                      <label htmlFor="select-image">
                          <Button 
                            className="!ou-min-w-[150px]"  
                            variant="contained" 
                            color="primary" 
                            component="span"
                            fullWidth
                          >
                              {t('medicine:uploadMedicineImage')}
                          </Button>
                      </label>
      
                      {imageUrl && selectedImage && (
                          <Box className="ou-my-4 ou-border-solid" textAlign="center">
                              <img 
                                src={imageUrl} 
                                alt={selectedImage.name} 
                                style={{ 
                                  height: 'auto',
                                  maxWidth: '100%',
                                  maxHeight: '250px'
                                }} 
                                className="ou-mx-auto"
                              />
                          </Box>
                      )}
                    </Box>
                  </Box>
                  <Box className="ou-text-right">
                      <Button type="submit" color="success" variant="contained">{t('common:submit')}</Button>
                  </Box>
              </form>
          </Box>
      }
      />
      </>
  );
}

export default MedicineList
import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import Loading from "../../../modules/common/components/Loading";
import useCategory from "../../../modules/pages/CategoriesComponents/hooks/useCategory";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from 'yup';
import { REGEX_NOTE, TOAST_ERROR } from "../../../lib/constants";
import { useState } from "react";
import createToastMessage from "../../../lib/utils/createToastMessage";
import SkeletonListLineItem from "../../../modules/common/components/skeletons/listLineItem";
const CategoryList = () => {
    const {categories, isLoading, onSubmit, handleOnDeleted, handleOnUpdate} = useCategory();
    const { handleCloseModal, isOpen, handleOpenModal } = useCustomModal();
    const {t,ready} = useTranslation(['category','common', 'yup-validate'])   
    
    const [createNotUpdate, setCreateNoUpdate] = useState(true)
    const [cateID, setCateID] = useState(-1)

    const categorySchema = Yup.object().shape({
        name: Yup.string()
            .required(t('yup-validate:yupNameCateRequired'))
            .max(254, t('yup-validate:yupNameCateMax'))
            .matches(REGEX_NOTE, t('yup-validate:yupNameCateInvalid'))
            .trim()
    });

    const methods = useForm({
        mode: "onSubmit",
        resolver: yupResolver(categorySchema),
        defaultValues: {
            name: ""
        }
    })

    if(!ready)
        return <Box sx={{ minHeight: "300px" }}>
        <Helmet>
            <title>Categories</title>
        </Helmet>
        <Box component={Paper} elevation={4} className="ou-text-center ou-p-10 ou-h-[30vh]">
            <SkeletonListLineItem count={5} className="ou-w-full"/>
        </Box>
    </Box>

    const onSubmitCreateOrUpdate = (data) => {
        if (createNotUpdate)
            return onSubmit(data, () => {handleCloseModal(); methods.reset()} )
        else
            if (cateID === -1)
                return createToastMessage({type:TOAST_ERROR, message: t('common:updateFailed')})
            return handleOnUpdate(cateID, data, () => {handleCloseModal(); methods.reset()})
    }

    return(
    <>
        <Helmet>
            <title>{t('common:categories')}</title>
        </Helmet>
        {isLoading && categories.length === 0 ?
            (<Box sx={{ minHeight: "300px" }}>
                <Box className="ou-text-center">
                    <SkeletonListLineItem count={4} className="ou-w-full" />
                </Box>
            </Box>)
                : (
                    <Box sx={{ minHeight: "300px" }}>
                        <TableContainer component={Paper} elevation={4}>
                        <div className="ou-flex ou-items-center ou-justify-between">
                            <div className="ou-flex ou-justify-between ou-w-full">
                                <h1 className="ou-text-xl ou-px-4 ou-py-8">{t('common:categories')}</h1>
                                <div className="ou-ml-auto ou-px-4 ou-py-8">
                                    <Button color="success" variant="contained"
                                    onClick={() => {handleOpenModal(); setCreateNoUpdate(true)}}>
                                        <AddCircleOutlineIcon className="ou-mr-1"/> {t('category:addCategory')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>{t('category:id')}</TableCell>
                                        <TableCell align="left">{t('category:name')}</TableCell>
                                        <TableCell align="center">{t('category:function')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categories.map(c => (
                                        <TableRow key={c.id}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell component="th" scope="row" >
                                                <Typography>
                                                    {c.id}
                                                </Typography>
                                            </TableCell>
                                
                                            <TableCell align="center">
                                                <Typography className="ou-table-truncate-text-container">
                                                    {c.name}
                                                </Typography>
                                            </TableCell>

                                            <TableCell align="center">
                                                <Button variant="contained" color="primary" 
                                                    className="!ou-mr-1" onClick={() => {
                                                        handleOpenModal(); setCreateNoUpdate(false); setCateID(c.id)} 
                                                    }>
                                                    {t('common:update')}
                                                </Button>
                                                <Button variant="contained" color="error" 
                                                    onClick={() => handleOnDeleted(c.id)} className="!ou-ml-1">
                                                    {t('common:delete')}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )
            }
        <CustomModal
            title={createNotUpdate && createNotUpdate ? t('category:addCategory') : t('category:updateCategory')}
            className="ou-w-[800px]"
            open={isOpen}
            onClose={handleCloseModal}
            content={
            <Box className="ou-p-8">
                <form onSubmit={methods.handleSubmit((data) => onSubmitCreateOrUpdate(data) )}>
                    <div className="ou-mb-3">
                        <TextField
                            className="ou-w-full"
                            variant="outlined"
                            label={t('category:name')}
                            error={methods.formState.errors.name}
                            {...methods.register("name")} 
                        />
                        {methods.formState.errors ? (<p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                            {methods.formState.errors.name?.message}</p>) : <></>} 

                    </div>
                    <div className="ou-text-right">
                        <Button type="submit" color="success" variant="contained">{createNotUpdate ? t('category:submit') : t('category:update')}</Button>
                    </div>
                </form>
            </Box>
        }
        />
    </>)
} 


export default CategoryList
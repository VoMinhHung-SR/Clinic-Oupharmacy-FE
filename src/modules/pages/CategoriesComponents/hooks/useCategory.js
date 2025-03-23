import { useEffect, useState } from "react"
import { fetchCategoryList, fetchCreateCategory, fetchDeleteCategory, fetchUpdateCategory } from "../services"
import createToastMessage from "../../../../lib/utils/createToastMessage"
import { TOAST_SUCCESS } from "../../../../lib/constants"
import { useTranslation } from "react-i18next"
import { ConfirmAlert } from "../../../../config/sweetAlert2"

const useCategory = () => {
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [flag, setFlag] = useState(false)
    const {t} = useTranslation(['modal', 'category'])

    useEffect(() => {
        try{
            const getCategories = async () =>{
                const res = await fetchCategoryList()
                if (res.status === 200)
                    setCategories(res.data)
            }
            getCategories()
        }catch(err){
            console.log(err)
        } finally {
            setIsLoading(false)
        }
    }, [flag])
    
    const onSubmit = (data, callbackOnSuccess) => {
        const handleOnSubmit = async () => {
            try{
                const res = await fetchCreateCategory(data.name)
                if(res.status === 201){
                    callbackOnSuccess() 
                    createToastMessage({type:TOAST_SUCCESS,
                        message: t('modal:createSuccess')});
                }
                
            }catch (err) {
                console.log(err)
            }finally {
                setFlag(!flag)
            }
        }
        handleOnSubmit()
    }

    const handleOnDeleted = (id) => {
        const deletedItem = async () => {
            try{
                const res = await fetchDeleteCategory(id)
                if(res.status === 204)
                    createToastMessage({type:TOAST_SUCCESS, message: t('modal:deleteCompleted')});         
            }catch (err) {
                console.log(err)
            }finally {
                setFlag(!flag)
            }
        }
        return ConfirmAlert(t('category:deleteCate'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        ()=>{
            deletedItem();
        }, () => { return; })
    }

    const handleOnUpdate = (id, data, callbackOnSuccess) => {
        const updateItem = async () => {
            try{
                const res = await fetchUpdateCategory(id,data.name)
                    if(res.status === 200){
                        callbackOnSuccess()
                        createToastMessage({type:TOAST_SUCCESS, message: t('modal:updateSuccess')});  
                    }
            }catch (err) {
                console.log(err)
            } finally {
                setFlag(!flag)
            }
        }
        updateItem();

    }


    return {
        categories, isLoading, onSubmit,
        handleOnDeleted, handleOnUpdate
    }
}

export default useCategory
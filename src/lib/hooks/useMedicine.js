import { useEffect, useState } from "react"
import { fetchMedicinesUnit } from "../../modules/common/components/card/PrescriptionDetailCard/services"
import { useSearchParams } from "react-router-dom";
import { fetchCreateMedicine, fetchCreateMedicineUnit, fetchDeletedMedicine, fetchDeletedMedicineUnit, fetchUpdateMedicine, fetchUpdateMedicineUnit } from "../../modules/pages/ProductComponents/services";
import createToastMessage from "../utils/createToastMessage";
import { TOAST_ERROR, TOAST_SUCCESS, PAGE_SIZE } from "../constants";
import { useTranslation } from "react-i18next";
import { ConfirmAlert } from "../../config/sweetAlert2";
import { goToTop } from "../utils/helper";
import { normalizeStoreVariantResponse } from "../adapters/storeProduct";

const useMedicine = ({ enabled = true } = {}) => {
    // List from medicine-units API: each item is a MedicineUnit (id, medicine, packaging, in_stock, price)
    const [medicineUnits, setMedicineUnits] = useState([]);
    const [medicineLoading, setMedicineLoading] = useState(Boolean(enabled));
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [flag, setFlag] = useState(false)
    const [backdropLoading, setBackDropLoading] = useState(false)
    const {t} = useTranslation(['modal', 'yup-validate'])
    
    // ====== QuerySet ======
    const [q] = useSearchParams();

    const [filterCount, setFilterCount] = useState(0);
    const [paramsFilter, setParamsFilter] = useState({
        kw: '',
        cate: 0,
        price: "all"
    })

    // ====== Pagination ======
    const [pagination, setPagination] = useState({ count: 0, sizeNumber: 0 });
    const [page, setPage] = useState(1);

    const handleChangeFlag = () => setFlag(!flag)    

    const handleChangePage = (event, value) => {
        if(page === value)
            return
        goToTop();
        setMedicineLoading(true);
        setMedicineUnits([]);
        setPage(value);
    };

    const handleOnSubmitFilter = (value) => {
        setMedicineLoading(true);
        setParamsFilter(value)
        setFilterCount(Object.values(value).filter(v => v !== 0 && v !== '').length);
        setPage(1);
        setFlag(!flag)
    }

    useEffect(() => {
        if (!enabled) {
            setMedicineLoading(false);
            return undefined;
        }
        const loadMedicines = async () => {
            try{ 
                let querySample = q.toString();

                const params = new URLSearchParams(querySample.startsWith("?") ? querySample.slice(1) : querySample)
                params.set("page", String(page))
                params.set("page_size", String(PAGE_SIZE))

                const kw = (paramsFilter.kw || "").trim()
                if (kw) params.set("kw", kw)
                else params.delete("kw")

                if (paramsFilter.cate && paramsFilter.cate !== 0) {
                    params.set("category", String(paramsFilter.cate))
                } else {
                    params.delete("category")
                }
                params.delete("cate")

                if (paramsFilter.price && paramsFilter.price !== "all") {
                    params.set("price_sort", paramsFilter.price)
                } else {
                    params.delete("price_sort")
                }
                params.delete("price")

                const queryString = params.toString()
                querySample = queryString ? `?${queryString}` : ""

                const res = await fetchMedicinesUnit(querySample);
                if (res.status === 200) {
                    const data = normalizeStoreVariantResponse(res.data);
                    setMedicineUnits(Array.isArray(data?.results) ? data.results : []);
                    setPagination({
                        count: data.count ?? 0,
                        sizeNumber: Math.ceil((data.count ?? 0) / PAGE_SIZE),
                    });
                }
            } catch (err) {
                setMedicineUnits([]);
            } finally {
                setMedicineLoading(false)
            }
        }
        loadMedicines()
    }, [page, flag, enabled])

    const addMedicine = (data, callBackSuccess, setError) => {
        const handleMedicine = async () => {
            try{
                setBackDropLoading(true)
            
                const resMedicine = await fetchCreateMedicine({
                    name: data.name, effect: data.effect, contraindications: data.contraindications})

                if(resMedicine.status === 201){

                    let medicineFormData = new FormData()
                    medicineFormData.append("price", data.price)
                    medicineFormData.append("in_stock", data.inStock)
                    medicineFormData.append("image", selectedImage)
                    medicineFormData.append("package_size", data.packaging ?? "")
                    medicineFormData.append("medicine", resMedicine.data.id)
                    medicineFormData.append("category", data.category)

                    const resMedicineUnit = await fetchCreateMedicineUnit(medicineFormData)
                    if(resMedicineUnit.status === 201){
                        callBackSuccess()
                        createToastMessage({type:TOAST_SUCCESS, message: t('modal:createSuccess')});
                    }
                }
                    
           }catch(err){
                if (err) {
                    const data = err.response.data;
                    setBackDropLoading(false)
                    if (data.name)
                        setError("name", {
                            type: "custom",
                            message: t('yup-validate:yupMedicineExist'),
                        });
                    
                    createToastMessage({type:TOAST_ERROR, message:t("modal:createFailed")})
                }
            }finally{
                setBackDropLoading(false)
                setFlag(!flag)
            }
        }
        handleMedicine()
    }

    const deleteMedicine = (medicineID, medicineUnitID, callBackSuccess) => {
        const handleRemove = async () => {
            try{
                const medicineUnitRes = await fetchDeletedMedicineUnit(medicineUnitID)
                if(medicineUnitRes.status === 204){
                    const medicineRes = await fetchDeletedMedicine(medicineID)      
                    if(medicineRes.status === 204){
                        callBackSuccess();
                        createToastMessage({type:TOAST_SUCCESS, message: t('modal:deleteCompleted')});
                        setFlag(!flag)
                    }
                }
            }catch (err) {
                console.log(err)
            } finally {
                setBackDropLoading(false)
            }
        } 
        return ConfirmAlert(t('medicine:confirmDeleteMedicineUnit'),
        t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        ()=>{
            setBackDropLoading(true)
            handleRemove()
        }, () => { return; })
    }

    const updateMedicine = (data, medicineID, medicineUnitID, callBackSuccess, setError) => {
        const handleMedicine = async () => {
            try{
                setBackDropLoading(true)
                const resMedicine = await fetchUpdateMedicine(medicineID,{
                    name: data.name, effect: data.effect, contraindications: data.contraindications})

                 if(resMedicine.status === 200){

                    let medicineFormData = new FormData()
                    medicineFormData.append("price", data.price)
                    medicineFormData.append("in_stock", data.inStock)
                    medicineFormData.append("image", data.image)
                    medicineFormData.append("package_size", data.packaging ?? "")
                    medicineFormData.append("medicine", resMedicine.data.id)
                    medicineFormData.append("category", data.category)

                    const resMedicineUnit = await fetchUpdateMedicineUnit(medicineUnitID, medicineFormData)
                    if(resMedicineUnit.status === 200){
                        callBackSuccess()
                        createToastMessage({type:TOAST_SUCCESS, message: t('modal:updateSuccess')});
                    }
                }
           }catch(err){
                console.log(err)
                if (err) {
                    const data = err.response.data;
                    setBackDropLoading(false)
                    if (data.name)
                        setError("name", {
                            type: "custom",
                            message: t('yup-validate:yupMedicineExist'),
                        });
                    
                    createToastMessage({type:TOAST_ERROR, message:t("modal:updateFailed")})
                }
            }finally{
                setBackDropLoading(false)
                setFlag(!flag)
            }
        }
        handleMedicine()
    }
    return {
        page,
        filterCount,
        imageUrl,
        paramsFilter,
        medicineUnits,
        handleOnSubmitFilter,
        pagination,
        updateMedicine,
        selectedImage,
        deleteMedicine,
        medicineLoading,
        backdropLoading,
        setSelectedImage,
        setImageUrl,
        handleChangePage,
        addMedicine,
        handleChangeFlag,
    };
}

export default useMedicine
import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../config/sweetAlert2";
import { fetchAddPrescriptionDetail, fetchCreatePrescribing } from "../../modules/common/components/card/PrescriptionDetailCard/services";
import createToastMessage from "../utils/createToastMessage";
import { TOAST_SUCCESS } from "../constants";

const PrescribingContext = createContext();

export default PrescribingContext;

export const PrescribingProvider = ({children}) => {
    const {t} = useTranslation(['yup-validate', 'modal', 'prescription-detail', 'common']);

    const [medicinesSubmit, setMedicinesSubmit] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const navigate = useNavigate();

    const addMedicineItem = (medicineUnitId, medicineName, uses, quantity, inStock) => { 
        const newItem = {
            id: medicineUnitId,
            medicineName: medicineName,
            uses: uses,
            quantity: parseInt(quantity),
            inStock: inStock
        };
        setMedicinesSubmit( prevMedicinesSubmit => {
            const updatedState = [...prevMedicinesSubmit, newItem];
            return updatedState;
        });
        setHasUnsavedChanges(true);
    };
    // Clear with alert
    const resetMedicineStore = () => {
        return ConfirmAlert(t('prescription-detail:deletedPrescription'), t('modal:noThrowBack'), t('modal:ok'),t('modal:cancel'), 
            ()=> {
                createToastMessage({type:TOAST_SUCCESS,message: t('common:updateSuccess')});
                setMedicinesSubmit([]);
                setHasUnsavedChanges(false);
            }, ()=>{})
    };
    // Clear without alert
    const clearForm = () => {
        setHasUnsavedChanges(false);
        setMedicinesSubmit([]);
        createToastMessage({type:TOAST_SUCCESS,message: t('common:updateSuccess')});
    };

    const handleUpdateMedicinesSubmit = (updatedData) => {
        if(updatedData.length === 0){
            setMedicinesSubmit([])
            setHasUnsavedChanges(false);
            return
        }
        const updatedMedicinesSubmit = medicinesSubmit.map(medicine => {
            const updatedMedicine = updatedData.find(item => item.medicineName === medicine.medicineName);
            return updatedMedicine ? { ...medicine, ...updatedMedicine } : null;
        }).filter(Boolean);
        setMedicinesSubmit(updatedMedicinesSubmit);
        setHasUnsavedChanges(true);
    };
    
    const handleAddMedicineSubmit = (medicineUnit, data) => {
        const addMedicinesUnit = async () => {
            try {
                if (!medicineUnit.id || !data)
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
                
                if (medicineUnit.id === -1)
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));

                // Flag to check if medicine is updated
                let medicineUpdated = false;

                if (medicinesSubmit.length !== 0) {  
                    const updatedMedicinesSubmit = medicinesSubmit.map((medicine) => {
                        if (medicine.id === medicineUnit.id) {
                            medicineUpdated = true

                            return {
                                ...medicine,
                                uses: data.uses,
                                inStock: medicineUnit.in_stock,
                                quantity: parseInt(medicine.quantity) + parseInt(data.quantity)
                            };
                        }
                        return medicine;
                    });
                    if (medicineUpdated)
                        handleUpdateMedicinesSubmit(updatedMedicinesSubmit);
                    else 
                        addMedicineItem(medicineUnit.id, medicineUnit.medicine.name, data.uses, data.quantity, medicineUnit.in_stock); 
                }else 
                    addMedicineItem(medicineUnit.id, medicineUnit.medicine.name, data.uses, data.quantity, medicineUnit.in_stock);  
            } catch (err) {
                console.log(err);
                ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
            } finally {
                setFlag(!flag);
            }
        };
        addMedicinesUnit();
    };

    useEffect(() => {
        // Add any necessary side effects here
    }, [medicinesSubmit, flag]);

    const handleAddPrescriptionDetail = async (userID, prescribingID) => {
        const handleOnSubmit = async () => {
            try {
                if (medicinesSubmit.length === 0) {
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
                }
    
                const prescribingData = { user: userID, diagnosis: parseInt(prescribingID) };
                const res = await fetchCreatePrescribing(prescribingData);
                if (res.status === 201) {
                    await Promise.all(
                        medicinesSubmit.map(async (m) => {
                            const formData = {
                                quantity: m.quantity,
                                uses: m.uses,
                                prescribing: res.data.id,
                                medicine_unit: m.id
                            };
                            await fetchAddPrescriptionDetail(formData);
                        })
                    );
                    
                    SuccessfulAlert({title: t('modal:createSuccess'), 
                        description: "Do you want to go to the Homepage? or Continue to add prescription?",
                        confirmButtonText: t('modal:ok'), 
                        showCancelButton: true,
                        cancelButtonText: t('modal:cancel'), 
                        callbackSuccess: () =>{
                            setHasUnsavedChanges(false);
                            navigate('/dashboard/prescribing');
                        },
                        callbackCancel: () => {
                            setMedicinesSubmit([]);
                        }});
                } else {
                    ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'));
                }
            } catch (err) {
                console.error(err);
                ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
            } finally {
                setIsLoadingButton(false)
            }

        }
        return ConfirmAlert(t('prescription-detail:confirmAddPrescription'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            setIsLoadingButton(true)
            handleOnSubmit()
        }, () => { return; })
    };

    return (
        <PrescribingContext.Provider
            value={{
                isLoadingButton: isLoadingButton,
                medicinesSubmit: medicinesSubmit, setMedicinesSubmit,
                addMedicineItem: handleAddMedicineSubmit, resetMedicineStore,
                handleUpdateMedicinesSubmit: handleUpdateMedicinesSubmit,
                handleAddPrescriptionDetail: handleAddPrescriptionDetail,
                clearForm: clearForm,
                hasUnsavedChanges: hasUnsavedChanges
            }}
        >
            {children}
        </PrescribingContext.Provider>
    );
};

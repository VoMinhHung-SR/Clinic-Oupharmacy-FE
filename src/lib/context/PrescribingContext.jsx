import { createContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmAlert, ErrorAlert } from "../../config/sweetAlert2";
import { createPrescribingWithDetails } from "../../modules/pages/PrescriptionDetailComponents/services/prescribingActions";
import createToastMessage from "../utils/createToastMessage";
import { TOAST_ERROR, TOAST_SUCCESS } from "../constants";
import { enrichVariantForPrescribing } from "../adapters/storeProduct";

const PrescribingContext = createContext();

export default PrescribingContext;

export const PrescribingProvider = ({children}) => {
    const {t} = useTranslation(['yup-validate', 'modal', 'prescription-detail', 'common']);

    const [medicinesSubmit, setMedicinesSubmit] = useState([]);
    const [flag, setFlag] = useState(false);
    const [isLoadingButton, setIsLoadingButton] = useState(false)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [newPrescribing, setNewPrescribing] = useState(null);
    const [newestPrescriptionDetail, setNewestPrescriptionDetail] = useState([]);
    const [isBackdropLoading, setIsBackdropLoading] = useState(false);

    const addMedicineItem = (
        medicineUnitId,
        medicineName,
        packaging,
        uses,
        quantity,
        inStock,
        productVariantUnitId = null,
        quantityInBase = 1
    ) => {
        const newItem = {
            id: medicineUnitId,
            medicineUnitId: medicineUnitId,
            productVariantId: medicineUnitId,
            productVariantUnitId: productVariantUnitId,
            quantityInBase: Number(quantityInBase) || 1,
            medicineName: medicineName,
            packaging: packaging ?? "",
            uses: uses,
            quantity: parseInt(quantity, 10),
            inStock: inStock,
        };
        setMedicinesSubmit((prev) => [...prev, newItem]);
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
        if (updatedData.length === 0) {
            setMedicinesSubmit([]);
            setHasUnsavedChanges(false);
            return;
        }
        const updated = medicinesSubmit.map((item) => {
            const match = updatedData.find((u) => u.id === item.id);
            return match ? { ...item, ...match } : null;
        }).filter(Boolean);
        setMedicinesSubmit(updated);
        setHasUnsavedChanges(true);
    };

    const removeMedicineItem = (medicineUnitId) => {
        setMedicinesSubmit((prev) => prev.filter((item) => item.id !== medicineUnitId));
        setHasUnsavedChanges(true);
    };

    const updateMedicineItem = (medicineUnitId, payload) => {
        setMedicinesSubmit((prev) =>
            prev.map((item) => (item.id === medicineUnitId ? { ...item, ...payload } : item))
        );
        setHasUnsavedChanges(true);
    };
    
    const handleAddMedicineSubmit = (medicineUnit, data) => {
        const addMedicinesUnit = async () => {
            try {
                if (!medicineUnit.id || !data)
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
                
                if (medicineUnit.id === -1)
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));

                const enriched = enrichVariantForPrescribing(
                    medicineUnit,
                    medicineUnit.selectedSaleUnitId ?? medicineUnit.product_variant_unit_id ?? null
                );
                if (!enriched.product_variant_unit_id) {
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'));
                }

                const lineKey = (item) =>
                    `${item.id}:${item.productVariantUnitId ?? ""}`;

                // Flag to check if medicine is updated
                let medicineUpdated = false;

                if (medicinesSubmit.length !== 0) {
                    const updatedMedicinesSubmit = medicinesSubmit.map((item) => {
                        if (lineKey(item) === lineKey({
                            id: enriched.id,
                            productVariantUnitId: enriched.product_variant_unit_id,
                        })) {
                            medicineUpdated = true;
                            return {
                                ...item,
                                uses: data.uses,
                                inStock: enriched.in_stock,
                                quantity: parseInt(item.quantity, 10) + parseInt(data.quantity, 10),
                                productVariantUnitId: enriched.product_variant_unit_id,
                                quantityInBase: enriched.quantity_in_base,
                                packaging: enriched.selectedUnitName ?? item.packaging,
                            };
                        }
                        return item;
                    });
                    if (medicineUpdated) handleUpdateMedicinesSubmit(updatedMedicinesSubmit);
                    else addMedicineItem(
                        enriched.id,
                        enriched.medicine.name,
                        enriched.selectedUnitName ?? enriched.packaging ?? "",
                        data.uses,
                        data.quantity,
                        enriched.in_stock,
                        enriched.product_variant_unit_id,
                        enriched.quantity_in_base
                    );
                } else {
                    addMedicineItem(
                        enriched.id,
                        enriched.medicine.name,
                        enriched.selectedUnitName ?? enriched.packaging ?? "",
                        data.uses,
                        data.quantity,
                        enriched.in_stock,
                        enriched.product_variant_unit_id,
                        enriched.quantity_in_base
                    );
                }  
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

    const handleAddPrescriptionDetail = async (userID, diagnosisID) => {
        if (medicinesSubmit.length === 0) {
            createToastMessage({ type: TOAST_ERROR, message: t("modal:createFailed") });
            return;
        }

        return ConfirmAlert(
            t("prescription-detail:confirmAddPrescription"),
            t("modal:noThrowBack"),
            t("modal:yes"),
            t("modal:cancel"),
            async () => {
                setIsLoadingButton(true);
                setIsBackdropLoading(true);
                try {
                    const result = await createPrescribingWithDetails(
                        userID,
                        diagnosisID,
                        medicinesSubmit
                    );
                    if (result.success) {
                        if (result.newPrescribing) setNewPrescribing(result.newPrescribing);
                        if (result.newestPrescriptionDetail)
                            setNewestPrescriptionDetail(result.newestPrescriptionDetail);
                        createToastMessage({
                            type: TOAST_SUCCESS,
                            message: t("prescription-detail:prescriptionCreated"),
                        });
                    } else {
                        createToastMessage({ type: TOAST_ERROR, message: t("modal:createFailed") });
                    }
                } catch (err) {
                    createToastMessage({ type: TOAST_ERROR, message: t("modal:createFailed") });
                } finally {
                    setHasUnsavedChanges(false);
                    setMedicinesSubmit([]);
                    setIsLoadingButton(false);
                    setIsBackdropLoading(false);
                }
            },
            () => {}
        );
    };

    return (
        <PrescribingContext.Provider
            value={{
                isLoadingButton: isLoadingButton,
                medicinesSubmit: medicinesSubmit, setMedicinesSubmit,
                addMedicineItem: handleAddMedicineSubmit, resetMedicineStore,
                removeMedicineItem, updateMedicineItem,
                handleUpdateMedicinesSubmit: handleUpdateMedicinesSubmit,
                handleAddPrescriptionDetail: handleAddPrescriptionDetail,
                clearForm: clearForm,
                newPrescribing, newestPrescriptionDetail,
                hasUnsavedChanges, isBackdropLoading
            }}
        >
            {children}
        </PrescribingContext.Provider>
    );
};

import { createContext } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmAlert, ErrorAlert } from "../../config/sweetAlert2";
import { createPrescribingWithDetails } from "../../features/prescribing/api/prescription";
import createToastMessage from "../utils/createToastMessage";
import { TOAST_ERROR, TOAST_SUCCESS } from "../constants";
import usePrescriptionDraft from "../../features/prescribing/draft/usePrescriptionDraft";
import { useState } from "react";

const PrescribingContext = createContext();

export default PrescribingContext;

export const PrescribingProvider = ({ children }) => {
  const { t } = useTranslation(["yup-validate", "modal", "prescription-detail", "common"]);

  const {
    draftLines,
    medicinesSubmit,
    setDraftLines,
    hasUnsavedChanges,
    addFromVariant,
    removeLine,
    updateLine,
    replaceLines,
    clearDraft,
    resetAfterSubmit,
  } = usePrescriptionDraft();

  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [newPrescribing, setNewPrescribing] = useState(null);
  const [newestPrescriptionDetail, setNewestPrescriptionDetail] = useState([]);
  const [isBackdropLoading, setIsBackdropLoading] = useState(false);

  const resetMedicineStore = () => {
    return ConfirmAlert(
      t("prescription-detail:deletedPrescription"),
      t("modal:noThrowBack"),
      t("modal:ok"),
      t("modal:cancel"),
      () => {
        createToastMessage({ type: TOAST_SUCCESS, message: t("common:updateSuccess") });
        clearDraft();
      },
      () => {}
    );
  };

  const clearForm = () => {
    clearDraft();
    createToastMessage({ type: TOAST_SUCCESS, message: t("common:updateSuccess") });
  };

  const handleAddMedicineSubmit = (medicineUnit, data) => {
    const result = addFromVariant(medicineUnit, data);
    if (!result.ok) {
      ErrorAlert(t("modal:createFailed"), t("modal:pleaseDoubleCheck"), t("modal:ok"));
    }
  };

  const handleAddPrescriptionDetail = async (userID, diagnosisID) => {
    if (draftLines.length === 0) {
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
          const result = await createPrescribingWithDetails(userID, diagnosisID, draftLines);
          if (result.success) {
            if (result.newPrescribing) setNewPrescribing(result.newPrescribing);
            if (result.newestPrescriptionDetail)
              setNewestPrescriptionDetail(result.newestPrescriptionDetail);
            createToastMessage({
              type: TOAST_SUCCESS,
              message: t("prescription-detail:prescriptionCreated"),
            });
            resetAfterSubmit();
          } else {
            createToastMessage({ type: TOAST_ERROR, message: t("modal:createFailed") });
          }
        } catch {
          createToastMessage({ type: TOAST_ERROR, message: t("modal:createFailed") });
        } finally {
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
        isLoadingButton,
        medicinesSubmit,
        draftLines,
        setDraftLines,
        addMedicineItem: handleAddMedicineSubmit,
        resetMedicineStore,
        removeMedicineItem: removeLine,
        updateMedicineItem: updateLine,
        handleUpdateMedicinesSubmit: replaceLines,
        handleAddPrescriptionDetail,
        clearForm,
        newPrescribing,
        newestPrescriptionDetail,
        hasUnsavedChanges,
        isBackdropLoading,
      }}
    >
      {children}
    </PrescribingContext.Provider>
  );
};

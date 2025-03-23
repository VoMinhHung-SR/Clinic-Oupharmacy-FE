import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { userContext } from "../../../../../../App";
import SuccessfulAlert, { ConfirmAlert, ErrorAlert } from "../../../../../../config/sweetAlert2";
import * as Yup from 'yup';
import { fetchAddPrescriptionDetail, fetchCreatePrescribing, fetchMedicinesUnit } from "../services";
import { useTranslation } from "react-i18next";
import { APP_ENV, REGEX_ADDRESS, REGEX_NUMBER999, STATUS_BOOKING_WAS_PRESCRIBED } from "../../../../../../lib/constants";
import { keyUpdateExam } from "../../../../../../lib/utils/helper";
import { db } from "../../../../../../config/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import UserContext from "../../../../../../lib/context/UserContext";

const usePrescriptionDetailCard = () => {
    const {t} = useTranslation(['yup-validate', 'modal', 'prescription-detail'])
    const {prescribingId} = useParams();
    const {user}=useContext(UserContext);
    const [flag, setFlag] = useState(false)
    const router = useNavigate();
    const [openBackdrop, setOpenBackdrop] = useState(false)
    const [medicine, setMedicine] = useState({
        "medicineName": '',
        "medicineUnitId": -1
    })
    const [medicinesSubmit, setMedicineSubmit] = useState([])


    const prescriptionDetailSchema = Yup.object().shape({
        uses: Yup.string().trim()
            .required(t('yupUsesRequired'))
            .max(100, t('yupUsesMaxLength'))
            .matches(REGEX_ADDRESS,t('yupUsesInvalid')),
        quantity: Yup.string(t('yupQuantityNumber')).trim()
            .max(3, t('yupQuantityMax'))
            .required(t('yupQuantityRequired'))
            .matches(REGEX_NUMBER999,t('yupQuantityInvalid')),
    });

    const addMedicine = (medicineUnitId, medicineName, uses, quantity) => {
        const newItem = {
            'id': medicineUnitId,
            'medicineName': medicineName,
            'uses': uses,
            'quantity': parseInt(quantity)
        };

        setMedicineSubmit((pre) => {
            return [...pre, newItem];
        });
    }

    const handleDeleteItem = (itemId) => {
        const deleteItem = () => {
            if (medicinesSubmit.length !== 0) {
                medicinesSubmit.forEach((medicineUnit, i) => {
                    if (medicineUnit.id === itemId) {
                        SuccessfulAlert(t('modal:deleteCompleted'),t('modal:ok'))
                        medicinesSubmit.splice(i, 1)
                        setFlag(!flag)
                    }
                })
            }
        }
        return ConfirmAlert(t('prescription-detail:confirmDeleteMedicine'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            deleteItem()
        }, () => { return; })
    }

    const handleOnEditItem = (itemID, data) => {
        const editItem = () => {
            if (medicinesSubmit.length !== 0) {
                medicinesSubmit.forEach((medicineUnit, i) => {
                    if (medicineUnit.id === itemID) {
                        medicinesSubmit.quantity = data.quantity
                        medicineUnit.uses = data.uses
                        SuccessfulAlert(t('modal:deleteCompleted'),t('modal:ok'))
                        setFlag(!flag)
                    }
                })
            }
        }
        return ConfirmAlert(t('prescription-detail:confirmDeleteMedicine'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            editItem(itemID)
        }, () => { return; })
    }

    const handleAddPrescriptionDetail = (examID, recipientID) => {
        const addPrescriptionDetail = async () => {
            if (medicinesSubmit.length !== 0) {
                let prescribingData = {user:user.id, diagnosis: parseInt(prescribingId)}
                const res = await fetchCreatePrescribing(prescribingData)
                if(res.status === 201){
                    medicinesSubmit.forEach( async (m) => {
                        try {
                            let formData = {
                                'quantity': m.quantity,
                                'uses': m.uses,
                                'prescribing': res.data.id,
                                'medicine_unit': m.id
                            }
                            await fetchAddPrescriptionDetail(formData)
        
                        } catch (err) {
                            setOpenBackdrop(false)
                            return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'))
                        }
                    })
                    setOpenBackdrop(false)
                    // Update commit of waiting-room    
                    if(examID){
                        createNotificationRealtime(recipientID, examID)
                        await keyUpdateExam(examID, "isCommitted", true)
                    }
                    return SuccessfulAlert(t('modal:createSuccess'), t('modal:ok'), () => router('/'))
                }
                   
                else{
                    setOpenBackdrop(false)
                    return ErrorAlert(t('modal:errSomethingWentWrong'), t('modal:pleaseTryAgain'), t('modal:ok'))
                }
            } else {
                setOpenBackdrop(false)
                return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'))
            }

        }
        return ConfirmAlert(t('prescription-detail:confirmAddPrescription'),t('modal:noThrowBack'),t('modal:yes'),t('modal:cancel'),
        // this is callback function when user confirmed "Yes"
        ()=>{
            setOpenBackdrop(true)
            addPrescriptionDetail()
        },() => { return; })
    }

    const onSubmit = (medicineUnit, data) => {
        const addMedicinesUnit = async () => {
            try {
                if (medicineUnit.id === -1)
                    return ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'))
                else {
                    if (medicinesSubmit.length !== 0) {
                        for (let i = 0; i < medicinesSubmit.length; i++) {
                            // Update items in dynamic table
                            if (medicinesSubmit[i].id === medicineUnit.id) {
                                medicinesSubmit[i].uses = data.uses
                                medicinesSubmit[i].quantity = medicinesSubmit[i].quantity + parseInt(data.quantity)
                                return medicinesSubmit
                            } else
                            // Add new lineItems
                                if (medicinesSubmit[i].id !== medicine.medicineUnitId
                                    && i === medicinesSubmit.length - 1)
                                    addMedicine(medicineUnit.id, medicineUnit.medicine.name,
                                        data.uses, data.quantity);
                        }
                    } else
                        addMedicine(medicineUnit.id, medicineUnit.medicine.name,
                            data.uses, data.quantity);
                }
            } catch (err) {
                ErrorAlert(t('modal:createFailed'), t('modal:pleaseDoubleCheck'), t('modal:ok'))
            } finally {
                setFlag(!flag)
            }
        }
        addMedicinesUnit();
    }

    useEffect(() => {}, [flag, medicinesSubmit])

    const createNotificationRealtime  = async (userID, examinationID) => {
        try{
            await setDoc(doc(db,`${APP_ENV}_notifications`, examinationID.toString()),{
                "is_commit": false,
                "is_active": true,
                "booking_id": examinationID,
                'content': STATUS_BOOKING_WAS_PRESCRIBED,
                "recipient_id": userID,
                "avatar": user.avatar_path,
                "sent_at" : serverTimestamp()
            },{merge:true})
        }catch(err){
            console.log(err)
        }
    }

    return {
        user,
        medicinesSubmit,
        openBackdrop,
        setMedicine,
        onSubmit,
        handleDeleteItem,
        handleAddPrescriptionDetail,
        prescriptionDetailSchema
    }
}
export default usePrescriptionDetailCard
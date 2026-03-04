import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import UserContext from "../../../../lib/context/UserContext";
import { fetchPrescriptionDetailBillCard } from "../../../common/components/card/BillCard/services";
import { fetchPrescriptionDetail } from "../../PrescriptionDetailComponents/services";
import { executeBulkPayment, getMomoPaymentUrl } from "../services/paymentActions";
import moment from "moment/moment";
import { useTranslation } from "react-i18next";
import { TOAST_ERROR, TOAST_SUCCESS } from "../../../../lib/constants";
import { ConfirmAlert } from "../../../../config/sweetAlert2";
import createToastMessage from "../../../../lib/utils/createToastMessage";

const usePayment = () => {
    const { user } = useContext(UserContext);
    // URL param :prescribingId is diagnosis ID
    const { prescribingId: diagnosisId } = useParams();
    const [diagnosisInfo, setDiagnosisInfo] = useState([])
    const [prescriptionDetail, setPrescriptionDetail] = useState({})
    const [loadingStates, setLoadingStates] = useState(true)
    const [flag, setFlag] = useState(false)
    const [isLoadingButton, setIsLoadingButton] = useState(false);

    const { t } = useTranslation(["payment", "modal"]);

    useEffect(() => {
        const loadPrescriptionDetailByPrescribingId = async (prescribingId) => {
            try {
                const res = await fetchPrescriptionDetailBillCard(prescribingId);
                if (res.status === 200) {
                    setPrescriptionDetail((prev) => {
                        const date = moment(res.data.created_date).format("YYYY-MM-DD");
                        return {
                            ...prev,
                            [date]: {
                                ...prev[date],
                                [prescribingId]: { ...res.data },
                            },
                        };
                    });
                }
            } catch (err) {
                console.error("Error loading prescribing for diagnosis:", err);
                setPrescriptionDetail((prev) => ({ ...prev, [prescribingId]: [] }));
            } finally {
                setLoadingStates(false);
            }
        };

        const loadDiagnosisInfo = async () => {
            const res = await fetchPrescriptionDetail(diagnosisId);
            if (res.status === 200) {
                setDiagnosisInfo(res.data);
                if (res.data.prescribing_info?.length > 0) {
                    res.data.prescribing_info.forEach((prescribing) => {
                        loadPrescriptionDetailByPrescribingId(prescribing.id);
                    });
                }
            }
        };

        if (user && diagnosisId) {
            loadDiagnosisInfo();
        }
    }, [user, diagnosisId, flag]);

    const handlePayment = ({ onSuccess, onError, momoWallet = false }) => {
        const id = diagnosisInfo?.id;
        if (!id) return;

        const onSubmit = async () => {
            try {
                const result = await executeBulkPayment(id);
                if (result.success) {
                    setFlag((prev) => !prev);
                    onSuccess?.();
                    createToastMessage({ type: TOAST_SUCCESS, message: t("payment:paidCompleted") });
                } else {
                    onError?.();
                    createToastMessage({ type: TOAST_ERROR, message: t("payment:payFailed") });
                }
            } catch (err) {
                onError?.();
                createToastMessage({ type: TOAST_ERROR, message: t("payment:payFailed") });
            } finally {
                setIsLoadingButton(false);
            }
        };

        const doMomoPayment = async () => {
            try {
                const result = await getMomoPaymentUrl(id);
                if (result.success && result.payUrl) {
                    window.location.replace(result.payUrl);
                } else {
                    createToastMessage({ type: TOAST_ERROR, message: t("payment:payFailed") });
                }
            } catch (err) {
                createToastMessage({ type: TOAST_ERROR, message: t("payment:payFailed") });
            }
        };

        return ConfirmAlert(
            t("payment:confirmCreateBill"),
            t("modal:noThrowBack"),
            t("modal:yes"),
            t("modal:cancel"),
            () => {
                setIsLoadingButton(true);
                if (momoWallet) doMomoPayment();
                else onSubmit();
            },
            () => {}
        );
    };

    return {
        prescriptionDetail,
        isLoadingPrescriptionDetail: loadingStates,
        diagnosisInfo,
        handlePayment,
        isLoadingButton,
    };
};

export default usePayment;
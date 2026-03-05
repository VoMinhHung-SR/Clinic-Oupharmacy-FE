import { fetchCreatePrescribing, fetchAddPrescriptionDetail,
  fetchGetPrescriptionDetailById } from "../../../common/components/card/PrescriptionDetailCard/services";

/**
 * Tạo prescribing + prescription_detail và lấy dữ liệu chi tiết mới nhất.
 * Service thuần (không toast/alert), dùng trong PrescribingContext.
 * @param {number} userId
 * @param {number} diagnosisId
 * @param {Array<{ id: number, medicineName: string, uses: string, quantity: number }>} medicinesSubmit
 * @returns {Promise<{ success: boolean, newPrescribing?: object, newestPrescriptionDetail?: array, error?: string }>}
 */
export async function createPrescribingWithDetails(userId, diagnosisId, medicinesSubmit) {
  try {
    if (!medicinesSubmit?.length) {
      return { success: false, error: "empty_medicines" };
    }

    const prescribingData = { user: userId, diagnosis: parseInt(diagnosisId, 10) };
    const res = await fetchCreatePrescribing(prescribingData);
    if (res.status !== 201) {
      return { success: false, error: "create_failed" };
    }

    const prescribingId = res.data.id;
    await Promise.all(
      medicinesSubmit.map((m) =>
        fetchAddPrescriptionDetail({
          quantity: m.quantity,
          uses: m.uses,
          prescribing: prescribingId,
          medicine_unit: m.id,
        })
      )
    );

    const detailRes = await fetchGetPrescriptionDetailById(prescribingId);
    if (detailRes.status !== 200) {
      return { success: true, newPrescribing: res.data, newestPrescriptionDetail: [] };
    }

    return {
      success: true,
      newPrescribing: res.data,
      newestPrescriptionDetail: Array.isArray(detailRes.data) ? detailRes.data : [],
    };
  } catch (err) {
    return { success: false, error: err?.message || "create_failed" };
  }
}

import {
  fetchBulkPayment,
  fetchMomoPaymentURL,
} from "../../../common/components/card/BillCard/services";

/**
 * Thanh toán trực tiếp (bulk payment). Service thuần, không toast/confirm.
 * @param {number} diagnosisId
 * @returns {Promise<{ success: boolean, status?: number }>}
 */
export async function executeBulkPayment(diagnosisId) {
  try {
    const res = await fetchBulkPayment({ diagnosisID: diagnosisId });
    // Accept both 201 (created) and 200 (all bills already exist) as success
    return { success: res.status === 201 || res.status === 200, status: res.status };
  } catch (error) {
    console.error('Error in executeBulkPayment:', error);
    return { success: false, status: error.response?.status };
  }
}

/**
 * Lấy URL thanh toán Momo, redirect do caller xử lý.
 * @param {number} diagnosisId
 * @returns {Promise<{ success: boolean, payUrl?: string }>}
 */
export async function getMomoPaymentUrl(diagnosisId) {
  const res = await fetchMomoPaymentURL({ diagnosisID: diagnosisId });
  if (res.status === 200 && res.data?.payUrl) {
    return { success: true, payUrl: res.data.payUrl };
  }
  return { success: false };
}

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
  const res = await fetchBulkPayment({ diagnosisID: diagnosisId });
  return { success: res.status === 201, status: res.status };
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

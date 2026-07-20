import { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE } from '../constants';

/**
 * Kiểm tra user có role nằm trong danh sách roles cho phép không.
 * @param {{ role: string } | null} user
 * @param {string[]} allowedRoles
 * @returns {boolean}
 */
export function isRoleIn(user, allowedRoles) {
  if (!user?.role || !Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(user.role);
}

/**
 * User có thể xem danh sách examination (doctor hoặc nurse).
 * @param {{ role: string } | null} user
 * @returns {boolean}
 */
export function canViewExaminationList(user) {
  return isRoleIn(user, [ROLE_DOCTOR, ROLE_NURSE]);
}

/**
 * Bác sĩ có thể chẩn đoán examination này (phải là owner: user.id === doctor_id).
 * @param {{ id: number, role: string } | null} user
 * @param {{ schedule_appointment?: { doctor_id: number } } | null} examination
 * @returns {boolean}
 */
export function canDiagnose(user, examination) {
  if (!user?.id || user.role !== ROLE_DOCTOR) return false;
  const doctorId = examination?.schedule_appointment?.doctor_id;
  return doctorId != null && user.id === doctorId;
}

/**
 * Bác sĩ có thể kê toa cho diagnosis này (phải là owner của examination).
 * @param {{ id: number, role: string } | null} user
 * @param {{ examination?: { schedule_appointment?: { doctor_id: number } } } | null} diagnosedInfo
 * @returns {boolean}
 */
export function canPrescribe(user, diagnosedInfo) {
  if (!user?.id || user.role !== ROLE_DOCTOR) return false;
  const doctorId = diagnosedInfo?.examination?.schedule_appointment?.doctor_id;
  return doctorId != null && user.id === doctorId;
}

/**
 * User có quyền vào trang thanh toán và thực hiện thanh toán (nurse).
 * @param {{ role: string } | null} user
 * @returns {boolean}
 */
export function canViewPayments(user) {
  return user?.role === ROLE_NURSE;
}

/**
 * True when bill_status payload means payment collected.
 * Supports legacy `{id, amount}` (no status) and S2 `{id, amount, status}`.
 * @param {{ status?: string } | null | undefined | boolean} billStatus
 * @returns {boolean}
 */
export function isBillPaid(billStatus) {
  if (billStatus == null || billStatus === false) return false;
  if (typeof billStatus === "object") {
    if (billStatus.status) return billStatus.status === "paid";
    return true; // legacy shape without status = paid existence
  }
  return Boolean(billStatus);
}

/**
 * Hiển thị nút thanh toán (Momo / Pay) trên PrescriptionDetailCard: nurse và chưa thanh toán.
 * @param {{ role: string } | null} user
 * @param {{ status?: string } | null | undefined | boolean} billStatus
 * @returns {boolean}
 */
export function canShowPaymentButtons(user, billStatus) {
  return user?.role === ROLE_NURSE && !isBillPaid(billStatus);
}

/**
 * Hiển thị nút in cho bác sĩ trên PrescriptionDetailCard.
 * @param {{ role: string } | null} user
 * @returns {boolean}
 */
export function canShowPrintButton(user) {
  return user?.role === ROLE_DOCTOR;
}

/**
 * Nurse có thể gửi email xác nhận (khi mail_status false).
 * @param {{ role: string } | null} user
 * @returns {boolean}
 */
export function canSendConfirmEmail(user) {
  return user?.role === ROLE_NURSE;
}

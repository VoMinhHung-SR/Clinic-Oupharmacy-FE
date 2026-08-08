import { ROLE_ADMIN, ROLE_DOCTOR, ROLE_NURSE, ROLE_USER } from '../constants';

/**
 * Business dashboard admin (Clinic FE). BE flag `is_admin`.
 * Superuser may also use FE but Jazzmin (/admin) is is_superuser-only.
 */
export function isBusinessAdmin(user) {
  return Boolean(user?.is_admin) || Boolean(user?.is_superuser);
}

/**
 * FE effective role: is_admin (on ROLE_USER) → ROLE_ADMIN. Doctor/nurse unchanged.
 * @param {{ role?: string, is_admin?: boolean, is_superuser?: boolean } | null} user
 * @returns {string | null}
 */
export function getEffectiveRole(user) {
  if (!user) return null;
  if (isBusinessAdmin(user) && (!user.role || user.role === ROLE_USER)) {
    return ROLE_ADMIN;
  }
  return user.role || null;
}

/** Persist ROLE_ADMIN on client session when is_admin; keep DB role in role_db. */
export function normalizeClientUser(user) {
  if (!user) return user;
  const role = getEffectiveRole(user);
  if (role === user.role) return user;
  return { ...user, role_db: user.role ?? null, role };
}

export function getPostLoginPath(user) {
  const role = getEffectiveRole(user);
  if (role === ROLE_ADMIN || role === ROLE_DOCTOR || role === ROLE_NURSE) {
    return '/dashboard';
  }
  return '/';
}

/**
 * Kiểm tra user có role nằm trong danh sách roles cho phép không.
 * @param {{ role: string } | null} user
 * @param {string[]} allowedRoles
 * @returns {boolean}
 */
export function isRoleIn(user, allowedRoles) {
  const role = getEffectiveRole(user);
  if (!role || !Array.isArray(allowedRoles)) return false;
  return allowedRoles.includes(role);
}

/**
 * User có thể xem danh sách examination (doctor hoặc nurse).
 * @param {{ role: string } | null} user
 * @returns {boolean}
 */
export function canViewExaminationList(user) {
  return isRoleIn(user, [ROLE_DOCTOR, ROLE_NURSE, ROLE_ADMIN]);
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
 * Thanh toán: y tá hoặc business admin (ops). Không thay bác sĩ kê toa.
 * @param {{ role?: string, is_admin?: boolean, is_superuser?: boolean } | null} user
 * @returns {boolean}
 */
export function canViewPayments(user) {
  return getEffectiveRole(user) === ROLE_NURSE || isBusinessAdmin(user);
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
 * Hiển thị nút thanh toán (Momo / Pay): y tá hoặc business admin, chưa thanh toán.
 * @param {{ role?: string, is_admin?: boolean, is_superuser?: boolean } | null} user
 * @param {{ status?: string } | null | undefined | boolean} billStatus
 * @returns {boolean}
 */
export function canShowPaymentButtons(user, billStatus) {
  return canViewPayments(user) && !isBillPaid(billStatus);
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
 * Gửi email xác nhận lịch: y tá hoặc business admin (ops).
 * @param {{ role?: string, is_admin?: boolean, is_superuser?: boolean } | null} user
 * @returns {boolean}
 */
export function canSendConfirmEmail(user) {
  return getEffectiveRole(user) === ROLE_NURSE || isBusinessAdmin(user);
}

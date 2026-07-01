/** Dev-only opt-in mock submit — bật: localStorage.setItem("prescribing:mock-submit", "1"); tắt: "0" hoặc removeItem */
export const PRESCRIBING_MOCK_SUBMIT_KEY = "prescribing:mock-submit"

export function isPrescribingMockSubmitEnabled() {
  if (!import.meta.env.DEV) return false
  try {
    return localStorage.getItem(PRESCRIBING_MOCK_SUBMIT_KEY) === "1"
  } catch {
    return false
  }
}

export function setPrescribingMockSubmitEnabled(enabled) {
  if (!import.meta.env.DEV) return
  try {
    if (enabled) {
      localStorage.setItem(PRESCRIBING_MOCK_SUBMIT_KEY, "1")
    } else {
      localStorage.removeItem(PRESCRIBING_MOCK_SUBMIT_KEY)
    }
  } catch {
    // ignore
  }
}

const buildMockDetailRows = (medicinesSubmit) => {
  const created = new Date().toISOString()
  return medicinesSubmit.map((m, index) => ({
    id: 99000 + index,
    uses: m.uses,
    quantity: m.quantity,
    created_date: created,
    item_name_snapshot: m.medicineName,
    unit_name_snapshot: m.packaging ?? "",
    unit_price_snapshot: Number(m.unitPrice) || 0,
  }))
}

/**
 * @returns {Promise<import("../../../modules/pages/PrescriptionDetailComponents/services/prescribingActions").CreatePrescribingResult>}
 */
export async function mockCreatePrescribingWithDetails(userId, diagnosisId, medicinesSubmit) {
  await new Promise((resolve) => setTimeout(resolve, 450))

  if (!medicinesSubmit?.length) {
    return { success: false, error: "empty_medicines" }
  }

  const created = new Date().toISOString()
  const prescribingId = 99999

  return {
    success: true,
    newPrescribing: {
      id: prescribingId,
      user: userId,
      diagnosis: parseInt(diagnosisId, 10),
      created_date: created,
    },
    newestPrescriptionDetail: buildMockDetailRows(medicinesSubmit),
  }
}

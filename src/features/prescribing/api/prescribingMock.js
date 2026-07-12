/** Dev-only opt-in mock submit — bật sau khi load: localStorage.setItem("prescribing:mock-submit", "1"); tắt: disableAllPrescribingMocks() */
export const PRESCRIBING_MOCK_SUBMIT_KEY = "prescribing:mock-submit"

/** Dev-only mock L1 diagnosis suggestions — bật sau khi load: localStorage.setItem("prescribing:mock-diagnosis-suggestions", "1") */
export const PRESCRIBING_MOCK_DIAGNOSIS_SUGGESTIONS_KEY = "prescribing:mock-diagnosis-suggestions"

/** Dev-only mock thuốc hay kê — bật riêng hoặc dùng chung key diagnosis mock */
export const PRESCRIBING_MOCK_MEDICINE_PREFS_KEY = "prescribing:mock-medicine-prefs"

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

export function isPrescribingMockDiagnosisSuggestionsEnabled() {
  if (!import.meta.env.DEV) return false
  try {
    return localStorage.getItem(PRESCRIBING_MOCK_DIAGNOSIS_SUGGESTIONS_KEY) === "1"
  } catch {
    return false
  }
}

export function setPrescribingMockDiagnosisSuggestionsEnabled(enabled) {
  if (!import.meta.env.DEV) return
  try {
    if (enabled) {
      localStorage.setItem(PRESCRIBING_MOCK_DIAGNOSIS_SUGGESTIONS_KEY, "1")
    } else {
      localStorage.removeItem(PRESCRIBING_MOCK_DIAGNOSIS_SUGGESTIONS_KEY)
    }
  } catch {
    // ignore
  }
}

const mockSuggestionVariant = (id, name, packing) => {
  const unitId = id * 10
  return {
    id,
    product_name: name,
    packing,
    packaging: packing,
    in_stock: 48,
    price_value: 18500,
    is_published: true,
    active: true,
    product: { id: 88000 + id, name, web_name: name },
    default_unit_id: unitId,
    default_unit_name: packing,
    unit_options: [
      {
        id: unitId,
        unit_name: packing,
        quantity_in_base: 1,
        price_value: 18500,
        is_default: true,
        is_published: true,
      },
    ],
  }
}

export function isPrescribingMockMedicinePrefsEnabled() {
  if (!import.meta.env.DEV) return false
  try {
    return (
      localStorage.getItem(PRESCRIBING_MOCK_MEDICINE_PREFS_KEY) === "1" ||
      localStorage.getItem(PRESCRIBING_MOCK_DIAGNOSIS_SUGGESTIONS_KEY) === "1"
    )
  } catch {
    return false
  }
}

export function setPrescribingMockMedicinePrefsEnabled(enabled) {
  if (!import.meta.env.DEV) return
  try {
    if (enabled) {
      localStorage.setItem(PRESCRIBING_MOCK_MEDICINE_PREFS_KEY, "1")
    } else {
      localStorage.removeItem(PRESCRIBING_MOCK_MEDICINE_PREFS_KEY)
    }
  } catch {
    // ignore
  }
}

/** Clears all prescribing mock localStorage flags (dev-only). */
export function disableAllPrescribingMocks() {
  setPrescribingMockSubmitEnabled(false)
  setPrescribingMockDiagnosisSuggestionsEnabled(false)
  setPrescribingMockMedicinePrefsEnabled(false)
}

if (import.meta.env.DEV) {
  disableAllPrescribingMocks()
}

const mockPrefEntry = (id, name, packing, { frequent = true } = {}) => {
  const unitId = id * 10
  return {
    product_variant_id: id,
    product_variant_unit_id: unitId,
    uses: "1 viên x 2 lần/ngày",
    quantity: 1,
    prescribe_count: 20 - (id % 88000),
    last_prescribed_at: new Date().toISOString(),
    variant: mockSuggestionVariant(id, name, packing),
    ...(frequent ? {} : {}),
  }
}

const MOCK_MEDICINE_NAMES = [
  ["Paracetamol 500mg", "Vỉ"],
  ["Alpha Choay", "Hộp"],
  ["Cefuroxime 500mg", "Hộp"],
  ["Amoxicillin 500mg", "Hộp"],
  ["Vitamin C 500mg", "Lọ"],
  ["Oresol", "Gói"],
  ["Smecta", "Hộp"],
  ["Decolgen", "Vỉ"],
  ["Berberin", "Lọ"],
  ["Aspirin 81mg", "Vỉ"],
]

const buildMockMedicinePrefs = () => {
  const frequent = MOCK_MEDICINE_NAMES.map(([name, packing], index) =>
    mockPrefEntry(88001 + index, name, packing)
  )
  return { frequent, recent: [] }
}

/**
 * @returns {Promise<{ data: { frequent: object[], recent: object[] } }>}
 */
export async function mockFetchPrescriberMedicinePrefs() {
  await new Promise((resolve) => setTimeout(resolve, 200))
  return { data: buildMockMedicinePrefs() }
}

const MOCK_DIAGNOSIS_SUGGESTION_ROWS = [
  {
    product_variant_id: 99001,
    product_variant_unit_id: 990010,
    uses: "1 viên x 3 lần/ngày",
    quantity: 2,
    prefill_allowed: true,
    match_score: 0.94,
    prescribe_count: 12,
    source: "doctor_history",
    variant: mockSuggestionVariant(99001, "Paracetamol 500mg", "Vỉ"),
  },
  {
    product_variant_id: 99002,
    product_variant_unit_id: 990020,
    uses: "1 viên x 2 lần/ngày",
    quantity: 1,
    prefill_allowed: true,
    match_score: 0.88,
    prescribe_count: 7,
    source: "doctor_history",
    variant: mockSuggestionVariant(99002, "Alpha Choay", "Hộp"),
  },
  {
    product_variant_id: 99003,
    product_variant_unit_id: 990030,
    uses: "1 viên x 2 lần/ngày sau ăn",
    quantity: 1,
    prefill_allowed: true,
    match_score: 0.81,
    prescribe_count: 4,
    source: "clinic_history",
    variant: mockSuggestionVariant(99003, "Cefuroxime 500mg", "Hộp"),
  },
]

/**
 * @returns {Promise<{ data: object }>}
 */
export async function mockFetchDiagnosisMedicineSuggestions(diagnosisId) {
  await new Promise((resolve) => setTimeout(resolve, 280))
  const id = Number(diagnosisId) || 0
  return {
    data: {
      diagnosis: id
        ? { id, sign: "Demo", diagnosed: "Demo", updated_at: new Date().toISOString() }
        : null,
      suggestions: MOCK_DIAGNOSIS_SUGGESTION_ROWS.map((row) => ({
        ...row,
        last_prescribed_at: new Date().toISOString(),
      })),
      meta: {
        scope: "mixed",
        matched_diagnoses: 3,
        clinic_matched_diagnoses: 1,
        clinic_fallback_used: true,
      },
    },
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

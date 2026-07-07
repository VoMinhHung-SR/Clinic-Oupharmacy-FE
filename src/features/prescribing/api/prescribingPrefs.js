import { authApi, endpoints } from "../../../config/APIs"
import {
  isPrescribingMockDiagnosisSuggestionsEnabled,
  isPrescribingMockMedicinePrefsEnabled,
  mockFetchDiagnosisMedicineSuggestions,
  mockFetchPrescriberMedicinePrefs,
} from "./prescribingMock"

/** Per-doctor frequent/recent medicines with store-hydrated variants (BE-1). */
export const fetchPrescriberMedicinePrefs = () => {
  if (isPrescribingMockMedicinePrefsEnabled()) {
    return mockFetchPrescriberMedicinePrefs()
  }
  return authApi().get(endpoints["prescribing-medicine-prefs"])
}

/** Diagnosis-aware suggestions from doctor prescribing history (Phase 2 P0). */
export const fetchDiagnosisMedicineSuggestions = (diagnosisId) => {
  if (isPrescribingMockDiagnosisSuggestionsEnabled()) {
    return mockFetchDiagnosisMedicineSuggestions(diagnosisId)
  }
  return authApi().get(endpoints["prescribing-medicine-suggestions"], {
    params: { diagnosis_id: diagnosisId },
  })
}

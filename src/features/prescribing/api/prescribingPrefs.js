import { authApi, endpoints } from "../../../config/APIs"

/** Per-doctor frequent/recent medicines with store-hydrated variants (BE-1). */
export const fetchPrescriberMedicinePrefs = () =>
  authApi().get(endpoints["prescribing-medicine-prefs"])

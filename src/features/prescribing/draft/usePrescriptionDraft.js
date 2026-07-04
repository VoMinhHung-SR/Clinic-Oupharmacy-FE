import { useCallback, useState } from "react"
import { mergeVariantIntoDraftLines } from "./draftLine"

/**
 * Store-native prescribing draft lines (one row per variant + sale unit).
 * Context/provider wires toasts and submit; this hook owns draft state only.
 */
export default function usePrescriptionDraft() {
  const [draftLines, setDraftLines] = useState([])
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const addFromVariant = useCallback((medicineUnit, data) => {
    let result = { ok: false, reason: "unknown" }
    setDraftLines((prev) => {
      result = mergeVariantIntoDraftLines(prev, medicineUnit, data)
      return result.ok ? result.lines : prev
    })
    if (result.ok) setHasUnsavedChanges(true)
    return result
  }, [])

  const removeLine = useCallback((variantId) => {
    setDraftLines((prev) => prev.filter((item) => item.id !== variantId))
    setHasUnsavedChanges(true)
  }, [])

  const updateLine = useCallback((variantId, payload) => {
    setDraftLines((prev) =>
      prev.map((item) => (item.id === variantId ? { ...item, ...payload } : item))
    )
    setHasUnsavedChanges(true)
  }, [])

  const replaceLines = useCallback((updatedData) => {
    if (!updatedData?.length) {
      setDraftLines([])
      setHasUnsavedChanges(false)
      return
    }
    setDraftLines((prev) =>
      prev
        .map((item) => {
          const match = updatedData.find((u) => u.id === item.id)
          return match ? { ...item, ...match } : null
        })
        .filter(Boolean)
    )
    setHasUnsavedChanges(true)
  }, [])

  const clearDraft = useCallback(() => {
    setHasUnsavedChanges(false)
    setDraftLines([])
  }, [])

  const resetAfterSubmit = useCallback(() => {
    setHasUnsavedChanges(false)
    setDraftLines([])
  }, [])

  return {
    draftLines,
    /** @deprecated use draftLines — kept for PrescribingContext consumers */
    medicinesSubmit: draftLines,
    setDraftLines,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    addFromVariant,
    removeLine,
    updateLine,
    replaceLines,
    clearDraft,
    resetAfterSubmit,
  }
}

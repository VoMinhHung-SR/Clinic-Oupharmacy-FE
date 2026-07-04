import { useCallback, useEffect, useState } from "react"
import { fetchDiagnosisMedicineSuggestions } from "../../api/prescribingPrefs"
import { normalizeStoreVariant } from "../../model/mapStoreVariant"

const mapSuggestionEntry = (entry) => ({
  ...entry,
  variant: entry?.variant ? normalizeStoreVariant(entry.variant) : null,
})

/**
 * Loads diagnosis-aware medicine suggestions; refetches on tab focus (P0d).
 */
export default function useDiagnosisMedicineSuggestions({ diagnosisId, enabled = true } = {}) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)

  const load = useCallback(async () => {
    if (!enabled || !diagnosisId) {
      setSuggestions([])
      setMeta(null)
      return
    }
    setLoading(true)
    try {
      const res = await fetchDiagnosisMedicineSuggestions(diagnosisId)
      const data = res?.data ?? {}
      setSuggestions(
        (data.suggestions || []).map(mapSuggestionEntry).filter((e) => e.variant)
      )
      setMeta(data.meta ?? null)
    } catch {
      setSuggestions([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }, [diagnosisId, enabled])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!enabled || !diagnosisId) return undefined

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        load()
      }
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => document.removeEventListener("visibilitychange", onVisible)
  }, [diagnosisId, enabled, load])

  return { suggestions, loading, meta, refetch: load }
}

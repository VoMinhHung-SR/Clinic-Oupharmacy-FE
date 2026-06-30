import { useEffect, useState } from "react"
import { fetchStoreCategories } from "../../api/storeCatalog"

/**
 * Store category tree (level0 → level1 → level2) — same source as oupharmacy-store nav.
 */
const useStoreCategoryTree = ({ enabled = true } = {}) => {
  const [tree, setTree] = useState([])
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return undefined
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetchStoreCategories()
        if (cancelled) return
        if (res.status === 200) {
          setTree(Array.isArray(res.data) ? res.data : [])
        } else {
          setTree([])
        }
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setTree([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [enabled])

  return { tree, loading, error }
}

export default useStoreCategoryTree

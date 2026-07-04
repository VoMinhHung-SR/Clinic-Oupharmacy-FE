import { useEffect, useMemo, useState } from "react"
import { fetchStoreCategories } from "../../../../features/prescribing/api/storeCatalog"

/** Flatten store category tree (level0 → level1 → level2) for read-only admin table. */
export const flattenStoreCategoryTree = (tree = []) => {
  const rows = []
  for (const root of tree) {
    rows.push({
      id: root.id,
      name: root.name,
      level: 0,
      path: root.name,
    })
    for (const l1 of root.level1 ?? []) {
      rows.push({
        id: l1.id,
        name: l1.name,
        level: 1,
        path: `${root.name} / ${l1.name}`,
      })
      for (const l2 of l1.level2 ?? []) {
        rows.push({
          id: l2.id,
          name: l2.name,
          level: 2,
          path: `${root.name} / ${l1.name} / ${l2.name}`,
        })
      }
    }
  }
  return rows
}

/**
 * Store categories (read-only) — same SoT as prescribing catalog / oupharmacy-store.
 */
const useCategory = () => {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setIsLoading(true)
      try {
        const res = await fetchStoreCategories()
        if (cancelled) return
        if (res.status === 200) {
          const tree = Array.isArray(res.data) ? res.data : []
          setCategories(flattenStoreCategoryTree(tree))
        } else {
          setCategories([])
        }
      } catch {
        if (!cancelled) setCategories([])
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const readOnlyNote = useMemo(
    () => ({ source: "store", writable: false }),
    []
  )

  return {
    categories,
    isLoading,
    readOnlyNote,
  }
}

export default useCategory

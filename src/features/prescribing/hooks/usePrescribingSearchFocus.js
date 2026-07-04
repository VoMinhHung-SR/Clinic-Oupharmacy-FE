import { useEffect, useRef } from "react"

function isEditableTarget(target) {
  if (!target || !(target instanceof HTMLElement)) return false
  const tag = target.tagName
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true
  return target.isContentEditable
}

/**
 * Press `/` to focus catalog search (when not typing in another field).
 */
export function usePrescribingSearchFocus(inputRef) {
  const fallbackRef = useRef(null)
  const ref = inputRef ?? fallbackRef

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey) return
      if (isEditableTarget(document.activeElement)) return
      e.preventDefault()
      const el = ref.current
      if (el && typeof el.focus === "function") {
        el.focus()
        if (typeof el.select === "function") el.select()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [ref])

  return ref
}

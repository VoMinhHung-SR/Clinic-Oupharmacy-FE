import { useCallback, useEffect, useRef, useState } from "react"
import {
  Box,
  ClickAwayListener,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  TextField,
  Typography,
} from "@mui/material"
import ClearIcon from "@mui/icons-material/Clear"
import SearchIcon from "@mui/icons-material/Search"
import StarIcon from "@mui/icons-material/Star"
import { useTranslation } from "react-i18next"
import SearchResultSkeleton from "./SearchResultSkeleton"
import useDebounce from "../../../lib/hooks/useDebounce"
import { fetchStoreSearch } from "../api/storeCatalog"
import { getVariantDisplayName } from "../../../lib/adapters/storeProduct"
import { PRESCRIBING_MIN_SEARCH_LEN, PRESCRIBING_PAGE_SIZE, PRESCRIBING_SEARCH_DEBOUNCE_MS } from "../constants"

export default function SearchCombobox({
  keyword,
  onKeywordChange,
  inputRef,
  frequentVariantIds,
  boostVariants,
  onSelectVariant,
  categoryId,
}) {
  const { t } = useTranslation(["medicine"])
  const anchorRef = useRef(null)
  const listRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const requestIdRef = useRef(0)

  const debouncedKw = useDebounce((keyword || "").trim(), PRESCRIBING_SEARCH_DEBOUNCE_MS)
  const trimmedKw = (keyword || "").trim()
  const isSearchActive = trimmedKw.length >= PRESCRIBING_MIN_SEARCH_LEN
  const isDebouncing = isSearchActive && trimmedKw !== debouncedKw
  const showResultsLoading = loading || isDebouncing

  const loadOptions = useCallback(async () => {
    const q = debouncedKw
    if (q.length < PRESCRIBING_MIN_SEARCH_LEN) {
      setOptions([])
      setOpen(false)
      return
    }

    const reqId = ++requestIdRef.current
    setLoading(true)
    try {
      const params = {
        q,
        page: 1,
        page_size: PRESCRIBING_PAGE_SIZE,
        sort: "relevance",
      }
      if (categoryId) params.category = categoryId

      const res = await fetchStoreSearch(params)
      if (reqId !== requestIdRef.current) return

      const items = res?.data?.items ?? res?.data?.results ?? []
      const boosted = boostVariants ? boostVariants(items) : items
      setOptions(boosted.slice(0, 10))
      setOpen(boosted.length > 0)
      setHighlightIndex(boosted.length > 0 ? 0 : -1)
    } catch {
      if (reqId === requestIdRef.current) {
        setOptions([])
        setOpen(false)
      }
    } finally {
      if (reqId === requestIdRef.current) setLoading(false)
    }
  }, [debouncedKw, categoryId, boostVariants])

  useEffect(() => {
    loadOptions()
  }, [loadOptions])

  const selectOption = useCallback(
    (variant) => {
      if (!variant) return
      setOpen(false)
      onSelectVariant(variant)
    },
    [onSelectVariant]
  )

  const handleKeyDown = (e) => {
    if (!open || options.length === 0) {
      if (e.key === "ArrowDown" && debouncedKw.length >= PRESCRIBING_MIN_SEARCH_LEN) {
        setOpen(true)
      }
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setHighlightIndex((i) => Math.min(i + 1, options.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setHighlightIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && options[highlightIndex]) {
        e.preventDefault()
        selectOption(options[highlightIndex])
      }
    } else if (e.key === "Escape") {
      e.preventDefault()
      setOpen(false)
    }
  }

  useEffect(() => {
    if (!listRef.current || highlightIndex < 0) return
    const el = listRef.current.querySelector(`[data-option-index="${highlightIndex}"]`)
    el?.scrollIntoView({ block: "nearest" })
  }, [highlightIndex])

  const handleClear = () => {
    onKeywordChange("")
    setOpen(false)
    setOptions([])
    setHighlightIndex(-1)
    inputRef?.current?.focus()
  }

  const showClear = trimmedKw.length > 0

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <Box ref={anchorRef} sx={{ position: "relative", mb: 1 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          inputRef={inputRef}
          value={keyword ?? ""}
          onChange={(e) => {
            onKeywordChange(e.target.value)
            if (e.target.value.trim().length >= PRESCRIBING_MIN_SEARCH_LEN) {
              setOpen(true)
            }
          }}
          onFocus={() => {
            if (options.length > 0) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={t("medicine:searchPlaceholder")}
          autoComplete="off"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls="prescribing-search-listbox"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: showClear ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  edge="end"
                  onClick={handleClear}
                  aria-label={t("medicine:clearSearch")}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: { bgcolor: "background.paper", borderRadius: 1 },
          }}
          inputProps={{
            "aria-label": t("medicine:search"),
            title: t("medicine:searchKeyboardHint"),
          }}
        />

        <Popper
          open={open && isSearchActive}
          anchorEl={anchorRef.current}
          placement="bottom-start"
          style={{ zIndex: 1300, width: anchorRef.current?.offsetWidth }}
        >
          <Paper elevation={4} sx={{ maxHeight: 280, overflow: "auto", mt: 0.5 }}>
            {showResultsLoading && <SearchResultSkeleton rows={4} />}
            {!showResultsLoading && options.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ p: 1.5 }}>
                {t("medicine:catalogNoResults")}
              </Typography>
            )}
            {!showResultsLoading && options.length > 0 && (
              <List
                dense
                disablePadding
                id="prescribing-search-listbox"
                role="listbox"
                ref={listRef}
              >
                {options.map((variant, index) => {
                  const name = getVariantDisplayName(variant) || "—"
                  const packaging = variant.packaging || variant.packing || ""
                  const variantCount = Number(variant.variant_count ?? 1)
                  const secondaryParts = [
                    packaging,
                    variantCount > 1 ? t("medicine:variantCount", { count: variantCount }) : null,
                  ].filter(Boolean)
                  const isFrequent = frequentVariantIds?.has(variant.id)
                  return (
                    <ListItemButton
                      key={variant.id}
                      data-option-index={index}
                      role="option"
                      aria-selected={index === highlightIndex}
                      selected={index === highlightIndex}
                      onMouseEnter={() => setHighlightIndex(index)}
                      onClick={() => selectOption(variant)}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            {isFrequent && <StarIcon sx={{ fontSize: 14, color: "warning.main" }} />}
                            <span>{name}</span>
                          </Box>
                        }
                        secondary={secondaryParts.length ? secondaryParts.join(" · ") : undefined}
                      />
                    </ListItemButton>
                  )
                })}
              </List>
            )}
          </Paper>
        </Popper>
      </Box>
    </ClickAwayListener>
  )
}

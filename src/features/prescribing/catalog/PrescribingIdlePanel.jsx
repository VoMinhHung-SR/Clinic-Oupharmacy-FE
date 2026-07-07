import { Box } from "@mui/material"
import CatalogEmptyState from "./CatalogEmptyState"
import PersonalMedicineDock from "./PersonalMedicineDock"
import { mergeQuickAccessEntries } from "./mergeQuickAccessEntries"

export default function PrescribingIdlePanel({
  prefs,
  prefsLoading,
  onSelectEntry,
  l2ExcludeVariantIds,
  quickAddActive = false,
}) {
  const { frequent = [], recent = [] } = prefs ?? {}
  const merged = mergeQuickAccessEntries(frequent, recent)
  const excludeSet =
    l2ExcludeVariantIds instanceof Set ? l2ExcludeVariantIds : new Set(l2ExcludeVariantIds ?? [])
  const personalCount = excludeSet.size
    ? merged.filter((e) => !excludeSet.has(e.product_variant_id)).length
    : merged.length
  const showDock = prefsLoading || personalCount > 0

  return (
    <Box
      sx={{
        width: "100%",
        flex: quickAddActive ? "0 0 auto" : 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: quickAddActive ? "0 0 auto" : 1,
          display: "flex",
          alignItems: "stretch",
          justifyContent: "flex-start",
          alignSelf: "stretch",
          minHeight: quickAddActive ? 0 : undefined,
          width: "100%",
        }}
      >
        <CatalogEmptyState variant="idle" compact centered shortHint fullWidth />
      </Box>

      {showDock ? (
        <PersonalMedicineDock
          prefs={prefs}
          loading={prefsLoading}
          onSelectEntry={onSelectEntry}
          excludeVariantIds={l2ExcludeVariantIds}
        />
      ) : null}
    </Box>
  )
}

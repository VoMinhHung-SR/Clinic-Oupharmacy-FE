import { Box } from "@mui/material"
import CatalogEmptyState from "./CatalogEmptyState"
import PersonalMedicineDock from "./PersonalMedicineDock"
import { mergeQuickAccessEntries } from "./mergeQuickAccessEntries"

export default function PrescribingIdlePanel({
  prefs,
  prefsLoading,
  onSelectEntry,
  l2ExcludeVariantIds,
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
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 1.5, sm: 2 },
          py: 2,
        }}
      >
        <CatalogEmptyState variant="idle" compact centered shortHint fullWidth />
      </Box>

      {showDock ? (
        <PersonalMedicineDock
          embedded
          prefs={prefs}
          loading={prefsLoading}
          onSelectEntry={onSelectEntry}
          excludeVariantIds={l2ExcludeVariantIds}
        />
      ) : null}
    </Box>
  )
}

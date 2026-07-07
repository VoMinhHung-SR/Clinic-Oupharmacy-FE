import { useMemo, useState } from "react"
import { Box, Collapse, Paper, Skeleton, Stack, Typography } from "@mui/material"
import StarIcon from "@mui/icons-material/Star"
import { useTranslation } from "react-i18next"
import MedicineQuickAccess from "./MedicineQuickAccess"
import { mergeQuickAccessEntries } from "./mergeQuickAccessEntries"
import { prescribingDockTopRadiusSx, prescribingPillRadius } from "../layout/prescribingChrome"

/**
 * Bottom dock — full-bleed, top-rounded only; expands personal quick-access chips.
 */
export default function PersonalMedicineDock({
  prefs,
  loading,
  onSelectEntry,
  excludeVariantIds = [],
  embedded = false,
}) {
  const { t } = useTranslation(["medicine"])
  const [open, setOpen] = useState(false)

  const excludeSet = useMemo(
    () => (excludeVariantIds instanceof Set ? excludeVariantIds : new Set(excludeVariantIds)),
    [excludeVariantIds]
  )

  const suggestions = useMemo(() => {
    const { frequent = [], recent = [] } = prefs ?? {}
    const merged = mergeQuickAccessEntries(frequent, recent)
    if (!excludeSet.size) return merged
    return merged.filter((e) => !excludeSet.has(e.product_variant_id))
  }, [prefs, excludeSet])

  const hasPersonal = !loading && suggestions.length > 0

  if (!loading && !hasPersonal) {
    return null
  }

  return (
    <Paper
      elevation={0}
      square={false}
      sx={{
        flexShrink: 0,
        mt: "auto",
        width: "100%",
        overflow: "hidden",
        borderTop: 1,
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
        borderColor: "divider",
        ...prescribingDockTopRadiusSx,
        bgcolor: "background.paper",
        boxShadow: open ? "0 -4px 12px rgba(0,0,0,0.06)" : "none",
      }}
    >
      <Box
        component="button"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={
          open ? t("medicine:personalDockCollapse") : t("medicine:personalDockExpand")
        }
        sx={{
          width: "100%",
          border: 0,
          cursor: "pointer",
          bgcolor: "background.paper",
          px: 2,
          py: 1.25,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.75,
          ...prescribingDockTopRadiusSx,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 4,
            borderRadius: prescribingPillRadius,
            bgcolor: "action.selected",
          }}
          aria-hidden
        />

        <Stack direction="row" alignItems="flex-start" spacing={0.75} sx={{ width: "100%", minWidth: 0 }}>
          <StarIcon sx={{ fontSize: 18, color: "warning.main", flexShrink: 0, mt: 0.15 }} aria-hidden />
          <Box sx={{ flex: 1, minWidth: 0, textAlign: "left" }}>
            <Typography variant="body2" fontWeight={700} color="text.primary" lineHeight={1.35}>
              {t("medicine:quickAccessPersonal")}
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", lineHeight: 1.35, mt: 0.15 }}
            >
              {loading ? t("medicine:quickAccessLoading") : t("medicine:personalDockNote")}
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Collapse
        in={open}
        timeout={200}
        sx={{ "& .MuiCollapse-wrapperInner": { width: "100%" } }}
      >
        <Box
          sx={{
            px: 2,
            pt: 1.25,
            pb: 1.5,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {loading ? (
            <Stack direction="row" flexWrap="wrap" gap={0.75} useFlexGap>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} variant="rounded" width={110} height={30} sx={{ borderRadius: prescribingPillRadius }} />
              ))}
            </Stack>
          ) : (
            <MedicineQuickAccess
              embedded
              hideTitle
              prefs={prefs}
              loading={false}
              onSelectEntry={onSelectEntry}
              excludeVariantIds={excludeVariantIds}
            />
          )}
        </Box>
      </Collapse>
    </Paper>
  )
}

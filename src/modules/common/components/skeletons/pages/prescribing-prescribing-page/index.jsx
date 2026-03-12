import { Box, Paper, Skeleton, useTheme } from "@mui/material"
import PrescriptionDetailLayout from "../../../../../pages/PrescriptionDetailComponents/layout"

export const HeaderSection = () => {
  const theme = useTheme()
  const spacing = (n) => theme.spacing(n)
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
      <Skeleton variant="text" sx={{ width: "60%", height: spacing(4.5), maxWidth: 320 }} />
      <Skeleton variant="rounded" sx={{ width: "30%", height: spacing(5), borderRadius: 2, maxWidth: 180 }} />
    </Box>
  )
}

export const ListSection = () => {
  const theme = useTheme()
  const spacing = (n) => theme.spacing(n)
  return (
    <Box sx={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <Box sx={{ flexShrink: 0, mb: 2 }}>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Skeleton variant="rectangular" sx={{ height: spacing(5), borderRadius: 1, flex: 1, maxWidth: "70%" }} />
          <Skeleton variant="rectangular" sx={{ width: spacing(5.5), height: spacing(5), borderRadius: 1, flexShrink: 0 }} />
          <Skeleton variant="rectangular" sx={{ width: "15%", minWidth: 80, height: spacing(5), borderRadius: 1, flexShrink: 0 }} />
        </Box>
        <Skeleton variant="text" sx={{ width: "100%", height: spacing(3), mt: 1.5 }} />
      </Box>
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25, borderBottom: 1, borderColor: "divider" }}>
            <Skeleton variant="rectangular" sx={{ width: spacing(5.5), height: spacing(5.5), borderRadius: 1, flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Skeleton variant="text" sx={{ width: "70%", height: spacing(2.5) }} />
              <Skeleton variant="text" sx={{ width: "40%", height: spacing(2), mt: 0.5 }} />
            </Box>
            <Skeleton variant="rectangular" sx={{ height: spacing(4), borderRadius: 1, width: spacing(7) }} />
            <Skeleton variant="circular" sx={{ width: spacing(4), height: spacing(4) }} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export const ListSectionRows = () => {
  const theme = useTheme()
  const spacing = (n) => theme.spacing(n)
  return (
    <Box>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5, py: 1.25, borderBottom: 1, borderColor: "divider" }}>
          <Skeleton variant="rectangular" sx={{ width: spacing(5.5), height: spacing(5.5), borderRadius: 1, flexShrink: 0 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Skeleton variant="text" sx={{ width: "70%", height: spacing(2.5) }} />
            <Skeleton variant="text" sx={{ width: "40%", height: spacing(2), mt: 0.5 }} />
          </Box>
          <Skeleton variant="rectangular" sx={{ height: spacing(4), borderRadius: 1, width: spacing(7) }} />
          <Skeleton variant="circular" sx={{ width: spacing(4), height: spacing(4) }} />
        </Box>
      ))}
    </Box>
  )
}

export const SidebarSection = () => {
  const theme = useTheme()
  const spacing = (n) => theme.spacing(n)
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box component={Paper} elevation={8} sx={{ p: 2.5, minHeight: spacing(45), boxShadow: 3 }}>
        <Skeleton variant="text" sx={{ width: "60%", height: spacing(3.5), mx: "auto", mb: 2 }} />
        <Skeleton variant="rectangular" sx={{ height: spacing(10), borderRadius: 1, mb: 2 }} />
        <Skeleton variant="rectangular" sx={{ height: spacing(12.5), borderRadius: 1, mb: 2 }} />
        <Skeleton variant="rectangular" sx={{ height: spacing(5), borderRadius: 1 }} />
      </Box>
    </Box>
  )
}

const CONTENT_HEIGHT_OFFSET_SPACING = 15

const SkeletonPrescribingPage = () => (
  <Box
    sx={{
      overflow: "hidden",
      height: (theme) => `calc(100vh - ${theme.spacing(CONTENT_HEIGHT_OFFSET_SPACING)})`,
      maxHeight: (theme) => `calc(100vh - ${theme.spacing(CONTENT_HEIGHT_OFFSET_SPACING)})`,
      display: "flex",
      flexDirection: "column",
      width: "100%",
    }}
  >
    <PrescriptionDetailLayout
      headerContent={<HeaderSection />}
      leftContent={<ListSection />}
      rightContent={<SidebarSection />}
    />
  </Box>
)

SkeletonPrescribingPage.ListSection = ListSection
SkeletonPrescribingPage.ListSectionRows = ListSectionRows
SkeletonPrescribingPage.SidebarSection = SidebarSection
SkeletonPrescribingPage.HeaderSection = HeaderSection

export default SkeletonPrescribingPage

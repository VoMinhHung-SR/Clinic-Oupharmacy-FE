import { Box, Paper, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import PatientContextBar from "../patient/PatientContextBar"
import PrescribingContentWrapper from "./PrescribingContentWrapper"
import PrescribingDraftDrawer from "../draft/PrescribingDraftDrawer"
import { DASHBOARD_SURFACE } from "../../../modules/common/layout/dashboard/styleTokens"

export default function PrescribingShell({
  patient,
  catalogContent,
  draftContent,
  draftCount = 0,
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [draftOpen, setDraftOpen] = useState(false)

  return (
    <PrescribingContentWrapper>
      <PatientContextBar patient={patient} />

      <Box
        sx={{
          display: "flex",
          flex: 1,
          minHeight: 0,
          width: "100%",
          gap: 2,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Box
          component={Paper}
          elevation={DASHBOARD_SURFACE.elevation}
          sx={{
            flex: { xs: "1 1 0", md: "8 8 0" },
            minWidth: 0,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: DASHBOARD_SURFACE.borderRadius,
            px: { xs: 2, md: 2.5 },
            py: { xs: 1.5, md: 2 },
          }}
        >
          {catalogContent}
        </Box>

        {!isMobile ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: "4 4 0",
              minWidth: 0,
              minHeight: 0,
              alignSelf: "stretch",
            }}
          >
            {draftContent}
          </Box>
        ) : null}
      </Box>

      {isMobile ? (
        <PrescribingDraftDrawer
          open={draftOpen}
          onOpen={() => setDraftOpen(true)}
          onClose={() => setDraftOpen(false)}
          draftCount={draftCount}
        >
          {draftContent}
        </PrescribingDraftDrawer>
      ) : null}
    </PrescribingContentWrapper>
  )
}

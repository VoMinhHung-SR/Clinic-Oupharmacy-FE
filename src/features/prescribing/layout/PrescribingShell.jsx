import { Box, Paper, useMediaQuery, useTheme } from "@mui/material"
import { useState } from "react"
import PatientContextBar from "../patient/PatientContextBar"
import PrescribingContentWrapper from "./PrescribingContentWrapper"
import PrescribingDraftDrawer from "../draft/PrescribingDraftDrawer"

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
          elevation={4}
          sx={{
            flex: { xs: "1 1 auto", md: "8 8 0" },
            minWidth: 0,
            minHeight: { xs: "50vh", md: 0 },
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
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

import { Box, Button, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link, useLocation } from "react-router-dom"
import Loading from "../../components/Loading"
import Icon403Forbidden from "../../../../lib/assets/icon403Forbidden"
import { Helmet } from "react-helmet"
import { DASHBOARD_PAGE_FRAME_SX } from "../dashboard/styleTokens"

const Forbidden = () => {
  const { t, ready } = useTranslation("common")
  const location = useLocation()
  const isDashboard = location.pathname.startsWith("/dashboard")
  const homePath = isDashboard ? "/dashboard/" : "/"

  const centeredContent = (
    <Container sx={{ textAlign: "center" }}>
      {ready ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", maxWidth: 350, mx: "auto", mb: 2 }}>
            <Icon403Forbidden />
          </Box>
          <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 600 }}>
            {t("common:errForbidden")}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {t("common:loginValidUser")}
          </Typography>
          <Button component={Link} to={homePath} variant="contained" color="primary" size="large">
            {t("common:backToHomepage")}
          </Button>
        </>
      ) : (
        <Loading />
      )}
    </Container>
  )

  return (
    <Box
      sx={{
        ...(isDashboard
          ? { ...DASHBOARD_PAGE_FRAME_SX, alignItems: "center", justifyContent: "center" }
          : { py: 6, minHeight: 480, display: "flex", alignItems: "center", justifyContent: "center" }),
      }}
    >
      <Helmet>
        <title>{ready ? t("common:forbidden") : "Forbidden"}</title>
      </Helmet>
      {centeredContent}
    </Box>
  )
}

export default Forbidden

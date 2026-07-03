import { Box, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import Loading from "../../components/Loading"
import Icon403Forbidden from "../../../../lib/assets/icon403Forbidden"
import { Helmet } from "react-helmet"
import { DASHBOARD_PAGE_FRAME_SX } from "../dashboard/styleTokens"

const Forbidden = () => {
  const { t, ready } = useTranslation("common")

  const centeredContent = (
    <Container sx={{ textAlign: "center" }}>
      {ready ? (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", maxWidth: 350, mx: "auto", mb: 2 }}>
            <Icon403Forbidden />
          </Box>
          <Typography variant="h6" color="error" gutterBottom>
            {t("common:errForbidden")}
          </Typography>
          <Typography variant="body2">{t("common:loginValidUser")}</Typography>
        </>
      ) : (
        <Loading />
      )}
    </Container>
  )

  return (
    <Box
      sx={{
        ...DASHBOARD_PAGE_FRAME_SX,
        alignItems: "center",
        justifyContent: "center",
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

import { Box, Button, Container, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import Loading from "../../components/Loading"
import Icon404PageNotFound from "../../../../lib/assets/icon404PageNotFound"
import { Helmet } from "react-helmet"

const NotFound = () => {
  const { t, ready } = useTranslation("common")

  if (!ready) {
    return (
      <Box className="ou-relative ou-items-center" sx={{ height: "550px" }}>
        <Helmet>
          <title>Not Found</title>
        </Helmet>
        <Container className="ou-text-center ou-mt-5">
          <Loading />
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ py: 4 }}>
      <Helmet>
        <title>{t("common:errNotFound")} - OUPharmacy</title>
      </Helmet>
      <Container sx={{ textAlign: "center" }}>
        <Box sx={{ display: "flex", justifyContent: "center", mx: "auto", maxWidth: 420 }}>
          <Icon404PageNotFound width={420} height={420} />
        </Box>
        <Typography variant="h5" color="error" sx={{ fontWeight: 600, mb: 1 }}>
          {t("common:errNotFound")}
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" size="large" sx={{ mt: 2 }}>
          {t("common:backToHomepage")}
        </Button>
      </Container>
    </Box>
  )
}

export default NotFound

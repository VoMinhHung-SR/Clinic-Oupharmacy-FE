import { useState } from "react"
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material"
import { Phone, Email, LocationOn, AccessTime, Send } from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import Loading from "../../modules/common/components/Loading"
import { EMAIL_SUPPORT, TOAST_ERROR, TOAST_SUCCESS } from "../../lib/constants"
import MapGL from "../../modules/common/components/Mapbox"
import SuccessfulAlert from "../../config/sweetAlert2"
import { fetchContactAdmin } from "../../modules/pages/ContactComponents/services"
import SchemaModels from "../../lib/schema"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import createToastMessage from "../../lib/utils/createToastMessage"
import { Helmet } from "react-helmet"

const softIconWrap = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "rgba(37, 99, 235, 0.1)",
  color: "primary.main",
  flexShrink: 0,
}

const Contact = () => {
  const { t, tReady } = useTranslation(["contact", "common"])
  const [isLoading, setIsLoading] = useState(false)
  const [viewport] = useState({
    latitude: 10.816800580111298,
    longitude: 106.67855666909755,
    zoom: 16,
  })

  if (tReady) {
    return (
      <Box sx={{ py: 4 }}>
        <Loading />
      </Box>
    )
  }

  const { contactSchema } = SchemaModels()
  const methods = useForm({
    resolver: yupResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const response = await fetchContactAdmin(data)
      if (response.status === 200) {
        SuccessfulAlert({
          title: t("contact:sendSuccess"),
          confirmButtonText: t("common:ok"),
          callbackSuccess: () => {
            createToastMessage({ message: t("contact:thanksDescription"), type: TOAST_SUCCESS })
          },
        })
      }
    } catch (error) {
      createToastMessage({ message: t("contact:sendFailed"), type: TOAST_ERROR })
    } finally {
      methods.reset()
      setIsLoading(false)
    }
  }

  const contactInfo = [
    {
      icon: <Phone fontSize="small" />,
      title: t("contact:phone"),
      content: "+84 382 590 839",
      subtitle: t("contact:workingHoursDescription"),
    },
    {
      icon: <Email fontSize="small" />,
      title: t("contact:email"),
      content: EMAIL_SUPPORT,
      subtitle: t("contact:feedback"),
    },
    {
      icon: <LocationOn fontSize="small" />,
      title: t("contact:address"),
      content: "371 Nguyễn Kiệm, Gò Vấp",
      subtitle: t("contact:city"),
    },
    {
      icon: <AccessTime fontSize="small" />,
      title: t("contact:workingHours"),
      content: t("contact:workingSchedule"),
      subtitle: t("contact:workingHoursDescription"),
    },
  ]

  return (
    <Box>
      <Helmet>
        <title>{t("common:contact")} - OUPharmacy</title>
      </Helmet>

      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
        <Typography
          component="h1"
          sx={{
            fontSize: { xs: "1.6rem", md: "2rem" },
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "text.primary",
            mb: 1.5,
          }}
        >
          {t("contact:contact")}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 540, mx: "auto", lineHeight: 1.7, fontSize: { xs: "0.97rem", md: "1.05rem" } }}
        >
          {t("contact:contactDescription")}
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="stretch">
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, height: "100%" }}>
            {contactInfo.map((info) => (
              <Paper
                key={info.title}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  flex: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 1.75, alignItems: "flex-start" }}>
                  <Box sx={softIconWrap}>{info.icon}</Box>
                  <Box sx={{ minWidth: 0, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", mb: 0.35 }}>
                      {info.title}
                    </Typography>
                    <Typography
                      color="primary.main"
                      sx={{
                        fontWeight: 600,
                        fontSize: "0.9rem",
                        overflowWrap: "anywhere",
                        mb: 0.25,
                      }}
                    >
                      {info.content}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.85rem" }}>
                      {info.subtitle}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 3.5 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              height: "100%",
            }}
          >
            <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", mb: 0.5, letterSpacing: "-0.01em" }}>
              {t("contact:send")}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {t("contact:contactDescription")}
            </Typography>

            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`${t("contact:name")} *`}
                    name="name"
                    autoComplete="name"
                    {...methods.register("name")}
                    error={!!methods.formState.errors.name}
                    helperText={methods.formState.errors.name?.message || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={`${t("contact:email")} *`}
                    name="email"
                    type="email"
                    autoComplete="email"
                    spellCheck={false}
                    {...methods.register("email")}
                    error={!!methods.formState.errors.email}
                    helperText={methods.formState.errors.email?.message || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("contact:phone")}
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    {...methods.register("phone")}
                    error={!!methods.formState.errors.phone}
                    helperText={methods.formState.errors.phone?.message || ""}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t("contact:subject")}
                    name="subject"
                    autoComplete="off"
                    {...methods.register("subject")}
                    error={!!methods.formState.errors.subject}
                    helperText={methods.formState.errors.subject?.message || ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={`${t("contact:message")} *`}
                    name="message"
                    autoComplete="off"
                    {...methods.register("message")}
                    multiline
                    rows={5}
                    error={!!methods.formState.errors.message}
                    helperText={methods.formState.errors.message?.message || ""}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={!isLoading && <Send />}
                    disabled={isLoading}
                    sx={{
                      py: 1.35,
                      px: 4,
                      fontWeight: 600,
                      boxShadow: "none",
                      minWidth: { sm: 200 },
                      width: { xs: "100%", sm: "auto" },
                      "&:hover": { boxShadow: "none" },
                    }}
                  >
                    {isLoading ? <CircularProgress size={22} color="inherit" /> : t("contact:send")}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: { xs: 5, md: 6 } }}>
        <Typography
          component="h2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            fontSize: { xs: "1.25rem", md: "1.4rem" },
            letterSpacing: "-0.02em",
            mb: 1,
          }}
        >
          {t("contact:address")}
        </Typography>
        <Typography color="text.secondary" sx={{ textAlign: "center", mb: 3, fontSize: "0.95rem" }}>
          371 Nguyễn Kiệm, Gò Vấp, TP.HCM · {t("contact:workingHoursDescription")}
        </Typography>
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            overflow: "hidden",
          }}
        >
          <Box sx={{ height: { xs: 260, sm: 340, md: 400 } }}>
            <MapGL
              longitude={viewport.longitude}
              latitude={viewport.latitude}
              zoom={viewport.zoom}
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}

export default Contact

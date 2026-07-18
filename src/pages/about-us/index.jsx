import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
} from "@mui/material"
import {
  MedicalServices,
  People,
  LocalHospital,
  SupportAgent,
  HealthAndSafety,
  EmojiEvents,
  Star,
  Favorite,
  TrendingUp,
  Security,
  Accessibility,
  Science,
  Business,
} from "@mui/icons-material"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Helmet } from "react-helmet"
import Loading from "../../modules/common/components/Loading"

const softIcon = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "rgba(37, 99, 235, 0.1)",
  color: "primary.main",
  mb: 2,
}

const cardSx = {
  height: "100%",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "none",
  transition: "border-color 0.2s ease, transform 0.2s ease",
  "&:hover": {
    borderColor: "primary.light",
    transform: "translateY(-2px)",
  },
}

const sectionTitleSx = {
  textAlign: "center",
  fontWeight: 600,
  letterSpacing: "-0.02em",
  fontSize: { xs: "1.25rem", md: "1.45rem" },
  mb: 1,
  color: "text.primary",
}

const AboutUs = () => {
  const { t, tReady } = useTranslation(["about-us", "common"])

  if (tReady) {
    return (
      <Box sx={{ py: 4 }}>
        <Loading />
      </Box>
    )
  }

  const values = [
    { icon: <Favorite fontSize="small" />, title: t("about-us:value1title"), description: t("about-us:value1Description") },
    { icon: <Star fontSize="small" />, title: t("about-us:value2title"), description: t("about-us:value2Description") },
    { icon: <Science fontSize="small" />, title: t("about-us:value3title"), description: t("about-us:value3Description") },
    { icon: <Security fontSize="small" />, title: t("about-us:value4title"), description: t("about-us:value4Description") },
    { icon: <People fontSize="small" />, title: t("about-us:value5title"), description: t("about-us:value5Description") },
    { icon: <Accessibility fontSize="small" />, title: t("about-us:value6title"), description: t("about-us:value6Description") },
  ]

  const teamMembers = [
    { icon: <MedicalServices fontSize="small" />, title: t("about-us:doctors"), description: t("about-us:doctorsDescription") },
    { icon: <LocalHospital fontSize="small" />, title: t("about-us:pharmacists"), description: t("about-us:pharmacistsDescription") },
    { icon: <HealthAndSafety fontSize="small" />, title: t("about-us:nurses"), description: t("about-us:nursesDescription") },
    { icon: <SupportAgent fontSize="small" />, title: t("about-us:support"), description: t("about-us:supportDescription") },
  ]

  const facilities = [
    { icon: <MedicalServices fontSize="small" />, title: t("about-us:modernEquipment"), description: t("about-us:modernEquipmentDescription") },
    { icon: <People fontSize="small" />, title: t("about-us:comfortableEnvironment"), description: t("about-us:comfortableEnvironmentDescription") },
    { icon: <TrendingUp fontSize="small" />, title: t("about-us:digitalIntegration"), description: t("about-us:digitalIntegrationDescription") },
  ]

  const achievements = [
    { number: "10,000+", title: t("about-us:patientsServed") },
    { number: "15+", title: t("about-us:yearsExperience") },
    { number: "98%", title: t("about-us:satisfactionRate") },
    { number: "100%", title: t("about-us:certifications") },
  ]

  return (
    <Box>
      <Helmet>
        <title>{t("about-us:title")} - OUPharmacy</title>
      </Helmet>

      {/* Intro */}
      <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
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
          {t("about-us:title")}
        </Typography>
        <Typography
          sx={{
            fontWeight: 500,
            color: "text.primary",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            mb: 1.5,
          }}
        >
          {t("about-us:subtitle")}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 560, mx: "auto", lineHeight: 1.7, fontSize: { xs: "0.97rem", md: "1.05rem" } }}
        >
          {t("about-us:description")}
        </Typography>
      </Box>

      {/* Stats strip */}
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 4, md: 6 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(37, 99, 235, 0.04)",
          py: { xs: 2.5, md: 3 },
          px: 2,
        }}
      >
        <Grid container spacing={2}>
          {achievements.map((item) => (
            <Grid item xs={6} md={3} key={item.number} sx={{ textAlign: "center" }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: "1.5rem", md: "1.85rem" },
                  color: "primary.main",
                  letterSpacing: "-0.02em",
                }}
              >
                {item.number}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, px: 1 }}>
                {item.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Mission & Vision */}
      <Grid container spacing={2.5} sx={{ mb: { xs: 5, md: 6 } }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box sx={{ ...softIcon, mb: 0 }}>
                <Business fontSize="small" />
              </Box>
              <Typography component="h2" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {t("about-us:mission")}
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {t("about-us:missionDescription")}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Box sx={{ ...softIcon, mb: 0 }}>
                <EmojiEvents fontSize="small" />
              </Box>
              <Typography component="h2" sx={{ fontWeight: 600, fontSize: "1.1rem" }}>
                {t("about-us:vision")}
              </Typography>
            </Box>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {t("about-us:visionDescription")}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Values */}
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <Typography component="h2" sx={sectionTitleSx}>
          {t("about-us:values")}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3.5, maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
        >
          {t("about-us:valuesDescription")}
        </Typography>
        <Grid container spacing={2.5}>
          {values.map((value) => (
            <Grid item xs={12} sm={6} md={4} key={value.title}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: "center" }}>
                <Box sx={softIcon}>{value.icon}</Box>
                <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "1.05rem" }}>{value.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {value.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Story */}
      <Paper
        elevation={0}
        sx={{
          mb: { xs: 5, md: 6 },
          p: { xs: 3, md: 4 },
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
          textAlign: "center",
          bgcolor: "rgba(37, 99, 235, 0.03)",
        }}
      >
        <Typography component="h2" sx={{ ...sectionTitleSx, color: "primary.main" }}>
          {t("about-us:story")}
        </Typography>
        <Typography
          sx={{
            maxWidth: 680,
            mx: "auto",
            lineHeight: 1.75,
            color: "text.secondary",
            fontSize: { xs: "1rem", md: "1.05rem" },
          }}
        >
          {t("about-us:storyDescription")}
        </Typography>
      </Paper>

      {/* Team */}
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <Typography component="h2" sx={sectionTitleSx}>
          {t("about-us:team")}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3.5, maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
        >
          {t("about-us:teamDescription")}
        </Typography>
        <Grid container spacing={2.5}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={member.title}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: "center" }}>
                <Box sx={softIcon}>{member.icon}</Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>{member.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {member.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Facilities */}
      <Box sx={{ mb: { xs: 5, md: 6 } }}>
        <Typography component="h2" sx={sectionTitleSx}>
          {t("about-us:facilities")}
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ textAlign: "center", mb: 3.5, maxWidth: 520, mx: "auto", lineHeight: 1.7 }}
        >
          {t("about-us:facilitiesDescription")}
        </Typography>
        <Grid container spacing={2.5}>
          {facilities.map((facility) => (
            <Grid item xs={12} md={4} key={facility.title}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3, textAlign: "center" }}>
                <Box sx={softIcon}>{facility.icon}</Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>{facility.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                  {facility.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* CTA */}
      <Box
        sx={{
          textAlign: "center",
          py: { xs: 4, md: 5 },
          px: 2,
          borderRadius: 2,
          bgcolor: "primary.dark",
          color: "#fff",
        }}
      >
        <Typography
          component="h2"
          sx={{ fontWeight: 600, fontSize: { xs: "1.15rem", md: "1.3rem" }, mb: 1.5, letterSpacing: "-0.01em" }}
        >
          {t("about-us:contactUs")}
        </Typography>
        <Typography sx={{ mb: 3.5, maxWidth: 520, mx: "auto", opacity: 0.9, lineHeight: 1.7 }}>
          {t("about-us:contactUsDescription")}
        </Typography>
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", flexWrap: "wrap" }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/booking"
            sx={{
              bgcolor: "#fff",
              color: "primary.dark",
              fontWeight: 600,
              boxShadow: "none",
              px: 3,
              "&:hover": { bgcolor: "grey.100", boxShadow: "none" },
            }}
          >
            {t("about-us:makeAppointment")}
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/contact"
            sx={{
              borderColor: "rgba(255,255,255,0.55)",
              color: "#fff",
              fontWeight: 600,
              px: 3,
              "&:hover": { borderColor: "#fff", bgcolor: "rgba(255,255,255,0.08)" },
            }}
          >
            {t("about-us:learnMore")}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default AboutUs

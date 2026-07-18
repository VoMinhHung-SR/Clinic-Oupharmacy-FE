import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material"
import { useTranslation } from "react-i18next"
import "mapbox-gl/dist/mapbox-gl.css"
import { useEffect, useRef, useState } from "react"
import MapGL from "../modules/common/components/Mapbox"
import { Link } from "react-router-dom"
import PhoneIcon from "@mui/icons-material/Phone"
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined"
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail"
import MedicalServicesIcon from "@mui/icons-material/MedicalServices"
import PeopleIcon from "@mui/icons-material/People"
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive"
import FormatQuoteIcon from "@mui/icons-material/FormatQuote"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import ChevronRightIcon from "@mui/icons-material/ChevronRight"
import Loading from "../modules/common/components/Loading"
import { Helmet } from "react-helmet"

const PAGE_MAX = "lg"
const SECTION_PY = { xs: 5, md: 10 }
const NAV_H = { md: 64 }

const h2Sx = {
  fontSize: { xs: "1.35rem", md: "1.75rem" },
  fontWeight: 600,
  letterSpacing: "-0.02em",
  mb: 1,
}

const sectionIntroSx = {
  textAlign: "center",
  mb: { xs: 3, md: 5 },
  maxWidth: 520,
  mx: "auto",
}

const scrollByCard = (el, dir) => {
  if (!el) return
  const card = el.querySelector("[data-t-card]")
  const step = (card?.offsetWidth || 300) + 16
  el.scrollBy({ left: dir * step, behavior: "smooth" })
}

const TestimonialSlider = ({ items }) => {
  const trackRef = useRef(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused || items.length <= 1) return undefined
    const el = trackRef.current
    if (!el) return undefined
    const id = setInterval(() => {
      const max = el.scrollWidth - el.clientWidth
      if (max <= 8) return
      const card = el.querySelector("[data-t-card]")
      const step = (card?.offsetWidth || 300) + 16
      const next = el.scrollLeft + step
      el.scrollTo({ left: next >= max - 4 ? 0 : next, behavior: "smooth" })
    }, 4500)
    return () => clearInterval(id)
  }, [paused, items.length])

  return (
    <Box
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      sx={{ position: "relative" }}
    >
      <IconButton
        aria-label="previous testimonial"
        onClick={() => scrollByCard(trackRef.current, -1)}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          left: { md: -12, lg: -20 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          "&:hover": { bgcolor: "grey.50" },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>
      <IconButton
        aria-label="next testimonial"
        onClick={() => scrollByCard(trackRef.current, 1)}
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          right: { md: -12, lg: -20 },
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          "&:hover": { bgcolor: "grey.50" },
        }}
      >
        <ChevronRightIcon />
      </IconButton>

      <Box
        ref={trackRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollPaddingInline: { xs: 4, md: 8 },
          pb: 1.5,
          px: { xs: 0.5, md: 0.5 },
          WebkitOverflowScrolling: "touch",
          "&::-webkit-scrollbar": { height: 5 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 999,
          },
        }}
      >
        {items.map((item) => (
          <Box
            key={`${item.name}-${item.quote.slice(0, 12)}`}
            data-t-card
            sx={{
              flex: "0 0 auto",
              width: { xs: "85%", sm: "48%", md: "calc((100% - 32px) / 3)" },
              minWidth: { xs: 260, sm: 280 },
              maxWidth: { md: 360 },
              scrollSnapAlign: "start",
              p: { xs: 2.5, md: 3 },
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
              minHeight: { xs: 200, md: 220 },
              transition: "border-color 0.2s ease",
              "&:hover": { borderColor: "primary.light" },
            }}
          >
            <FormatQuoteIcon sx={{ color: "primary.main", opacity: 0.7, mb: 1.5, fontSize: 28 }} />
            <Typography
              sx={{
                lineHeight: 1.7,
                color: "text.secondary",
                flex: 1,
                mb: 2.5,
                fontSize: { xs: "0.95rem", md: "0.98rem" },
              }}
            >
              “{item.quote}”
            </Typography>
            <Box
              sx={{
                pt: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: "rgba(37, 99, 235, 0.12)",
                  color: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  flexShrink: 0,
                }}
              >
                {item.name.charAt(0)}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.3 }}>
                  {item.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {item.role}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const Home = () => {
  const { t, tReady } = useTranslation(["home", "common"])
  const [viewport] = useState({
    latitude: 10.816800580111298,
    longitude: 106.67855666909755,
    zoom: 16,
  })

  if (tReady) {
    return (
      <Box>
        <Helmet>
          <title>OUPharmacy</title>
        </Helmet>
        <Loading />
      </Box>
    )
  }

  const trustItems = [
    { value: t("home:trustPatients"), label: t("home:trustPatientsLabel") },
    { value: t("home:trustYears"), label: t("home:trustYearsLabel") },
    { value: t("home:trustSatisfaction"), label: t("home:trustSatisfactionLabel") },
  ]

  const servicesMobile = [
    {
      icon: <MedicalServicesIcon sx={{ fontSize: 22 }} />,
      title: t("home:emergencyServices"),
      description: t("home:scriptEmergencyShort"),
    },
    {
      icon: <PeopleIcon sx={{ fontSize: 22 }} />,
      title: t("home:qualifiedDoctors"),
      description: t("home:scriptDoctorsShort"),
    },
    {
      icon: <MeetingRoomIcon sx={{ fontSize: 22 }} />,
      title: t("home:waitingRoom"),
      description: t("home:scriptWaitingShort"),
    },
  ]

  const servicesDesktopExtra = [
    {
      icon: <FitnessCenterIcon sx={{ fontSize: 22 }} />,
      title: t("home:outdoorsCheckup"),
      description: t("home:scriptOutdoorsShort"),
    },
    {
      icon: <SupportAgentIcon sx={{ fontSize: 22 }} />,
      title: t("home:service24h"),
      description: t("home:scriptService24Short"),
    },
    {
      icon: <NotificationsActiveIcon sx={{ fontSize: 22 }} />,
      title: t("home:messageAndNotification"),
      description: t("home:scriptNotifyShort"),
    },
  ]

  const steps = [
    { title: t("home:step1Title"), description: t("home:step1Desc") },
    { title: t("home:step2Title"), description: t("home:step2Desc") },
    { title: t("home:step3Title"), description: t("home:step3Desc") },
  ]

  const testimonials = [1, 2, 3, 4, 5].map((n) => ({
    quote: t(`home:testimonial${n}Quote`),
    name: t(`home:testimonial${n}Name`),
    role: t(`home:testimonial${n}Role`),
  }))

  const contactRows = [
    {
      icon: <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />,
      label: t("home:address"),
      content: t("home:clinicAddressLine"),
      href: null,
    },
    {
      icon: <PhoneIcon sx={{ fontSize: 20 }} />,
      label: t("home:contactNumber"),
      content: "0382 590 839",
      href: "tel:0382590839",
    },
    {
      icon: <AlternateEmailIcon sx={{ fontSize: 20 }} />,
      label: t("home:emailAddress"),
      content: "oupharmacymanagement@gmail.com",
      href: "mailto:oupharmacymanagement@gmail.com",
    },
  ]

  const renderServiceCard = (service) => (
    <Box
      sx={{
        height: "100%",
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        transition: "border-color 0.2s ease",
        "&:hover": { borderColor: "primary.light" },
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "rgba(37, 99, 235, 0.1)",
          color: "primary.main",
          mb: 1.5,
        }}
      >
        {service.icon}
      </Box>
      <Typography sx={{ fontWeight: 600, mb: 0.75, fontSize: "1rem" }}>{service.title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {service.description}
      </Typography>
    </Box>
  )

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary" }}>
      <Helmet>
        <title>OUPharmacy</title>
      </Helmet>

      {/* 1. Hero */}
      <Box
        component="section"
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: { xs: "auto", md: `calc(100dvh - ${NAV_H.md}px)` },
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src="https://res.cloudinary.com/dl6artkyb/image/upload/v1681561779/OUPharmacy/bg_3.jpg_fj95tb.webp"
          alt=""
          width={1920}
          height={1080}
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: { xs: "75% center", md: "right center" },
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: {
              xs: "linear-gradient(180deg, rgba(15,23,42,0.78) 0%, rgba(15,23,42,0.82) 100%)",
              md: "linear-gradient(100deg, rgba(15,23,42,0.88) 0%, rgba(15,23,42,0.65) 48%, rgba(15,23,42,0.35) 100%)",
            },
          }}
        />

        <Container
          maxWidth={PAGE_MAX}
          sx={{
            position: "relative",
            zIndex: 1,
            flex: 1,
            display: "flex",
            alignItems: "center",
            width: "100%",
            py: { xs: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              maxWidth: { xs: "100%", md: 520 },
              width: "100%",
              color: "#fff",
              textAlign: { xs: "center", md: "left" },
              mx: { xs: "auto", md: 0 },
            }}
          >
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "1.6rem", sm: "1.9rem", md: "2.5rem" },
                fontWeight: 600,
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                mb: { xs: 1.5, md: 2 },
                textWrap: "balance",
              }}
            >
              {t("home:welcomeTitle")}
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "0.95rem", md: "1.05rem" },
                lineHeight: 1.65,
                color: "rgba(255,255,255,0.88)",
                mb: { xs: 3, md: 3.5 },
                maxWidth: 420,
                mx: { xs: "auto", md: 0 },
                display: { xs: "-webkit-box", md: "block" },
                WebkitLineClamp: { xs: 2, md: "unset" },
                WebkitBoxOrient: "vertical",
                overflow: { xs: "hidden", md: "visible" },
              }}
            >
              {t("home:scriptWelcome")}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: { xs: 1.5, sm: 2 },
              }}
            >
              <Button
                component={Link}
                to="/booking"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 3.5,
                  py: 1.2,
                  fontWeight: 600,
                  boxShadow: "none",
                  width: { xs: "100%", sm: "auto" },
                  maxWidth: { xs: 280, sm: "none" },
                  "&:hover": { boxShadow: "none", bgcolor: "primary.dark" },
                }}
              >
                {t("home:makeAnAppointMent")}
              </Button>
              <Typography
                component={Link}
                to="/waiting-room"
                sx={{
                  color: "rgba(255,255,255,0.9)",
                  textDecoration: "none",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  borderBottom: "1px solid rgba(255,255,255,0.4)",
                  lineHeight: 1.4,
                  "&:hover": { color: "#fff", borderColor: "#fff" },
                }}
              >
                {t("home:waitingRoom")}
              </Typography>
            </Box>
          </Box>
        </Container>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            borderTop: "1px solid rgba(255,255,255,0.12)",
            bgcolor: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Container maxWidth={PAGE_MAX} sx={{ py: { xs: 2, md: 3 } }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                textAlign: "center",
              }}
            >
              {trustItems.map((item) => (
                <Box key={item.label}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: { xs: "1.1rem", md: "1.6rem" },
                      color: "#fff",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {item.value}
                  </Typography>
                  <Typography
                    sx={{
                      mt: 0.35,
                      fontSize: { xs: "0.68rem", sm: "0.85rem" },
                      color: "rgba(255,255,255,0.75)",
                      lineHeight: 1.25,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* 2. Services */}
      <Box component="section" sx={{ py: SECTION_PY, borderBottom: "1px solid", borderColor: "divider" }}>
        <Container maxWidth={PAGE_MAX}>
          <Box sx={sectionIntroSx}>
            <Typography component="h2" sx={h2Sx}>
              {t("home:ourServices")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.65, fontSize: "0.95rem", display: { xs: "none", md: "block" } }}
            >
              {t("home:title2")}
            </Typography>
          </Box>
          <Grid container spacing={{ xs: 1.5, md: 3 }}>
            {servicesMobile.map((service) => (
              <Grid item xs={12} sm={6} md={4} key={service.title}>
                {renderServiceCard(service)}
              </Grid>
            ))}
            {servicesDesktopExtra.map((service) => (
              <Grid item md={4} key={service.title} sx={{ display: { xs: "none", md: "block" } }}>
                {renderServiceCard(service)}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3. How it works — desktop */}
      <Box
        component="section"
        sx={{
          display: { xs: "none", md: "block" },
          py: SECTION_PY,
          bgcolor: "rgba(37, 99, 235, 0.03)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth={PAGE_MAX}>
          <Box sx={{ ...sectionIntroSx, mb: 5 }}>
            <Typography component="h2" sx={h2Sx}>
              {t("home:howItWorks")}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.65, fontSize: "0.95rem" }}>
              {t("home:howItWorksDesc")}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid item xs={12} md={4} key={step.title}>
                <Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography sx={{ fontWeight: 600, mb: 1, fontSize: "1.05rem" }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.65 }}>
                    {step.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. Story CTA — desktop */}
      <Box
        component="section"
        sx={{
          display: { xs: "none", md: "block" },
          py: SECTION_PY,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography component="h2" sx={{ ...h2Sx, mb: 2 }}>
            {t("home:storyTitle")}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ lineHeight: 1.75, fontSize: "1.05rem", mb: 4, maxWidth: 560, mx: "auto" }}
          >
            {t("home:storyDesc")}
          </Typography>
          <Button
            component={Link}
            to="/booking"
            variant="contained"
            color="primary"
            size="large"
            sx={{ px: 4, py: 1.35, fontWeight: 600, boxShadow: "none", "&:hover": { boxShadow: "none" } }}
          >
            {t("home:makeAnAppointMent")}
          </Button>
        </Container>
      </Box>

      {/* 5. Testimonials slider — above Contact */}
      <Box
        component="section"
        sx={{
          py: SECTION_PY,
          bgcolor: "rgba(37, 99, 235, 0.03)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Container maxWidth={PAGE_MAX}>
          <Box sx={sectionIntroSx}>
            <Typography component="h2" sx={h2Sx}>
              {t("home:testimonials")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.65, fontSize: "0.95rem", display: { xs: "none", md: "block" } }}
            >
              {t("home:testimonialsDesc")}
            </Typography>
          </Box>
          <TestimonialSlider items={testimonials} />
        </Container>
      </Box>

      {/* 6. Contact */}
      <Box component="section" sx={{ py: SECTION_PY }}>
        <Container maxWidth={PAGE_MAX}>
          <Box sx={sectionIntroSx}>
            <Typography component="h2" sx={h2Sx}>
              {t("home:contactUs")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ lineHeight: 1.65, fontSize: "0.95rem", display: { xs: "none", md: "block" } }}
            >
              {t("home:readyToContact")}
            </Typography>
          </Box>
          <Grid
            container
            spacing={0}
            alignItems="stretch"
            sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider", overflow: "hidden" }}
          >
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: { xs: 220, md: 380 },
                  width: "100%",
                  "& .mapboxgl-map": { width: "100% !important", height: "100% !important" },
                }}
              >
                <MapGL
                  longitude={viewport.longitude}
                  latitude={viewport.latitude}
                  zoom={viewport.zoom}
                  style={{ width: "100%", height: "100%", minHeight: "100%" }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  gap: { xs: 2, md: 2.5 },
                  p: { xs: 2.5, md: 4 },
                  borderTop: { xs: "1px solid", md: 0 },
                  borderLeft: { xs: 0, md: "1px solid" },
                  borderColor: "divider",
                }}
              >
                {contactRows.map((row) => (
                  <Box key={row.label} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 1.5,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "rgba(37, 99, 235, 0.1)",
                        color: "primary.main",
                        flexShrink: 0,
                      }}
                    >
                      {row.icon}
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                        {row.label}
                      </Typography>
                      {row.href ? (
                        <Typography
                          component="a"
                          href={row.href}
                          sx={{
                            color: "text.primary",
                            textDecoration: "none",
                            fontWeight: 500,
                            fontSize: "0.92rem",
                            overflowWrap: "anywhere",
                            "&:hover": { color: "primary.main" },
                          }}
                        >
                          {row.content}
                        </Typography>
                      ) : (
                        <Typography sx={{ fontSize: "0.92rem", fontWeight: 500 }}>{row.content}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
                <Button
                  component={Link}
                  to="/contact"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{
                    mt: 0.5,
                    alignSelf: { xs: "stretch", sm: "flex-start" },
                    fontWeight: 600,
                    boxShadow: "none",
                    "&:hover": { boxShadow: "none" },
                  }}
                >
                  {t("home:getInTouch")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default Home

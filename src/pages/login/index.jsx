import {
  Alert,
  Avatar,
  Button,
  Collapse,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { Box } from "@mui/system"
import BackdropLoading from "../../modules/common/components/BackdropLoading"
import CloseIcon from "@mui/icons-material/Close"
import { Link } from "react-router-dom"
import useLogin from "../../modules/pages/LoginComponents/hooks/useLogin"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import Loading from "../../modules/common/components/Loading"
import { Helmet } from "react-helmet"
import HowToRegIcon from "@mui/icons-material/HowToReg"
import HomeIcon from "@mui/icons-material/Home"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import GoogleIcon from "@mui/icons-material/Google"

const Login = () => {
  const { t, tReady } = useTranslation(["login", "yup-validate"])
  const {
    onSubmit,
    openError,
    openBackdrop,
    setOpenError,
    loginSchema,
    showPassword,
    handleTogglePassword,
    handleGoogleLogin,
  } = useLogin()

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  if (tReady) {
    return (
      <Box className="ou-mt-3">
        <Helmet>
          <title>Login</title>
        </Helmet>
        <Loading />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("login:login")} - OUPharmacy</title>
      </Helmet>

      {openBackdrop === true && <BackdropLoading />}

      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2, sm: 3, md: 4 },
          boxSizing: "border-box",
          bgcolor: "background.default",
        }}
      >
        <Container
          component={Paper}
          elevation={2}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: { xs: "100%", sm: "90%", md: "70%", lg: "50%", xl: "30%" },
            maxWidth: "500px",
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Box sx={{ margin: "12px auto", textAlign: "center" }}>
            <Avatar
              sx={{
                width: { xs: "150px", sm: "180px", md: "200px" },
                height: { xs: "40px", sm: "45px", md: "50px" },
                margin: "auto",
              }}
              variant="square"
              className="ou-object-fit-contain"
              src="https://res.cloudinary.com/dl6artkyb/image/upload/v1666354515/OUPharmacy/Untitled-1_hdvtsk.png"
            />
          </Box>

          <form
            onSubmit={methods.handleSubmit((data) => {
              onSubmit(data)
            })}
          >
            <Collapse in={openError}>
              <Alert
                action={
                  <IconButton
                    aria-label="close"
                    color="inherit"
                    size="small"
                    onClick={() => setOpenError(false)}
                  >
                    <CloseIcon fontSize="inherit" />
                  </IconButton>
                }
                sx={{ mb: 2 }}
                severity="error"
              >
                {t("incorrectInfo")}
              </Alert>
            </Collapse>

            <Box sx={{ my: { xs: 1.5, sm: 2 } }}>
              <TextField
                fullWidth
                autoComplete="username"
                autoFocus={!isMobile}
                id="username"
                name="username"
                type="text"
                label={t("username")}
                error={!!methods.formState.errors.username}
                {...methods.register("username")}
              />
              {methods.formState.errors.username?.message && (
                <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                  {methods.formState.errors.username.message}
                </p>
              )}
            </Box>

            <Box sx={{ my: { xs: 1.5, sm: 2 } }}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel
                  className={methods.formState.errors.password?.message ? "!ou-text-red-600" : undefined}
                  htmlFor="outlined-adornment-password"
                >
                  {t("password")}
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  label={t("password")}
                  autoComplete="current-password"
                  error={!!methods.formState.errors.password?.message}
                  {...methods.register("password")}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {methods.formState.errors.password?.message && (
                  <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                    {methods.formState.errors.password.message}
                  </p>
                )}
              </FormControl>
            </Box>

            <Box sx={{ margin: "0 auto", textAlign: "center", width: "100%" }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  my: 1.5,
                  minWidth: { xs: "100%", sm: "200px" },
                  width: { xs: "100%", sm: "auto" },
                  px: { xs: 2, sm: 5 },
                }}
              >
                {t("login")}
              </Button>

              <Box sx={{ mt: 3, mb: 2, width: "100%" }}>
                <Divider sx={{ mb: 2 }}>
                  <Box component="span" sx={{ color: "text.secondary", fontSize: 14 }}>
                    {t("login:orLoginWith")}
                  </Box>
                </Divider>
                <Button
                  fullWidth
                  variant="outlined"
                  color="error"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleLogin}
                >
                  Google
                </Button>
              </Box>

              <Divider sx={{ mb: 2 }}>
                <Box component="span" sx={{ color: "text.secondary", fontSize: 14 }}>
                  {t("login:or")}
                </Box>
              </Divider>

              <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    component={Link}
                    to="/register"
                    startIcon={<HowToRegIcon />}
                  >
                    {t("login:register")}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="primary"
                    component={Link}
                    to="/"
                    startIcon={<HomeIcon />}
                  >
                    {t("login:home")}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Container>
      </Box>
    </>
  )
}

export default Login

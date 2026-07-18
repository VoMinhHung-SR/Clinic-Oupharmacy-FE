import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { useForm, Controller } from "react-hook-form"
import { Link } from "react-router-dom"
import useRegister from "../../modules/pages/RegisterComponents/hooks/useRegister"
import { yupResolver } from "@hookform/resolvers/yup"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import useAddressInfo from "../../modules/pages/RegisterComponents/hooks/useAddressInfo"
import { Helmet } from "react-helmet"
import { CURRENT_DATE } from "../../lib/constants"
import moment from "moment"
import SchemaModels from "../../lib/schema"
import { Person, Visibility, VisibilityOff } from "@mui/icons-material"
import AddressAutocomplete from "../../modules/pages/RegisterComponents/components/AddressAutocomplete"
import BackdropLoading from "../../modules/common/components/BackdropLoading"

const paperSx = {
  width: "100%",
  maxWidth: 880,
  mx: "auto",
  borderRadius: 2,
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "none",
}

const sectionLabelSx = {
  fontSize: "0.8rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "primary.main",
  mb: 0.75,
}

const Register = () => {
  const { t, tReady } = useTranslation(["register", "common", "yup-validate"])

  const {
    imageUrl,
    setImageUrl,
    openBackdrop,
    setDOB,
    isLoadingUserRole,
    selectedImage,
    setSelectedImage,
    userRoleID,
    gender,
    setGender,
    onSubmit,
  } = useRegister()

  const { registerSchema } = SchemaModels()

  const {
    districts,
    setCityId,
    listPlace,
    location: locationGeo,
    handleInputChange,
    handleChange,
  } = useAddressInfo()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      dob: "",
      phoneNumber: "",
      location: {
        address: "",
        city: -1,
        district: -1,
      },
    },
  })

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage))
    }
  }, [selectedImage])

  const { allConfig } = useSelector((state) => state.config)

  const filterByField = (field) => (options, state) =>
    options.filter((option) => {
      const label = option && typeof option[field] === "string" ? option[field] : ""
      return label.toLowerCase().includes(state.inputValue.toLowerCase())
    })

  const filterCityOptions = filterByField("name")
  const filterDistrictOptions = filterByField("name")
  const filterAddressOptions = filterByField("description")

  if (tReady && isLoadingUserRole) {
    return (
      <Box sx={{ minHeight: 300 }}>
        <Helmet>
          <title>Register</title>
        </Helmet>
        <BackdropLoading />
      </Box>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("register:register")} - OUPharmacy</title>
      </Helmet>

      {openBackdrop && <BackdropLoading />}

      <Box sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default", py: { xs: 3, md: 5 } }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={paperSx}>
            <Box sx={{ px: { xs: 2.5, sm: 4 }, pt: { xs: 3, sm: 4 }, pb: 2, textAlign: "center" }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "1.4rem", sm: "1.6rem" },
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                {t("registerUser")}
              </Typography>
            </Box>

            <Divider />

            <form
              onSubmit={methods.handleSubmit((data) => {
                onSubmit(data, methods.setError, locationGeo)
              })}
            >
              <Box sx={{ px: { xs: 2.5, sm: 4 }, py: { xs: 3, sm: 4 } }}>
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      autoComplete="given-name"
                      id="firstName"
                      name="firstName"
                      type="text"
                      label={
                        <>
                          {t("firstName")}
                          <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      error={!!methods.formState.errors.firstName}
                      {...methods.register("firstName")}
                    />
                    {methods.formState.errors.firstName?.message && (
                      <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                        {methods.formState.errors.firstName.message}
                      </p>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      autoComplete="family-name"
                      id="lastName"
                      name="lastName"
                      type="text"
                      label={
                        <>
                          {t("lastName")}
                          <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      error={!!methods.formState.errors.lastName}
                      {...methods.register("lastName")}
                    />
                    {methods.formState.errors.lastName?.message && (
                      <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                        {methods.formState.errors.lastName.message}
                      </p>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      autoComplete="email"
                      id="email"
                      name="email"
                      type="email"
                      spellCheck={false}
                      label={
                        <>
                          {t("email")}
                          <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      error={!!methods.formState.errors.email}
                      {...methods.register("email")}
                    />
                    {methods.formState.errors.email?.message && (
                      <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                        {methods.formState.errors.email.message}
                      </p>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      autoComplete="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      label={
                        <>
                          {t("phoneNumber")}
                          <span style={{ color: "red" }}>*</span>
                        </>
                      }
                      error={!!methods.formState.errors.phoneNumber}
                      {...methods.register("phoneNumber")}
                    />
                    {methods.formState.errors.phoneNumber?.message && (
                      <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                        {methods.formState.errors.phoneNumber.message}
                      </p>
                    )}
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      id="date"
                      fullWidth
                      label={t("dateOfBirth")}
                      type="date"
                      name="dob"
                      error={!!methods.formState.errors.dob}
                      onChange={(evt) => setDOB(evt.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ max: moment(CURRENT_DATE).format("YYYY-MM-DD") }}
                      {...methods.register("dob")}
                    />
                    {methods.formState.errors.dob?.message && (
                      <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                        {methods.formState.errors.dob.message}
                      </p>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="register-gender-label">{t("gender")}</InputLabel>
                      <Select
                        labelId="register-gender-label"
                        id="register-gender"
                        value={gender}
                        label={t("gender")}
                        onChange={(evt) => setGender(evt.target.value)}
                      >
                        <MenuItem value={0}>{t("male")}</MenuItem>
                        <MenuItem value={1}>{t("female")}</MenuItem>
                        <MenuItem value={2}>{t("secret")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" error={!!methods.formState.errors.password}>
                      <InputLabel htmlFor="password">
                        {t("password")}
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel>
                      <OutlinedInput
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        label={t("password")}
                        autoComplete="new-password"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        {...methods.register("password")}
                      />
                      <FormHelperText>{methods.formState.errors.password?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth variant="outlined" error={!!methods.formState.errors.confirmPassword}>
                      <InputLabel htmlFor="confirmPassword">
                        {t("confirmPassword")}
                        <span style={{ color: "red" }}>*</span>
                      </InputLabel>
                      <OutlinedInput
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPass ? "text" : "password"}
                        autoComplete="new-password"
                        label={t("confirmPassword")}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle confirm password visibility"
                              onClick={() => setShowConfirmPass(!showConfirmPass)}
                              edge="end"
                            >
                              {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                        {...methods.register("confirmPassword")}
                      />
                      <FormHelperText>{methods.formState.errors.confirmPassword?.message}</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 4 }} />

                <AddressInfo
                  t={t}
                  allConfig={allConfig}
                  methods={methods}
                  districts={districts}
                  filterCityOptions={filterCityOptions}
                  filterDistrictOptions={filterDistrictOptions}
                  filterAddressOptions={filterAddressOptions}
                  setCityId={setCityId}
                  listPlace={listPlace}
                  isLoadingUserRole={isLoadingUserRole}
                  handleInputChange={handleInputChange}
                  handleChange={handleChange}
                />

                <Divider sx={{ my: 4 }} />

                <Typography sx={{ ...sectionLabelSx, mb: 2 }}>{t("uploadAvatar")}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    gap: 3,
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px dashed",
                    borderColor: "divider",
                    bgcolor: "rgba(37, 99, 235, 0.03)",
                  }}
                >
                  <Avatar
                    src={imageUrl && selectedImage ? imageUrl : undefined}
                    sx={{
                      width: 96,
                      height: 96,
                      bgcolor: "rgba(37, 99, 235, 0.12)",
                      color: "primary.main",
                      border: "2px solid",
                      borderColor: "divider",
                    }}
                  >
                    {!imageUrl && <Person sx={{ fontSize: 48 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1, textAlign: { xs: "center", sm: "left" } }}>
                    <Typography sx={{ fontWeight: 600, mb: 0.5 }}>{t("uploadAvatar")}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                      JPG, PNG
                    </Typography>
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <label htmlFor="select-image">
                      <Button variant="outlined" color="primary" component="span" size="small">
                        {t("uploadAvatar")}
                      </Button>
                    </label>
                  </Box>
                </Box>

                <Box
                  sx={{
                    mt: 4,
                    display: "flex",
                    flexDirection: { xs: "column-reverse", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Typography
                    component={Link}
                    to="/login"
                    sx={{
                      color: "primary.main",
                      textDecoration: "none",
                      fontSize: "0.95rem",
                      textAlign: { xs: "center", sm: "left" },
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    {t("common:haveAnCount")}
                  </Typography>

                  {userRoleID === -1 ? (
                    <Typography color="error" sx={{ textAlign: "center" }}>
                      {t("common:refresh")}
                    </Typography>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      sx={{
                        minWidth: { sm: 180 },
                        px: 4,
                        fontWeight: 600,
                        boxShadow: "none",
                        "&:hover": { boxShadow: "none" },
                      }}
                    >
                      {t("submit")}
                    </Button>
                  )}
                </Box>
              </Box>
            </form>

            <Divider />
            <Box sx={{ py: 2, textAlign: "center" }}>
              <Typography
                component={Link}
                to="/"
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
              >
                {t("common:backToHomepage")}
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  )
}

const AddressInfo = ({
  t,
  allConfig,
  methods,
  districts,
  filterCityOptions,
  filterDistrictOptions,
  filterAddressOptions,
  setCityId,
  listPlace,
  isLoadingUserRole,
  handleInputChange,
  handleChange,
}) => {
  return (
    <Box>
      <Typography sx={sectionLabelSx}>{t("addressInfo")}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 520 }}>
        {t("correctAddress")}
      </Typography>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <Autocomplete
              id="city"
              options={allConfig.cityOptions}
              getOptionLabel={(option) => option.name}
              filterOptions={filterCityOptions}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false
                if (typeof option === "string" && typeof value === "string") return option === value
                if (typeof option === "object" && typeof value === "string") return option.description === value
                if (typeof option === "string" && typeof value === "object") return option === value.description
                return option?.id === value?.id || option?.description === value?.description
              }}
              noOptionsText={t("noCityFound")}
              onChange={(event, value) => {
                methods.setValue("location.district", " ")
                setCityId(value.id)
                methods.setValue("location.city", value.id)
                methods.clearErrors("location.city")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("city")}
                  error={!!methods.formState.errors.location?.city}
                  name="location.city"
                />
              )}
            />
            {methods.formState.errors.location?.city?.message && (
              <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                {methods.formState.errors.location.city.message}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={7}>
          <FormControl fullWidth>
            <Autocomplete
              id="district"
              options={districts}
              getOptionLabel={(option) => option.name}
              filterOptions={filterDistrictOptions}
              isOptionEqualToValue={(option, value) => {
                if (!option || !value) return false
                if (typeof option === "string" && typeof value === "string") return option === value
                if (typeof option === "object" && typeof value === "string") return option.description === value
                if (typeof option === "string" && typeof value === "object") return option === value.description
                return option?.id === value?.id || option?.description === value?.description
              }}
              noOptionsText={t("noDistrictFound")}
              onChange={(event, value) => {
                methods.setValue("location.district", value.id)
                methods.clearErrors("location.district")
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("district")}
                  error={!!methods.formState.errors.location?.district}
                  name="location.district"
                />
              )}
            />
            {methods.formState.errors.location?.district?.message && (
              <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                {methods.formState.errors.location.district.message}
              </p>
            )}
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Controller
              name="location.address"
              control={methods.control}
              render={({ field }) => (
                <AddressAutocomplete
                  value={field.value || ""}
                  options={listPlace}
                  loading={isLoadingUserRole}
                  onInputChange={(e, value, reason) => {
                    field.onChange(value)
                    if (reason === "input") {
                      handleInputChange(e, value)
                    }
                  }}
                  onChange={(e, value) => {
                    if (typeof value === "string") {
                      field.onChange(value)
                    } else if (value && typeof value.description === "string") {
                      field.onChange(value.description)
                    } else {
                      field.onChange("")
                    }
                    handleChange(e, value)
                  }}
                  filterOptions={filterAddressOptions}
                  error={methods.formState.errors.location?.address}
                />
              )}
            />
            {methods.formState.errors.location?.address && (
              <p className="ou-text-xs ou-text-red-600 ou-mt-1 ou-mx-[14px]">
                {methods.formState.errors.location?.address?.message}
              </p>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Register

import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"
import TextField from "@mui/material/TextField"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material"
import { Helmet } from "react-helmet"
import { CURRENT_DATE } from "../../../../lib/constants"
import useUpdateProfile from "../hooks/useUpdateProfile"
import Loading from "../../../common/components/Loading"

const UpdateProfile = ({
  userID,
  email,
  firstName,
  lastName,
  dob,
  phoneNumber,
  gender,
  handleOnSuccess,
}) => {
  const { t, tReady } = useTranslation(["register", "common", "yup-validate"])
  const { onSubmit, updateSchema } = useUpdateProfile()

  const formattedDOB = moment(dob).format("YYYY-MM-DD")

  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver(updateSchema),
    defaultValues: {
      firstName: firstName ? firstName : "",
      lastName: lastName ? lastName : "",
      email: email ? email : "",
      dob: dob ? formattedDOB : "",
      phoneNumber: phoneNumber ? phoneNumber : "",
    },
  })

  const isFormDirty = methods.formState.isDirty

  if (tReady) {
    return (
      <Box sx={{ minHeight: 240 }}>
        <Helmet>
          <title>Profile</title>
        </Helmet>
        <Loading />
      </Box>
    )
  }

  return (
    <Box>
      <Helmet>
        <title>{t("register:profile")} - OUPharmacy</title>
      </Helmet>
      <form
        onSubmit={methods.handleSubmit((data) => {
          onSubmit(data, methods.setError, userID, () => {
            handleOnSuccess()
            methods.reset({ isDirty: false })
          })
        })}
      >
        <Typography
          variant="h6"
          sx={{ color: "primary.main", fontWeight: 600, mb: 3, textAlign: "center" }}
        >
          {t("register:updateInformation")}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              autoComplete="given-name"
              id="firstName"
              name="firstName"
              type="text"
              label={t("firstName")}
              error={!!methods.formState.errors.firstName}
              helperText={methods.formState.errors.firstName?.message || ""}
              {...methods.register("firstName")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              autoComplete="family-name"
              id="lastName"
              name="lastName"
              type="text"
              label={t("lastName")}
              error={!!methods.formState.errors.lastName}
              helperText={methods.formState.errors.lastName?.message || ""}
              {...methods.register("lastName")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              autoComplete="tel"
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              label={t("phoneNumber")}
              error={!!methods.formState.errors.phoneNumber}
              helperText={methods.formState.errors.phoneNumber?.message || ""}
              {...methods.register("phoneNumber")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              autoComplete="email"
              id="email"
              name="email"
              type="email"
              spellCheck={false}
              label={t("email")}
              error={!!methods.formState.errors.email}
              helperText={methods.formState.errors.email?.message || ""}
              {...methods.register("email")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="date"
              fullWidth
              label={t("dateOfBirth")}
              type="date"
              name="dob"
              error={!!methods.formState.errors.dob}
              helperText={methods.formState.errors.dob?.message || ""}
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: moment(CURRENT_DATE).format("YYYY-MM-DD") }}
              {...methods.register("dob")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel id="profile-gender-label">{t("gender")}</InputLabel>
              <Select
                labelId="profile-gender-label"
                id="profile-gender"
                name="gender"
                label={t("gender")}
                defaultValue={parseInt(gender)}
                {...methods.register("gender")}
              >
                <MenuItem value={0}>{t("male")}</MenuItem>
                <MenuItem value={1}>{t("female")}</MenuItem>
                <MenuItem value={2}>{t("secret")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ textAlign: { xs: "stretch", sm: "right" }, mt: 3 }}>
          <Button
            sx={{ minWidth: { xs: "100%", sm: 150 } }}
            disabled={!isFormDirty}
            variant="contained"
            color="primary"
            type="submit"
          >
            {t("register:update")}
          </Button>
        </Box>
      </form>
    </Box>
  )
}

export default UpdateProfile

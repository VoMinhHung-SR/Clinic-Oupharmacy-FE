import { Box, Paper, Tooltip } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Person } from "@mui/icons-material"
import { Outlet, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { removeSymbol } from "../../lib/utils/helper"
import UpdateProfile from "../../modules/pages/ProfileComponents/UpdateProfile"
import { useTranslation } from "react-i18next"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import UserContext from "../../lib/context/UserContext"
import AvatarProfile from "../../modules/pages/ProfileComponents/AvatarProfile"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ListIcon from "@mui/icons-material/List"
import WarningIcon from "@mui/icons-material/Warning"

const navItemSx = (active, warning = false) => ({
  display: "flex",
  alignItems: "center",
  p: 1.5,
  borderRadius: 1,
  mb: 0.5,
  textDecoration: "none",
  bgcolor: active ? (warning ? "warning.main" : "primary.main") : "transparent",
  color: active
    ? warning
      ? "warning.contrastText"
      : "primary.contrastText"
    : "text.primary",
  "&:hover": {
    bgcolor: active
      ? warning
        ? "warning.dark"
        : "primary.dark"
      : "action.hover",
  },
})

const Profile = () => {
  const { user, hasValidUserAddress } = useContext(UserContext)
  const location = useLocation()
  const { t } = useTranslation(["profile"])
  const [flag, setFlag] = useState(false)
  const handleChangeFlag = () => setFlag(!flag)

  useEffect(() => {}, [flag])

  const userProfile = [
    { id: "profile", pathName: "/profile", itemTitle: t("profile"), itemIcon: <Person /> },
    {
      id: "address-info",
      pathName: "/profile/address-info",
      itemTitle: t("addressInfo"),
      itemIcon: <LocationOnIcon />,
    },
    {
      id: "patient-management",
      pathName: "/profile/patient-management",
      itemTitle: t("patientManagement"),
      itemIcon: <ListIcon />,
    },
    {
      id: "booking-list",
      pathName: "/profile/examinations",
      itemTitle: t("bookingList"),
      itemIcon: <AssignmentIcon />,
    },
  ]

  const isActive = (pathName) =>
    removeSymbol("/", pathName) === removeSymbol("/", location.pathname)

  const itemsNavigate = (itemID, pathName, itemTitle, itemIcon) => {
    const active = isActive(pathName)
    const warn = user && !hasValidUserAddress && itemID === "address-info"

    return (
      <Link key={itemID} to={pathName} style={{ textDecoration: "none", color: "inherit" }}>
        <Box sx={navItemSx(active, warn)}>
          {itemIcon}
          <Box component="span" sx={{ ml: 1, flex: 1 }}>
            {itemTitle}
          </Box>
          {warn && (
            <Tooltip title={t("profile:addressInfoNotSet")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  color: active ? "inherit" : "warning.main",
                }}
              >
                <WarningIcon fontSize="small" />
              </Box>
            </Tooltip>
          )}
        </Box>
      </Link>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <AvatarProfile />
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
          {userProfile.map((items) =>
            itemsNavigate(items.id, items.pathName, items.itemTitle, items.itemIcon)
          )}
        </Paper>
      </Box>

      <Paper
        elevation={1}
        sx={{
          width: { xs: "100%", md: "70%" },
          flex: 1,
          minWidth: 0,
          borderRadius: 2,
          bgcolor: "background.paper",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ p: { xs: 2, sm: 2.5 }, flex: 1, minHeight: 280 }}>
          {removeSymbol("/", location.pathname) === "profile" ? (
            <UpdateProfile
              userID={user.id}
              dob={user.date_of_birth}
              gender={parseInt(user.gender)}
              email={user.email}
              firstName={user.first_name}
              lastName={user.last_name}
              phoneNumber={user.phone_number}
              handleOnSuccess={handleChangeFlag}
            />
          ) : (
            <Outlet />
          )}
        </Box>
      </Paper>
    </Box>
  )
}

export default Profile

import { Box, Paper } from "@mui/material"
import { useContext, useEffect, useState } from "react"
import { Person } from "@mui/icons-material"
import { Outlet, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { removeSymbol } from "../../../lib/utils/helper"
import UpdateProfile from "../../../modules/pages/ProfileComponents/UpdateProfile"
import { useTranslation } from "react-i18next"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import UserContext from "../../../lib/context/UserContext"
import AvatarProfile from "../../../modules/pages/ProfileComponents/AvatarProfile"
import AssignmentIcon from "@mui/icons-material/Assignment"
import ListIcon from "@mui/icons-material/List"
import WarningIcon from "@mui/icons-material/Warning"
import Tooltip from "@mui/material/Tooltip"
import {
  DASHBOARD_PAGE_FRAME_SX,
  DASHBOARD_SURFACE,
} from "../../../modules/common/layout/dashboard/styleTokens"

const navItemSx = (isActive, variant = "primary") => ({
  display: "flex",
  alignItems: "center",
  p: 1.5,
  borderRadius: 1,
  ...(isActive && variant === "warning"
    ? { bgcolor: "warning.main", color: "warning.contrastText" }
    : isActive
      ? { bgcolor: "primary.main", color: "primary.contrastText" }
      : {}),
})

const DashboardProfile = () => {
  const { user, hasValidUserAddress } = useContext(UserContext)

  const location = useLocation()
  const { t } = useTranslation(["profile"])
  const userProfile = [
    {
      id: "D-profile",
      pathName: "/dashboard/profile",
      itemTitle: t("profile"),
      itemIcon: <Person />,
    },
    {
      id: "D-address-info",
      pathName: "/dashboard/profile/address-info",
      itemTitle: t("addressInfo"),
      itemIcon: <LocationOnIcon />,
    },
    {
      id: "D-patient-management",
      pathName: "/dashboard/profile/patient-management",
      itemTitle: t("patientManagement"),
      itemIcon: <ListIcon />,
    },
    {
      id: "D-booking-list",
      pathName: "/dashboard/profile/examinations",
      itemTitle: t("bookingList"),
      itemIcon: <AssignmentIcon />,
    },
  ]

  const [flag, setFlag] = useState(false)
  const handleChangeFlag = () => setFlag(!flag)

  useEffect(() => {}, [flag])

  const itemsNavigate = (itemID, pathName, itemTitle, itemIcon) => {
    const isActive = removeSymbol("/", pathName) === removeSymbol("/", location.pathname)

    if (user && !hasValidUserAddress && itemID === "D-address-info") {
      return (
        <Link key={itemID} to={pathName} style={{ textDecoration: "none", color: "inherit" }}>
          <Box sx={navItemSx(isActive, "warning")}>
            {itemIcon}
            <Box component="span" sx={{ ml: 1 }}>
              {itemTitle}
            </Box>
            <Tooltip title={t("profile:addressInfoNotSet")}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: "auto",
                  color: isActive ? "inherit" : "warning.main",
                }}
              >
                <WarningIcon />
              </Box>
            </Tooltip>
          </Box>
        </Link>
      )
    }

    return (
      <Link key={itemID} to={pathName} style={{ textDecoration: "none", color: "inherit" }}>
        <Box sx={navItemSx(isActive)}>
          {itemIcon}
          <Box component="span" sx={{ ml: 1 }}>
            {itemTitle}
          </Box>
        </Box>
      </Link>
    )
  }

  const paperSx = {
    borderRadius: DASHBOARD_SURFACE.borderRadius,
    p: 2.5,
  }

  return (
    <Box
      sx={{
        ...DASHBOARD_PAGE_FRAME_SX,
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: "30%" },
          flexShrink: 0,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxHeight: { xs: "none", md: "100%" },
        }}
      >
        <AvatarProfile />
        <Paper
          elevation={DASHBOARD_SURFACE.elevation}
          sx={{
            ...paperSx,
            flex: { md: 1 },
            minHeight: 0,
            overflow: "auto",
          }}
          className="ou-scrollbar"
        >
          {userProfile.map((items) =>
            itemsNavigate(items.id, items.pathName, items.itemTitle, items.itemIcon)
          )}
        </Paper>
      </Box>

      <Paper
        elevation={DASHBOARD_SURFACE.elevation}
        sx={{
          ...paperSx,
          flex: 1,
          minHeight: 0,
          minWidth: 0,
          overflow: "auto",
        }}
        className="ou-scrollbar"
      >
        {removeSymbol("/", location.pathname) === "dashboardprofile" ? (
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
      </Paper>
    </Box>
  )
}

export default DashboardProfile

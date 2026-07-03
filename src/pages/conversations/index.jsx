import { Box, Button, Container, Tooltip, Typography } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Outlet, useLocation, useNavigate, useParams } from "react-router"
import useConversationList from "../../modules/pages/ConversationListComponents/hooks/useConversationList"
import SidebarInbox from "../../modules/pages/ConversationListComponents/SidebarInbox"
import { Helmet } from "react-helmet"
import IconRecipientChatPlaceholder from "../../lib/assets/iconRecipientChatPlaceholder"
import DashboardSplitShell from "../../modules/common/layout/dashboard/shell/DashboardSplitShell"
import DashboardPaneHeader from "../../modules/common/layout/dashboard/components/DashboardPaneHeader"
import SkeletonListLineItem from "../../modules/common/components/skeletons/listLineItem"
import { DASHBOARD_PAGE_FRAME_SX } from "../../modules/common/layout/dashboard/styleTokens"

const ChatPlaceholder = ({ title }) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%", minHeight: 280 }}>
    <DashboardPaneHeader title={title} />
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        p: 2,
      }}
    >
      <Tooltip title={title}>
        <Box>
          <IconRecipientChatPlaceholder size={280} />
        </Box>
      </Tooltip>
      <Typography color="text.secondary">{title}</Typography>
    </Box>
  </Box>
)

const ConversationListSkeleton = ({ isDashboard }) => {
  if (isDashboard) {
    return (
      <DashboardSplitShell
        left={
          <Box sx={{ p: 2 }}>
            <SkeletonListLineItem count={8} height="48px" className="ou-w-full" />
          </Box>
        }
        right={
          <Box sx={{ p: 2, height: "100%" }}>
            <SkeletonListLineItem count={1} height="320px" className="ou-w-full" />
          </Box>
        }
      />
    )
  }

  return (
    <Box sx={{ p: 2 }}>
      <SkeletonListLineItem count={1} height="400px" className="ou-w-full" />
    </Box>
  )
}

const ConversationList = () => {
  const { t, tReady } = useTranslation(["common", "modal", "conversation"])
  const { user } = useConversationList()
  const router = useNavigate()
  const location = useLocation()
  const { conversationId, recipientId } = useParams()

  const isDashboard = location.pathname.startsWith("/dashboard")
  const selectUserLabel = t("conversation:selectUser")

  if (!tReady)
    return (
      <Box sx={isDashboard ? DASHBOARD_PAGE_FRAME_SX : { p: 1.5 }}>
        <Helmet>
          <title>{t("common:conversations")}</title>
        </Helmet>
        <ConversationListSkeleton isDashboard={isDashboard} />
      </Box>
    )

  if (!user)
    return (
      <>
        <Helmet>
          <title>{t("common:conversations")}</title>
        </Helmet>
        <Box
          sx={{
            ...(isDashboard ? DASHBOARD_PAGE_FRAME_SX : { height: 550, position: "relative" }),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
          }}
        >
          <Container sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="error" gutterBottom>
              {t("common:errNullUser")}
            </Typography>
            <Button onClick={() => router("/login")}>{t("common:here")}!</Button>
          </Container>
        </Box>
      </>
    )

  const chatPane =
    conversationId && recipientId ? <Outlet /> : <ChatPlaceholder title={selectUserLabel} />

  if (!isDashboard) {
    return (
      <>
        <Helmet>
          <title>{t("common:conversations")} - OUPharmacy</title>
        </Helmet>
        <Box sx={{ width: "100%", display: "flex", minHeight: 600 }}>
          <Box
            width="30%"
            height={700}
            className="ou-recipients-conversation ou-mr-2"
            sx={{ flexShrink: 0 }}
          >
            <SidebarInbox user={user} />
          </Box>
          <Box
            width="70%"
            height={700}
            className="ou-overflow-hidden ou-h-full ou-ml-2 ou-chat-window"
          >
            {chatPane}
          </Box>
        </Box>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>{t("common:conversations")} - OUPharmacy</title>
      </Helmet>
      <DashboardSplitShell fillViewport left={<SidebarInbox user={user} />} right={chatPane} />
    </>
  )
}

export default ConversationList

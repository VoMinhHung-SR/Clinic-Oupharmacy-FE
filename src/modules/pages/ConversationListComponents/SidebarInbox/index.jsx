import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import Loading from "../../../common/components/Loading"
import SearchIcon from "@mui/icons-material/Search"
import useSidebarInbox from "./hooks/useSidebarInbox"
import usePharmacistConsultQueue from "./hooks/usePharmacistConsultQueue"
import ConversationDetail from "../ConversationComponents"
import { useTranslation } from "react-i18next"
import {
  AVATAR_DEFAULT,
  ERROR_CLOUDINARY,
  ROLE_DOCTOR,
  ROLE_NURSE,
  ROLE_PHARMACIST,
  ROLE_USER,
} from "../../../../lib/constants"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import clsx from "clsx"
import { useState } from "react"
import { dashboardRadius } from "../../../common/layout/dashboard/styleTokens"

const SidebarInbox = (props) => {
  const { t } = useTranslation(["conversation"])
  const {
    isLoadingRecipients,
    recipients,
    conversationsSnapshot,
    name,
    setName,
    createNewConversation,
  } = useSidebarInbox(props.user)

  const isPharmacist = props.user?.role === ROLE_PHARMACIST || props.user?.is_admin
  const {
    loading: queueLoading,
    sessions,
    busyId,
    reload,
    claimAndOpen,
    completeSession,
  } = usePharmacistConsultQueue(props.user, Boolean(isPharmacist))

  const [activePanel, setActivePanel] = useState(isPharmacist ? "queue" : "inbox")

  if (isLoadingRecipients) {
    return (
      <Box className="ou-h-full ou-flex ou-justify-center ou-items-center">
        <Box className="ou-p-5">
          <Loading />
        </Box>
      </Box>
    )
  }

  const availableRecipients = recipients
    .filter((recipient) => {
      return !conversationsSnapshot?.docs.some((conversation) =>
        conversation.data().members.includes(recipient.id)
      )
    })
    .filter((obj) => obj.id !== props.user.id && obj.role !== ROLE_USER)

  const waitingCount = sessions.filter((s) => s.status === "WAITING_FOR_PROFESSIONAL").length

  const handleTabChange = (_event, value) => {
    setActivePanel(value)
    if (value === "queue") reload()
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 0,
      }}
    >
      <Typography
        variant="subtitle1"
        component="div"
        sx={{ pt: { xs: 1.5, sm: 2 }, px: 2, pb: 1, fontWeight: "bold", flexShrink: 0 }}
      >
        {t("chat")}
      </Typography>

      <Box sx={{ flexShrink: 0, borderBottom: 1, borderColor: "divider", px: 0.5 }}>
        <Tabs
          value={activePanel}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 40,
            "& .MuiTabs-flexContainer": { gap: 0.25 },
            "& .MuiTab-root": {
              minHeight: 40,
              minWidth: "auto",
              px: { xs: 1, sm: 1.5 },
              py: 0.75,
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              fontWeight: 500,
              textTransform: "none",
              whiteSpace: "nowrap",
            },
            "& .Mui-selected": { fontWeight: 600 },
          }}
        >
          {isPharmacist ? (
            <Tab
              value="queue"
              label={
                <Tooltip title={t("consultQueue")} enterDelay={600}>
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                    {t("tabQueue")}
                    {waitingCount > 0 ? (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          minWidth: 18,
                          height: 18,
                          px: 0.5,
                          borderRadius: 999,
                          bgcolor: "primary.main",
                          color: "primary.contrastText",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        {waitingCount > 99 ? "99+" : waitingCount}
                      </Box>
                    ) : null}
                  </Box>
                </Tooltip>
              }
            />
          ) : null}
          <Tab
            value="inbox"
            label={
              <Tooltip title={t("conversation")} enterDelay={600}>
                <span>{t("tabInbox")}</span>
              </Tooltip>
            }
          />
          <Tab
            value="users"
            label={
              <Tooltip title={t("user")} enterDelay={600}>
                <span>{t("tabUsers")}</span>
              </Tooltip>
            }
          />
        </Tabs>
      </Box>

      {activePanel === "users" ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            flexShrink: 0,
            px: 2,
            py: 1.25,
            bgcolor: "grey.50",
            borderRadius: `0 0 ${dashboardRadius("control")} ${dashboardRadius("control")}`,
          }}
        >
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="sidebar-inbox-user-search"
            fullWidth
            placeholder={t("enterUserEmail")}
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            variant="standard"
            size="small"
          />
        </Box>
      ) : null}

      <List sx={{ overflowY: "auto", flex: 1, minHeight: 0, py: 0 }}>
          {activePanel === "queue" && isPharmacist && (
            <>
              {queueLoading ? (
                <Box className="ou-p-4 ou-flex ou-justify-center">
                  <Loading />
                </Box>
              ) : sessions.length === 0 ? (
                <Box className="ou-text-center ou-py-3 ou-text-gray-400">{t("consultQueueEmpty")}</Box>
              ) : (
                sessions.map((session) => {
                  const waiting = session.status === "WAITING_FOR_PROFESSIONAL"
                  const mine = session.pharmacist_id === props.user.id
                  const actions = (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", sm: "column" },
                        flexWrap: "wrap",
                        gap: 0.75,
                        mt: { xs: 1, sm: 0 },
                      }}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        disabled={busyId === session.id}
                        onClick={() => claimAndOpen(session)}
                      >
                        {waiting ? t("consultClaim") : t("consultOpen")}
                      </Button>
                      {mine && session.status === "IN_PROGRESS" ? (
                        <Button
                          size="small"
                          variant="outlined"
                          disabled={busyId === session.id}
                          onClick={() => completeSession(session)}
                        >
                          {t("consultComplete")}
                        </Button>
                      ) : null}
                    </Box>
                  )
                  return (
                    <ListItem
                      key={session.id}
                      alignItems="flex-start"
                      secondaryAction={
                        <Box sx={{ display: { xs: "none", sm: "block" } }}>{actions}</Box>
                      }
                      sx={{
                        flexDirection: "column",
                        alignItems: "stretch",
                        pr: { xs: 2, sm: 14 },
                        py: 1.25,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography variant="body2" fontWeight={600}>
                            #{session.id} · {waiting ? t("consultWaiting") : t("consultInProgress")}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary" component="span">
                            {session.need_text?.trim() || t("consultNoNeedText")}
                          </Typography>
                        }
                      />
                      <Box sx={{ display: { xs: "block", sm: "none" } }}>{actions}</Box>
                    </ListItem>
                  )
                })
              )}
            </>
          )}

          {activePanel === "inbox" && (
            <>
              {conversationsSnapshot?.docs.map((c) => (
                <ConversationDetail id={c.id} key={c.id} members={c.data().members} />
              ))}
              {conversationsSnapshot?.docs?.length == 0 && (
                <Box className="ou-text-center ou-py-3 ou-text-gray-400">{t("errNoConversation")}</Box>
              )}
            </>
          )}

          {activePanel === "users" && (
            <>
              {availableRecipients.length === 0 ? (
                <Box className="ou-text-center ou-py-3 ou-text-gray-400">{t("errNoRecipient")}</Box>
              ) : (
                availableRecipients.map((u) => (
                  <ListItem
                    className="ou-cursor-pointer hover:ou-bg-gray-300"
                    key={u.id}
                    id={u.id}
                    onClick={() => {
                      createNewConversation(u.id)
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={u.email ? u.email : "unknown"}
                        src={u.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : u.avatar_path}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          className={clsx("ou-truncate", {
                            "!ou-text-blue-700": u.role === ROLE_DOCTOR,
                            "!ou-text-green-700": u.role === ROLE_NURSE,
                          })}
                        >
                          {u.first_name + " " + u.last_name}
                          {u.role === ROLE_DOCTOR ? (
                            <Tooltip title={t("isDoctor")} followCursor>
                              <span>
                                <AccountCircleIcon />
                              </span>
                            </Tooltip>
                          ) : u.role === ROLE_NURSE ? (
                            <Tooltip title={t("isNurse")} followCursor>
                              <span>
                                <AccountCircleIcon />
                              </span>
                            </Tooltip>
                          ) : (
                            <></>
                          )}
                        </Box>
                      }
                      secondary={u.email}
                    />
                  </ListItem>
                ))
              )}
            </>
          )}
        </List>
    </Box>
  )
}

export default SidebarInbox

import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material"
import Loading from "../../../common/components/Loading"
import SearchIcon from "@mui/icons-material/Search"
import useSidebarInbox from "./hooks/useSidebarInbox"
import ConversationDetail from "../ConversationComponents"
import { useTranslation } from "react-i18next"
import {
  AVATAR_DEFAULT,
  ERROR_CLOUDINARY,
  ROLE_DOCTOR,
  ROLE_NURSE,
  ROLE_USER,
} from "../../../../lib/constants"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import clsx from "clsx"
import { useState } from "react"

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

  const [activePanel, setActivePanel] = useState("inbox")

  const tabSx = (selected) => ({
    flex: 1,
    borderRadius: 0,
    borderBottom: 2,
    borderColor: selected ? "primary.main" : "transparent",
    color: selected ? "primary.main" : "text.secondary",
    fontWeight: selected ? 600 : 500,
  })

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

  return (
    <Grid>
      <Grid item>
        <Typography
          variant="subtitle1"
          gutterBottom
          component="div"
          sx={{ paddingTop: 2, paddingLeft: 2, fontWeight: "bold" }}
        >
          {t("chat")}
        </Typography>
        <Box
          sx={{
            padding: "0px 5px",
            display: "flex",
            alignItems: "flex-end",
          }}
          className="ou-w-full !ou-px-3 !ou-py-2"
        >
          <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            id="input-with-sx"
            className="ou-w-full"
            placeholder={t("enterUserEmail")}
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            variant="standard"
          />
        </Box>
        <Divider />

        <Box sx={{ display: "flex", px: 0.5, gap: 0.5 }}>
          <Button
            type="button"
            onClick={() => setActivePanel("inbox")}
            sx={{
              ...tabSx(activePanel === "inbox"),
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 0.5, sm: 1 },
              minWidth: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t("conversation")}
          </Button>
          <Button
            type="button"
            onClick={() => setActivePanel("users")}
            sx={{
              ...tabSx(activePanel === "users"),
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
              px: { xs: 0.5, sm: 1 },
              minWidth: 0,
              whiteSpace: "nowrap",
            }}
          >
            {t("user")}
          </Button>
        </Box>
        <Divider />

        <List sx={{ overflowY: "auto" }}>
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
      </Grid>
    </Grid>
  )
}

export default SidebarInbox

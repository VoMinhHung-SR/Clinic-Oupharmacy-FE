import {
  Avatar,
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  OutlinedInput,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"
import useChatWindow from "../../../../../modules/pages/ChatWindowComponents/hooks/useChatWindow"
import MessageCard from "../../../../../modules/common/components/card/MessageCard"
import { transformMessage } from "../../../../../lib/utils/getMessagesInConversation"
import InsertCommentIcon from "@mui/icons-material/InsertComment"
import { useTranslation } from "react-i18next"
import { AVATAR_DEFAULT, ERROR_CLOUDINARY } from "../../../../../lib/constants"
import { Helmet } from "react-helmet"
import { useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"

const ChatWindow = () => {
  const {
    recipient,
    newMessage,
    setNewMessage,
    sendMessageOnClick,
    sendMessageOnEnter,
    messagesSnapshot,
  } = useChatWindow()
  const { t } = useTranslation(["conversation", "common"])
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const navigate = useNavigate()
  const location = useLocation()

  const chatWindowRef = useRef(null)
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messagesSnapshot])

  const backToListPath = location.pathname.startsWith("/dashboard")
    ? "/dashboard/conversations"
    : "/conversations"

  const renderMessages = () => {
    if (messagesSnapshot) {
      if (messagesSnapshot.docs.length === 0) {
        return (
          <Box
            sx={{
              opacity: 0.5,
              textAlign: "center",
              minHeight: { xs: 280, md: 420 },
              display: "grid",
              placeContent: "center",
              gap: 1,
            }}
          >
            <InsertCommentIcon sx={{ width: 48, height: 48, mx: "auto" }} />
            <Typography>{t("conversation:errNoMessage")}</Typography>
          </Box>
        )
      }
      return messagesSnapshot.docs.map((message) => (
        <Box sx={{ p: 1 }} key={message.id}>
          <MessageCard id={message.id} message={transformMessage(message)} />
        </Box>
      ))
    }
    return null
  }

  return (
    <>
      <Helmet>
        <title>{t("common:conversations")} - OUPharmacy</title>
      </Helmet>

      <Grid item sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
        <Box sx={{ bgcolor: "primary.main", flexShrink: 0 }}>
          <ListItem
            sx={{
              color: "primary.contrastText",
              py: { xs: 1, sm: 1.5 },
              px: { xs: 1, sm: 2 },
            }}
          >
            {isMobile && (
              <IconButton
                edge="start"
                aria-label={t("conversation:backToList")}
                onClick={() => navigate(backToListPath)}
                sx={{ color: "inherit", mr: 0.5 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            {recipient !== null ? (
              <>
                <ListItemAvatar sx={{ minWidth: 48 }}>
                  <Avatar
                    alt="Profile Picture"
                    src={
                      recipient.avatar_path === ERROR_CLOUDINARY
                        ? AVATAR_DEFAULT
                        : recipient.avatar_path
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={recipient.email ? recipient.email : " "}
                  primaryTypographyProps={{
                    noWrap: true,
                    sx: { color: "inherit", fontSize: { xs: "0.9rem", sm: "1rem" } },
                  }}
                />
              </>
            ) : (
              <>
                <ListItemAvatar>
                  <Avatar alt="Profile Picture" src={AVATAR_DEFAULT} />
                </ListItemAvatar>
                <ListItemText primary={" "} />
              </>
            )}
          </ListItem>
        </Box>

        <Box
          id="chat-window"
          ref={chatWindowRef}
          sx={{
            flex: 1,
            minHeight: { xs: 280, sm: 360, md: 420 },
            maxHeight: { xs: "55vh", md: 520 },
            bgcolor: "grey.200",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {renderMessages()}
        </Box>

        <Box sx={{ flexShrink: 0, p: { xs: 1, sm: 1.5 } }}>
          <FormControl fullWidth>
            <OutlinedInput
              multiline
              placeholder={t("conversation:enterMessage")}
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              onKeyDown={sendMessageOnEnter}
              rows={2}
              endAdornment={
                <InputAdornment position="end">
                  <SendIcon
                    style={{ cursor: "pointer" }}
                    onClick={sendMessageOnClick}
                    disabled={!newMessage}
                  />
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
      </Grid>
    </>
  )
}

export default ChatWindow

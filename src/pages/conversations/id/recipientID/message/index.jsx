import { Avatar, Box, FormControl, Grid, InputAdornment, ListItem, ListItemAvatar, ListItemText, OutlinedInput, Typography } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
import useChatWindow from "../../../../../modules/pages/ChatWindowComponents/hooks/useChatWindow";
import MessageCard from "../../../../../modules/common/components/card/MessageCard";
import { transformMessage } from "../../../../../lib/utils/getMessagesInConversation";
import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { useTranslation } from "react-i18next";
import { AVATAR_DEFAULT, ERROR_CLOUDINARY } from "../../../../../lib/constants";
import { Helmet } from "react-helmet";
import { useEffect, useRef } from "react";

const ChatWindow = () => {
    const {recipient, newMessage, setNewMessage, 
        // refEndMessage,
        sendMessageOnClick, sendMessageOnEnter, messagesSnapshot} = useChatWindow()
    const {t} = useTranslation(['conversation', 'common'])

    const chatWindowRef = useRef(null);
    useEffect(() => {
        if (chatWindowRef.current) {
          chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
      }, [messagesSnapshot]);


    const renderMessages = () => {
        // if (messagesLoading) {
        //     return messagesInCoversation.map(message => (
        //         <Box sx={{ p: 1 }} >
        //             <MessageCard key={message.id} id={message.id} message={message.text} />
        //         </Box>

        //     ))
        // }
        // If front-end has finished loading messages, so now we have messagesSnapshot
        if (messagesSnapshot) {
            if(messagesSnapshot.docs.length === 0)
                return (
                <h3 className="ou-opacity-50 ou-text-center ou-h-[565px] ou-m-auto ou-grid ou-place-content-center">
                    <Box>
                        <InsertCommentIcon sx={{width:50, height:50}}/> 
                    </Box>
                    <Box className="ou-pt-3">
                        <Typography>{t('conversation:errNoMessage')}</Typography>
                    </Box>
                </h3>)
            return messagesSnapshot.docs.map((message, index) => (
                <Box sx={{ p: 1 }}   
                 >
                     <div >
                        <MessageCard id={message.id} message={transformMessage(message)} />
                    </div>
                </Box>
            ))
        }
        return null
    }

    return (<>
        <Helmet>
            <title>{t('common:conversations')} - OUPharmacy</title>
        </Helmet>

        <Grid item >
            <Box square className="ou-bg-blue-600">
                <ListItem key={""}>
                    {recipient !== null ?
                        (
                            <>
                                <ListItemAvatar>
                                    <Avatar
                                        alt="Profile Picture"
                                        src={recipient.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : recipient.avatar_path }
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={recipient.email ? recipient.email :" "} style={{ "color": "white" }} />
                            </>

                        ) : <>
                            <ListItemAvatar>
                                <Avatar
                                    alt="Profile Picture"
                                    src={AVATAR_DEFAULT}
                                />
                            </ListItemAvatar>
                            <ListItemText primary={" " + conversationId} style={{ "color": "white" }} />
                        </>}
                    
                </ListItem>
            </Box>

            
            <Box id="chat-window" className="ou-h-[565px]"
                ref={chatWindowRef}
                sx={{ backgroundColor: "lightGray", overflowY: "auto",   
                    position: "relative", scrollBehavior:"smooth",
                    top: 0,
                    bottom: 0,}}> 
                {renderMessages()}
            </Box> 
           
            
            <Box height={"60px"}>
                <FormControl fullWidth >
                    <OutlinedInput
                        className="m-2"
                        multiline
                        placeholder={t('conversation:enterMessage')}
                        value={newMessage}
                        onChange={event => setNewMessage(event.target.value)}
                        onKeyDown={sendMessageOnEnter}
                        rows={2}
                        endAdornment={
                            <InputAdornment position="end">
                                <SendIcon
                                    style={{ cursor: "pointer" }}
                                    onClick={sendMessageOnClick}
                                    disabled={!newMessage}
                                />
                            </InputAdornment>}
                    />
                </FormControl>
            </Box>
        </Grid>

    </>)
}
export default ChatWindow


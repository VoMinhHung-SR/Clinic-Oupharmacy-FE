import { Avatar, Box, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, TextField, Tooltip, Typography } from "@mui/material";
import Loading from "../../../common/components/Loading";
import SearchIcon from '@mui/icons-material/Search';
import useSidebarInbox from "./hooks/useSidebarInbox";
import ConversationDetail from "../ConversationComponents";
import { useTranslation } from "react-i18next";
import { AVATAR_DEFAULT, ERROR_CLOUDINARY, ROLE_DOCTOR, ROLE_NURSE, ROLE_USER } from "../../../../lib/constants";

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import clsx from "clsx";
import { useState } from "react";

const SidebarInbox = (props) => {
    const {t} = useTranslation(['conversation'])
    const {isLoadingRecipients, recipients, conversationsSnapshot, name, setName,
        createNewConversation} = useSidebarInbox(props.user)

    const renderDayFromNow = (dateString, language) => {
        moment.locale(language);
        const date = moment(dateString);
        return date.fromNow();
        }

    return (
        <>
            {isLoadingRecipients ?
                (<>
                    <Box className="ou-h-full ou-flex ou-justify-center ou-items-center">
                        <Box className='ou-p-5'>
                            <Loading />
                        </Box>
                    </Box>
                </>)
                : <Grid>
                    <Grid item>
                        <Typography variant="subtitle1" gutterBottom component="div"
                            sx={{ paddingTop: 2, paddingLeft: 2, fontWeight: 'bold' }}>
                            {t('chat')}
                        </Typography>
                        <Box sx={{
                            padding: "0px 5px", display: 'flex',
                            alignItems: 'flex-end',
                        }} className="ou-w-full !ou-px-3 !ou-py-2">
                            <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                            <TextField id="input-with-sx" className="ou-w-full"
                                placeholder={t('enterUserEmail')}
                                value={name}
                                onChange={(evt) => setName(evt.target.value)}
                                variant="standard" />
                        </Box>
                        <Divider />

                        <List sx={{  overflowY:"auto" }}>
                            <Typography className="ou-py-2 ou-text-center ou-text-green-700">{t('conversation')}</Typography>
                            {conversationsSnapshot?.docs.map((c)=>(
                                <ConversationDetail 
                                    id={c.id}
                                    key = {c.id}
                                    members={c.data().members}

                                />
                            ))}

                            {/* {isAnyChildLoading && <Box className='ou-p-5'><Loading /></Box>} */}

                            {conversationsSnapshot?.docs?.length == 0 &&  
                                <Box className="ou-text-center ou-py-3 ou-text-gray-400">
                                    {t('errNoConversation')}
                                </Box>
                            }
                               <Divider />
                            <Typography className="ou-text-center ou-pt-4 ou-pb-2 ou-text-blue-700">{t('user')}</Typography>
                            {recipients.length === 0 ? <Box className="ou-text-center ou-py-3 ou-text-gray-400">{t('errNoRecipient')}</Box> 
                                : ( recipients
                                    .filter((recipient) => {
                                        // Check if recipient's id is not in any of the conversation's members
                                        return !conversationsSnapshot?.docs.some(
                                          (conversation) => conversation.data().members.includes(recipient.id)
                                        );
                                      })
                                    .filter((obj)=> obj.id !== props.user.id && obj.role !== ROLE_USER).map((u) => (
                                        
                                        <ListItem className="ou-cursor-pointer hover:ou-bg-gray-300" key={u.id} id={u.id} onClick={()=>{
                                            createNewConversation(u.id);
                                        }}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={u.email ? u.email : "unknown"}
                                                    src={u.avatar_path === ERROR_CLOUDINARY ? AVATAR_DEFAULT : u.avatar_path}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary=
                                                    {
                                                    <Box className={clsx('ou-truncate',{
                                                        '!ou-text-blue-700': u.role === ROLE_DOCTOR,
                                                        "!ou-text-green-700":  u.role === ROLE_NURSE})
                                                      } >{u.first_name + " " + u.last_name}  
                                                        {u.role === ROLE_DOCTOR ? <Tooltip title={t('isDoctor')} followCursor><span><AccountCircleIcon/></span></Tooltip>
                                                        : u.role === ROLE_NURSE ? <Tooltip title={t('isNurse')} followCursor><span><AccountCircleIcon/></span></Tooltip>
                                                        : <></>}
                                                    </Box>
                                                }
                                                secondary={u.email}
                                            />
                                        </ListItem>))
                                    )
                            }

                        </List>
                    </Grid>
                </Grid>}

        </>)
}
export default SidebarInbox
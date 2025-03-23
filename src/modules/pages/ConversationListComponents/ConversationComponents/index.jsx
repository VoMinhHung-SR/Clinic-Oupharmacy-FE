import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router"
import Loading from "../../../common/components/Loading"
import useConversationDetail from "../hooks/useConvesationDetail"
import { AVATAR_DEFAULT, ERROR_CLOUDINARY } from "../../../../lib/constants"
import { useTranslation } from "react-i18next"

const ConversationDetail = (props) => {
    const {t} = useTranslation(['common', 'conversation'])    
    const {docs, loading, error, recipientId} = useConversationDetail(props.members)
    const router = useNavigate()
    const location = useLocation();
    const onSelectConversation = () =>{
        if (location.pathname.includes("/dashboard/conversations")) {
            router(`/dashboard/conversations/${props.id}/${recipientId}/message`);
        } else if (location.pathname.includes("/conversations")) {
            router(`/conversations/${props.id}/${recipientId}/message`);
        }
    }

    if (loading)
        return <Loading/>

    return (<>
       
        {docs?.docs[0]?.data() !== null ? (
            <ListItem className="ou-cursor-pointer hover:ou-bg-gray-300" key={docs?.docs[0]?.data().id} 
                onClick={onSelectConversation}
            >
                <ListItemAvatar>
                    <Avatar
                        alt={docs?.docs[0]?.data().email ? docs?.docs[0].data().email : t('common:undefined')}
                        src={docs?.docs[0]?.data().avatar === ERROR_CLOUDINARY ? AVATAR_DEFAULT : docs?.docs[0].data().avatar  }
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={<Box className="ou-truncate">{docs?.docs[0]?.data().fullName}</Box>}
                    secondary={docs?.docs[0]?.data().email}
                />
            </ListItem>
        ): <>
            <Typography>{t('conversation:errNoConversation')}</Typography>
        </>}
    </>)
}
export default ConversationDetail
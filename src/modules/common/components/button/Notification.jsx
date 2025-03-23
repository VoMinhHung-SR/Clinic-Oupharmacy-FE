import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge, Typography } from '@mui/material';
import NotifyMessage from '../../../pages/NotificationComponents/NotifyMessage';
import Loading from '../Loading';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';

export default function NotificationButton({ length, isLoading, items, updateNotifications }) {
  const {t} = useTranslation(['common'])

  const unreadNotifications = items.filter(item => !item.is_commit);
  const readNotifications = items.filter(item => item.is_commit && item.is_active === true);

  const [state, setState] = React.useState({
    left: false,
    right: false,
  });

  const handleMark = (items) => {
    updateNotifications(items, 'mark');
  };

  const handleDelete = (items) => {
    updateNotifications(items, 'delete')
  }

  const renderNotify = () => {
    if (!unreadNotifications.length && !readNotifications.length)
      return <ListItemText primary={t('common:nonNotifications')}  className='ou-pl-8 ou-py-2 ou-opacity-70'/> 
    else 
      return (
        <>
          {/* render un-read area */}
          {unreadNotifications.length === 0 ?  <>
            <ListItemText className='ou-pl-4'
              primary={
                <div className='ou-flex ou-items-center'>
                  <p className='ou-text-left'>{t('common:newerNotification')}</p>
                </div>
              }/>
            <ListItemText primary={t('common:nonNotifications')}  className='ou-pl-8 ou-py-2 ou-opacity-70'/> 
          </>
          : <>
             <ListItemText className='ou-pl-4'
              primary={<>
                <div className='ou-flex ou-items-center'>
                  <p className='ou-text-left'>{t('common:newerNotification')}</p>
                  <div className='ou-text-right ou-text-xs  ou-ml-auto ou-pr-4 ou-underline ou-text-blue-700 '>
                    <i className='hover:ou-cursor-pointer' onClick={() => handleMark(unreadNotifications)}>{t('common:markAllAsRead')}</i>
                  </div>
                </div>
                </>
              }/>
              {unreadNotifications.map((content)=> 
              <NotifyMessage key={content.id} 
                content={content.content}
                recipientId={content.recipient_id}
                examinationId={content.booking_id}
                sentAt={content.sent_at}
                avatar={content.avatar}
              />)}
            </>
          }

           {/* render read area */}
          {readNotifications.length === 0 ?  <>
            <ListItemText className='ou-pl-4'
              primary={
                <div className='ou-flex ou-items-center'>
                  <p className='ou-text-left'>{t('common:olderNotification')}</p>
                </div>
              }/>
            <ListItemText primary={t('common:nonNotifications')}  className='ou-pl-8 ou-py-2 ou-opacity-70'/> 
          </>
          : <>
             <ListItemText className='ou-pl-4'
              primary={<>
                <div className='ou-flex ou-items-center'>
                  <p className='ou-text-left'>{t('common:olderNotification')}</p>
                  <div className='ou-text-right ou-text-xs  ou-ml-auto ou-pr-4 ou-underline ou-text-blue-700 '>
                    <i className='hover:ou-cursor-pointer' onClick={() => handleDelete(readNotifications)}>{t('common:deleteAll')}</i>
                  </div>
                </div>
                </>
              }/>

              {readNotifications
              .map((content)=> 
                <NotifyMessage key={content.id} 
                  content={content.content}
                  recipientId={content.recipient_id}
                  examinationId={content.booking_id}
                  sentAt={content.sent_at}
                  avatar={content.avatar}
                />
              )}
            </>
          }

          </>
      )
  }

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 360 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {[t('common:notifications')].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <CloseIcon/>
              </ListItemIcon>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isLoading && items.length === 0 ? <>
          <Box>
              <Loading/>
          </Box>
        </> : items.length === 0 ? <>
              <ListItemButton>
                <ListItemText primary={t('common:nonNotifications')} />
              </ListItemButton>
        </> :<>
          {renderNotify()}
          </>

        }
      </List>
    </Box>
  );

  return (
    <div>
      {['right'].map((anchor) => (
        <React.Fragment key={anchor}>
            <Badge 
                badgeContent={length} 
                color="error"
                onClick={toggleDrawer(anchor, true)}
            >
                <NotificationsIcon sx={{fontSize:"26px"}}   className='ou-text-inherit'/>
            </Badge>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            
          >
            {list(anchor)}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}

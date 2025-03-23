import { Box, Button, Container } from '@mui/material';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { userContext } from '../../../App';
import useConversationList from '../../pages/ConversationListComponents/hooks/useConversationList';
import Loading from '../components/Loading';
import Icon401Unauthorized from '../../../lib/assets/icon401Unauthorized';
import { Helmet } from 'react-helmet';
import UserContext from '../../../lib/context/UserContext';

const ProtectedUserRoute = () => {
    const {t, ready} = useTranslation(['common','modal']);
    const {user} = useContext(UserContext);

    const router = useNavigate()
   
     //TODO: add skeletons here
     if(!ready)
     return <Box sx={{ height: "300px" }}>
         <Helmet><title>Unauthorized</title></Helmet>

         <Box className='ou-p-5'>
             <Loading/>
         </Box>
         
     </Box>

    if (user) {
        return <Outlet />
    }else{
        return (
            <>
                <Helmet><title>Unauthorized</title></Helmet>
               <Box  className="ou-relative ou-items-center" sx={{ height: "550px" }}>
                    <Box className='ou-absolute ou-p-5 ou-text-center 
                        ou-flex-col ou-flex ou-justify-center ou-items-center
                        ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center'>
                        <Container className="ou-text-center">
                            <Box className="ou-flex ou-items-center ou-justify-center ou-max-w-[400px] ou-max-h-[400px] ou-m-auto"><Icon401Unauthorized /></Box>
                            <h4 className='ou-text-red-600 ou-text-xl'>{t('common:errNullUser')}</h4>
                            <Button onClick={() => { router('/login') }}>{t('common:here')}!</Button>
                        </Container>
                    </Box>
                </Box>
            </>
        )
    }
}
export default ProtectedUserRoute
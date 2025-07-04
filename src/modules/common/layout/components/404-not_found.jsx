import { Box, Button, Container, Typography } from "@mui/material";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import Icon404PageNotFound from "../../../../lib/assets/icon404PageNotFound";
import { Helmet } from "react-helmet";

const NotFound = () => {
    const {t, ready} = useTranslation('common');
    const router = useNavigate();
    if (!ready)
        return(
            <Box  className="ou-relative ou-items-center" sx={{ height: "550px" }}>
                <Helmet><title>Not Found</title></Helmet>
                <Container className="ou-text-center ou-mt-5">
                    <Loading />
                </Container>
            </Box>
        )
    return (
        <Box>
            <Helmet><title>Not Found</title></Helmet>
            <Box>
                <Container className="ou-text-center ou-mb-5">
                    <Box className="ou-flex ou-items-center ou-justify-center ou-m-auto">
                        <Icon404PageNotFound width={480} height={480} />
                    </Box>
                    <h3 className="ou-text-red-600 ou-text-xl">{t('common:errNotFound')}</h3>
                    <Typography className='text-center'>
                        <h3>{t('common:backToHomepage')}</h3>
                        <Button onClick={() => { router('/') }}>{t('here')}!</Button>
                    </Typography>
                </Container>
            </Box>
        </Box>
    )
}
export default NotFound
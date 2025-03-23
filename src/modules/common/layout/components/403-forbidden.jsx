import { Box, Container } from "@mui/material";
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router";
import Loading from "../../components/Loading";
import Icon403Forbidden from "../../../../lib/assets/icon403Forbidden";
import { Helmet } from "react-helmet";

const Forbidden = () => {
    const {t, ready} = useTranslation('common');
    if (!ready)
        return(
            <Box  className="ou-relative ou-items-center" sx={{ height: "550px" }}>
                <Helmet><title>Forbidden</title></Helmet>
                <Container className="ou-text-center ou-mt-5">
                    <Loading />
                </Container>
            </Box>
        )
    return (
        <Box  className="ou-relative ou-items-center" sx={{ height: "550px" }}>
            <Helmet><title>Forbidden</title></Helmet>
            <Box className='ou-absolute ou-p-5 ou-text-center 
                ou-flex-col ou-flex ou-justify-center ou-items-center
                ou-top-0 ou-bottom-0 ou-w-full ou-place-items-center'>
                <Container className="ou-text-center ou-mt-5">
                    <Box className="ou-flex ou-items-center ou-justify-center ou-max-w-[350px] ou-max-h-[350px] ou-m-auto "><Icon403Forbidden/></Box>
                    <h3 className="ou-text-red-600 ou-text-xl">{t('common:errForbidden')}</h3>
                    <div className="ou-text-sm">{t('common:loginValidUser')}</div>
                </Container>
            </Box>
        </Box>
    )
}
export default Forbidden
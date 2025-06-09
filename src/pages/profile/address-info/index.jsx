import { Box, Button } from "@mui/material"
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import CustomModal from "../../../modules/common/components/Modal";
import useCustomModal from "../../../lib/hooks/useCustomModal";
import UpdateAddressInfo from "../../../modules/pages/ProfileComponents/UpdateAddressInfo";
import AddressInfo from "../../../modules/pages/ProfileComponents/AddressInfo";
import UserContext from "../../../lib/context/UserContext";

const ProfileAddressInfo = () => {
    const { t, tReady } = useTranslation(['register', 'common', 'yup-validate']);
    const {user} = useContext(UserContext);

    const { handleCloseModal, isOpen, handleOpenModal} = useCustomModal();
    const [flag, setFlag] = useState(false)
    const handleChangeFlag = () => setFlag(!flag)
    useEffect(()=> {},[flag])
    
    return(
        <Box className=" ou-m-auto ou-rounded">
        <Helmet>
          <title>{t('register:addressInfo')}</title>
        </Helmet>
        <Box  className="ou-m-auto ou-px-8 ou-py-4 ">
          <h2 className="ou-text-center ou-text-2xl ou-py-2 ou-pb-3 ou-uppercase">{t('addressInfo')}</h2>

            <AddressInfo locationData={user.locationGeo}/>

            <Box sx={{ textAlign: 'right' }}>
                <Button className="!ou-min-w-[150px] !ou-mt-3" variant="contained" 
                color="success" onClick={handleOpenModal}>
                  {t('common:edit')}
                </Button>
              </Box>
        </Box>
            <CustomModal
            title={t('updateAddressInfo')}
            className="ou-w-[900px] ou-text-center"
            open={isOpen}
            onClose={handleCloseModal}
            content={
                <UpdateAddressInfo 
                  callBackSuccess={() => {
                      handleChangeFlag();
                      handleCloseModal();
                  }
                }/>
            }
       
        />
      
      </Box>
    )
}

export default ProfileAddressInfo
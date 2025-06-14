import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import SuccessfulAlert, { ErrorAlert } from '../../../../config/sweetAlert2';
import { ROLE_USER, TOAST_ERROR } from '../../../../lib/constants';
import createToastMessage from '../../../../lib/utils/createToastMessage';
import { fetchCreateLocation, fetchCreateUser, fetchDistrictsByCity,fetchCreateUserRole } from '../services';


const useRegister = () => {
    const {t} = useTranslation(['yup-validate','modal'])
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [isLoadingUserRole, setIsLoadingUserRole] = useState(true);
    const [dob, setDOB] = useState()
    const [gender, setGender] = useState(0)
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [userRoleID, setUserRoleID] = useState('');

    const [cityId, setCityId] = useState(null)
    const [districts, setDistricts] = useState([])
    const { allConfig } = useSelector((state) => state.config);

    const router = useNavigate('');

    
    useEffect(()=> {
        const createUserRole = async () => {
            try{
                const res = await fetchCreateUserRole()
                if(res.status === 201)
                    setUserRoleID(res.id)
                    return;
            }catch(err){
                setUserRoleID(-1)
            }finally{
                setIsLoadingUserRole(false);
            }
        }

        const loadDistricts = async (cityId) => {
            const res = await fetchDistrictsByCity(cityId)
            if(res.status === 200){
                setDistricts(res.data)
            }
            else{
                setDistricts([])
            }
        }
        
        if(allConfig.roles.length !== 0){
            const userRole = allConfig.roles.filter(role => role.name === ROLE_USER)
            if(userRole.length !== 0){
                setUserRoleID(userRole[0].id)
                setIsLoadingUserRole(false);
            }else{
                createUserRole();
            }
        }
        if(cityId)
            loadDistricts(cityId)
    },[userRoleID, cityId])
    
    const onSubmit = (data, setError, locationGeo) => {
        if (!data.location.lat || !data.location.lng) {
            setError('location.address', {
                type: "custom",
                message: t('yupAddressMustBeSelected')
            });
            return;
        }
        setOpenBackdrop(true)
        const register = async (locationId) => {
            try {
                let formData = new FormData()
                formData.append("first_name", data.firstName)
                formData.append("last_name", data.lastName)
                formData.append("password", data.password)
                formData.append("email", data.email)
                formData.append("address", data.address)
                formData.append("phone_number", data.phoneNumber)
                formData.append("date_of_birth", data.dob ? new Date(data.dob).toISOString() : '')
                formData.append("gender", gender)
                formData.append("avatar", selectedImage)
                formData.append("role", userRoleID)
                formData.append("location", locationId)
                const res = await fetchCreateUser(formData);

                if (res.status === 201) {
                    setOpenBackdrop(false)
                    SuccessfulAlert(t("modal:createSuccess"),t('modal:ok'), ()=> {router('/login')})
                }
            } catch (err) {
                if (err) {
                    const data = err.response.data;
                    setOpenBackdrop(false)
                    if (data.email)
                        setError("email", {
                            type: "custom",
                            message: t('yupEmailExist'),
                        });
                    if (data.phone_number)
                        setError("phoneNumber", {
                            type: "custom",
                            message: t('yupPhoneNumberExist')
                        });
                    
                    createToastMessage({type:TOAST_ERROR, message:t("modal:createFailed")})
                }
                
            }
        };
        const addLocation = async () => {
            try{
                const locationData = {
                    lat:locationGeo.lat,
                    lng:locationGeo.lng,
                    city: data.location.city,
                    district: data.location.district,
                    address: data.location.address,
                }
                const res = await fetchCreateLocation(locationData)
                if(res.status===201)
                    register(res.data.id);
                else{
                    setOpenBackdrop(false)
                    ErrorAlert(t('modal:createFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
                }
            }catch(err) {
                ErrorAlert(t('modal:createFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
            }finally{
                setOpenBackdrop(false)
            }
           
        }
        addLocation()
    }
    return{
        userRoleID,isLoadingUserRole,
        dob,
        gender,
        openBackdrop,
        selectedImage,
        imageUrl,
        districts,
        onSubmit,
        setCityId,
        setDOB,
        setGender,
        setImageUrl,
        setSelectedImage,
        setOpenBackdrop,
    }
}

export default useRegister


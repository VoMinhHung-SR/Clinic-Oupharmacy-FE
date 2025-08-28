import { useContext, useEffect, useState } from "react"
import { fetchCreateLocation, fetchUserLocation, updateLocation } from "../services"
import { useTranslation } from "react-i18next"
import createToastMessage from "../../../../lib/utils/createToastMessage";
import { TOAST_SUCCESS } from "../../../../lib/constants";
import { ErrorAlert } from "../../../../config/sweetAlert2";
import UserContext from "../../../../lib/context/UserContext";

const useUpdateLocation = () => {
    const {t} = useTranslation(['yup-validate','modal'])
    const {user, updateUser} = useContext(UserContext)
    const [isLoading, setIsLoading] = useState(true)
    const [locationData, setLocationData] = useState(null)
    const [flag, setFlag] = useState(false)
    const handleChangeFlag = () => setFlag(!flag)

    useEffect(()=> {
        const loadLocationData = async (userID) => {
            try{
                const res = await fetchUserLocation(userID)
                if (res.status === 200){
                    setLocationData(res.data)
                }
            }catch (err) {
                console.log(err)
            }finally{
                setIsLoading(false)
            }   
        }
        if(user)
            loadLocationData(user.id)
    }, [user, flag])

    const onSubmit = (data, setError, locationGeo, cityName,
        districtName, callBackSuccess = () => {}) => {

        if(locationGeo.lat === '' || locationGeo.lng === ''){
            setError('location.address',{
                type: "custom",
                message:t('yupAddressMustBeSelected')
            })
            return;
        }
        if(!cityName){
            setError('location.city',{
                type: "custom",
                message:t('yupCityRequired')
            })
            return;
        }
        if(!districtName){
            setError('location.district',{
                type: "custom",
                message:t('yupDistrictRequired')
            })
            return;
        }

        const locationDataSubmit = {
            lat:locationGeo.lat,
            lng:locationGeo.lng,
            city: data.location.city,
            district: data.location.district,
            address: data.location.address,
        }

        const handleCreateOrUpdateLocation = async () => {
            try{
                // Create Location
                if(locationData === null){
                    const res = await fetchCreateLocation(locationDataSubmit)
                    if(res.status === 201){
                        createToastMessage({message:t('modal:createSuccess'), type:TOAST_SUCCESS})
                        handleChangeFlag()
                        callBackSuccess()
                    }
                    else{
                        ErrorAlert(t('modal:createFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
                    }
                }
                // Update Location
                else{
                    const res = await updateLocation(locationData.id,locationDataSubmit)
                    if(res.status === 200){
                        createToastMessage({message:t('modal:updateSuccess'), type:TOAST_SUCCESS})
                        handleChangeFlag()
                        callBackSuccess()
                    }
                    else{
                        ErrorAlert(t('modal:updateFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
                    }
                }
            }
            catch(err){
                ErrorAlert(t('modal:updateFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
            }
        }    
        handleCreateOrUpdateLocation()
    }

    return{
        locationData, onSubmit,handleChangeFlag, isLoading
    }
}
export default useUpdateLocation
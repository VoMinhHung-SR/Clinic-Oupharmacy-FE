import { useContext, useEffect, useState } from "react"
import { fetchUserLocation, updateLocation } from "../services"
import { userContext } from "../../../../App"
import { useTranslation } from "react-i18next"
import * as Yup from 'yup';
import createToastMessage from "../../../../lib/utils/createToastMessage";
import { TOAST_SUCCESS } from "../../../../lib/constants";
import { ErrorAlert } from "../../../../config/sweetAlert2";
import UserContext from "../../../../lib/context/UserContext";

const useUpdateLocation = () => {
    const {t} = useTranslation(['yup-validate','modal'])
    const {user, updateUser} = useContext(UserContext)
    const [locationData, setLocationData] = useState([])
    
    const locationSchema = Yup.object().shape({
        location: Yup.object().shape({
            address: Yup.string().trim()
                .required(t('yupAddressRequired')),
            city: Yup
                .number().moreThan(0, t('yupCityNumber'))
                .required(t('yupCityRequired')),
            district: Yup
            .number().moreThan(0, t('yupDistrictNumber'))
            .required(t('yupDistrictRequired')),
        })
    })
    const [flag, setFlag] = useState(false)

    const handleChangeFlag = () => {
        setFlag(!flag)
    }
    useEffect(()=> {
        const loadLocationData = async (userID) => {
            try{
                const res = await fetchUserLocation(userID)
                if (res.status === 200){
                    setLocationData(res.data)
                }
            }catch (err) {
                console.log(err)
            }
        }
        if(user)
            loadLocationData(user.id)
    }, [user, flag])

    const onSubmit = (data, setError, locationGeo, callBackSuccess, cityName, districtName) => {
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
        

        const handleUpdateLocation = async () => {
            try{
                const locationDataSubmit = {
                    lat:locationGeo.lat,
                    lng:locationGeo.lng,
                    city: data.location.city,
                    district: data.location.district,
                    address: data.location.address,
                }
                const res = await updateLocation(locationData.id,locationDataSubmit)
                if(res.status === 200)
                {
                    const locationDataUpdate = {
                        lat:locationGeo.lat,
                        lng:locationGeo.lng,
                        city:{id: data.location.city, name: cityName},
                        district: {id: data.location.district, name: districtName},
                        address: data.location.address,
                    }
                    updateUser({ ...user ,locationGeo: locationDataUpdate})
                    createToastMessage({message:"OKE", type:TOAST_SUCCESS})
                    callBackSuccess()
                }
                else{
                 
                    ErrorAlert(t('modal:createFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
                }
            }catch(err) {
                ErrorAlert(t('modal:createFailed'),t('modal:pleaseDoubleCheck'),t('modal:ok'))
            }
           
        }
        handleUpdateLocation()
    }

    return{
        locationData, user,locationSchema,onSubmit,handleChangeFlag
    }
}
export default useUpdateLocation
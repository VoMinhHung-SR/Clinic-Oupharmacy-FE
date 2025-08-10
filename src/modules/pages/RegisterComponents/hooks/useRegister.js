import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import SuccessfulAlert, { ErrorAlert } from '../../../../config/sweetAlert2';
import { ROLE_USER, TOAST_ERROR } from '../../../../lib/constants';
import createToastMessage from '../../../../lib/utils/createToastMessage';
import { fetchCreateLocation, fetchCreateUser, fetchDistrictsByCity, fetchCreateUserRole } from '../services';

const useRegister = () => {
    const { t } = useTranslation(['yup-validate', 'modal']);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const [isLoadingUserRole, setIsLoadingUserRole] = useState(true);
    const [dob, setDOB] = useState('');
    const [gender, setGender] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [userRoleID, setUserRoleID] = useState('');
    const { allConfig } = useSelector((state) => state.config);
    const router = useNavigate();

    // User role setup
    useEffect(() => {
        const createUserRole = async () => {
            try {
                const res = await fetchCreateUserRole();
                if (res.status === 201) setUserRoleID(res.id);
            } catch {
                setUserRoleID(-1);
            } finally {
                setIsLoadingUserRole(false);
            }
        };
        if (allConfig.roles.length !== 0) {
            const userRole = allConfig.roles.find(role => role.name === ROLE_USER);
            if (userRole) {
                setUserRoleID(userRole.id);
                setIsLoadingUserRole(false);
            } else {
                createUserRole();
            }
        }
    }, [allConfig.roles]);

    // Main submit handler
    const onSubmit = async (data, setError, locationGeo) => {
        if (!locationGeo.lat || !locationGeo.lng) {
            setError('location.address', {
                type: 'custom',
                message: t('yupAddressMustBeSelected')
            });
            return;
        }
        setOpenBackdrop(true);
        try {
            // Create location
            const locationData = {
                lat: locationGeo.lat,
                lng: locationGeo.lng,
                city: data.location.city,
                district: data.location.district,
                address: data.location.address,
            };
            const locRes = await fetchCreateLocation(locationData);
            if (locRes.status !== 201) throw new Error();

            // Create user
            const formData = new FormData();
            formData.append('first_name', data.firstName);
            formData.append('last_name', data.lastName);
            formData.append('password', data.password);
            formData.append('email', data.email);
            formData.append('address', data.location.address);
            formData.append('phone_number', data.phoneNumber);
            formData.append('date_of_birth', data.dob ? new Date(data.dob).toISOString() : '');
            formData.append('gender', gender);
            formData.append('avatar', selectedImage);
            formData.append('role', userRoleID);
            formData.append('location', locRes.data.id);

            const userRes = await fetchCreateUser(formData);
            if (userRes.status === 201) {
                setOpenBackdrop(false);
                SuccessfulAlert({title: t('modal:createSuccess'), confirmButtonText: t('modal:ok'),
                    callbackSuccess: () => router('/login')});
            }
        } catch (err) {
            setOpenBackdrop(false);
            if (err?.response?.data) {
                const { email, phone_number } = err.response.data;
                if (email) setError('email', { type: 'custom', message: t('yupEmailExist') });
                if (phone_number) setError('phoneNumber', { type: 'custom', message: t('yupPhoneNumberExist') });
            }
            createToastMessage({ type: TOAST_ERROR, message: t('modal:createFailed') });
        }
    };

    return {
        userRoleID,
        isLoadingUserRole,
        dob,
        gender,
        openBackdrop,
        selectedImage,
        imageUrl,
        onSubmit,
        setDOB,
        setGender,
        setImageUrl,
        setSelectedImage,
        setOpenBackdrop,
    };
};

export default useRegister;


import React, { createContext, useEffect, useState, useReducer } from 'react';
import Cookies from 'js-cookie';
import userReducer from '../reducer/userReducer';
import { getCookieValue } from '../utils/getCookieValue';
import { changeAvatar } from '../../modules/pages/ProfileComponents/services';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, getCookieValue('user'));
  const [userState, setUserState] = useState(user);

  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const getDefaultAddressFromUser = (userData) => {
    if (!userData) return null;

    // Ưu tiên defaultAddress từ backend
    const addresses = Array.isArray(userData.addresses) ? userData.addresses : [];
    if (userData.defaultAddress) {
      return userData.defaultAddress;
    }
    if (addresses.length > 0) {
      const defaultFromList = addresses.find((addr) => addr.is_default);
      return defaultFromList || addresses[0];
    }

    return null;
  };

  useEffect(() => {
    setUserState(user);

    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
  }
  }, [user, selectedImage]);

  const updateUser = (updatedData) => {
    dispatch({ type: 'update', payload: updatedData });
    Cookies.set('user', JSON.stringify(updatedData));
  };

  const handleChangeAvatar = async (onSuccess, onError) => {
    setIsLoading(true);
    if (selectedImage) {
      try {
        const formData = new FormData();
        formData.append('avatar_path', selectedImage);
  
        const res = await changeAvatar(user.id, formData);
        if(res.status === 200) {
          updateUser({...user, avatar_path: res.data.avatar});
          onSuccess();
        } else {
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    } else {
      onError();
      setIsLoading(false);
    }
  }
  const defaultAddress = getDefaultAddressFromUser(user);

  const hasValidUserAddress = !!(
    defaultAddress &&
    defaultAddress.address &&
    (defaultAddress.city || defaultAddress.city_info) &&
    (defaultAddress.district || defaultAddress.district_info)
  );

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('refresh_token');
    dispatch({ type: 'logout', payload: null });
  }

  return (
    <UserContext.Provider value={{ user: userState, dispatch, updateUser, 
    imageUrl, selectedImage, isLoading, handleLogout,
    setSelectedImage, setImageUrl, handleChangeAvatar, hasValidUserAddress, defaultAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
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
  const hasValidUserAddress = user && user.locationGeo && 
                                Object.keys(user.locationGeo).length > 0 &&
                                user.locationGeo.city &&
                                user.locationGeo.district &&
                                user.locationGeo.address

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('user');
    Cookies.remove('refresh_token');
    dispatch({ type: 'logout', payload: null });
  }

  return (
    <UserContext.Provider value={{ user: userState, dispatch, updateUser, 
    imageUrl, selectedImage, isLoading, handleLogout,
    setSelectedImage, setImageUrl, handleChangeAvatar, hasValidUserAddress }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
import React, { createContext, useEffect, useState, useReducer } from 'react';
import Cookies from 'js-cookie';
import userReducer from '../reducer/userReducer';
import { getCookieValue } from '../utils/getCookieValue';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, getCookieValue('user'));
  const [userState, setUserState] = useState(user);

  const [imageUrl, setImageUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const handleChangeAvatar = () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append('avatar', selectedImage);
      formData.append('user_id', user.id);
    }
  }

  return (
    <UserContext.Provider value={{ user: userState, dispatch, updateUser, 
    imageUrl, selectedImage, setSelectedImage, setImageUrl, handleChangeAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
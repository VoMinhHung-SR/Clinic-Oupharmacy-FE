import React, { createContext, useEffect, useState, useReducer } from 'react';
import Cookies from 'js-cookie';
import userReducer from '../reducer/userReducer';
import { getCookieValue } from '../utils/getCookieValue';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, dispatch] = useReducer(userReducer, getCookieValue('user'));
  const [userState, setUserState] = useState(user);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  const updateUser = (updatedData) => {
    dispatch({ type: 'update', payload: updatedData });
    Cookies.set('user', JSON.stringify(updatedData));
  };

  return (
    <UserContext.Provider value={{ user: userState, dispatch, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
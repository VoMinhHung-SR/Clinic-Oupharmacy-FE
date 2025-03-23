import React, { createContext, useEffect, useState, useReducer } from 'react';
import Cookies from 'js-cookie';
import userReducer from '../reducer/userReducer';
import { getCookieValue } from '../utils/getCookieValue';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [state, setState] = useState(1)

  const [patientSelected, setPatientSelected] = useState({})

  const [isAddNewPatient, setIsAddNewPatient] =  useState(true)

  useEffect(()=> {
    if(state === 1){
      setPatientSelected({})
    }
  }, [state]) 

  const actionUpState = () => {
    setState(state + 1)
  }
  const actionDownState = () => {
    setState(state - 1)
  }


  const clearStage = () => {
    setState(1)
    setIsAddNewPatient(true)
    setPatientSelected({})
  }

  return (
    <BookingContext.Provider value={{ 
    isAddNewPatient, setIsAddNewPatient,
    state, patientSelected, setPatientSelected,
    actionUpState, actionDownState, clearStage }}>
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
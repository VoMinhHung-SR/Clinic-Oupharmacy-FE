import { createContext, useEffect, useReducer, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './modules/common/layout'
import Login from './pages/login'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import Home from './pages'
import Register from './pages/register'
import ExaminationList from './pages/profile/examinations'
import PrescriptionList from './pages/dashboard/prescribing'
import PrescriptionDetail from './pages/dashboard/prescribing/id'
import Payments from './pages/dashboard/examinations/id/payments'
import ConversationList from './pages/conversations'
import ChatWindow from './pages/conversations/id/recipientID/message'
import { I18nextProvider } from 'react-i18next'
import i18n from './i18n'
import Booking from './pages/booking'
import Examinations from './pages/dashboard/examinations'
import ProtectedUserRoute from './modules/common/layout/userRoute'
import { ROLE_DOCTOR, ROLE_NURSE } from './lib/constants'
import ProtectedSpecialRoleRoute from './modules/common/layout/specialRole'
import Forbidden from './modules/common/layout/components/403-forbidden'
import NotFound from './modules/common/layout/components/404-not_found'
import WaitingRoom from './pages/waiting-room'
import { QueueStateProvider } from './lib/context/QueueStateContext'
import { useDispatch } from 'react-redux';
import { getAllConfig } from './lib/redux/configSlice'
import Loading from './modules/common/components/Loading'
import { Box } from '@mui/material'
import Demo from './pages/demo'
import { getCookieValue } from './lib/utils/getCookieValue'
import { getListExamToday, setListExamToday } from './lib/utils/helper'
import { jobEveryMinutes } from './cron/job/every_minutes'
import ScrollToTop from './modules/common/components/ScrollToTop'
import { OUPharmacyChatBot } from './chatbot'
import Profile from './pages/profile'
import ProfileAddressInfo from './pages/profile/address-info'
import { UserProvider } from './lib/context/UserContext'
import Diagnosis from './pages/dashboard/examinations/id/diagnosis'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { PrescribingProvider } from './lib/context/PrescribingContext'
import { BookingProvider } from './lib/context/BookingContext'
import DashboardProfile from './pages/dashboard/profile'
import DashboardLayout from './modules/common/layout/dashboard'
import DashBoard from './pages/dashboard'
import CategoryList from './pages/dashboard/categories'
import MedicineList from './pages/dashboard/medicines'
import DoctorSchedules from './pages/dashboard/doctor-schedules'
import PatientManagement from './pages/profile/patient-list'
import OnlineWaitingRoom from './pages/waiting-room/sub'
import DashboardWaitingRoom from './pages/dashboard/waiting-room'
import APIs, { endpoints } from './config/APIs'
import Contact from './pages/contact'
import AboutUs from './pages/about-us'

export const userContext = createContext()
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
})

const ConfigLoader = ({ children }) => {
  const configDispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true)
  
  const { data: configData, error: configError } = useQuery(
    'config',
    async () => {
      const response = await APIs.get(endpoints['common-configs']);
      return response.data;
    },
    {
      onSuccess: (data) => {
        configDispatch(getAllConfig.fulfilled(data));
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
      },
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    }
  );

  if (isLoading) {
    return <Box className='ou-h-[100vh] ou-flex ou-place-content-center'><Loading/></Box>;
  }

  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <UserProvider>    
              <BookingProvider>
                <PrescribingProvider>
                  <ConfigLoader>
                    <ScrollToTop />
                    <Routes>
                      <Route path='/' element={<Layout />}>
                        <Route path='/' element={<Home />}/>
                        
                        <Route path='/about-us' element={<AboutUs />}/>
                        <Route path='/waiting-room' element={<OnlineWaitingRoom/>}/>
                        <Route path='/contact' element={<Contact/>}/>
                        
                        <Route element={<ProtectedUserRoute/>}>
                          <Route path='/booking' element={<Booking/>}/>
                          <Route path='/profile' element={<Profile />} >
                            <Route path='/profile/address-info' element={<ProfileAddressInfo />} />
                            <Route path='/profile/examinations' element={<ExaminationList />} />
                            <Route path='/profile/patient-management' element={<PatientManagement />} />
                          </Route>

                          <Route path='/conversations'  element={<ConversationList/>} >
                            <Route path='/conversations/:conversationId/:recipientId/message' element={<ChatWindow/>} />
                          </Route>
                        </Route>

                        <Route path="/forbidden" element={<Forbidden />} />
                        <Route path="*" element={<NotFound/>} />

                        <Route path='/demo' element={<Demo/>}/>
                                    
                      </Route>
                      <Route path='/dashboard/' element={<DashboardLayout/>}>
                        <Route element={<ProtectedUserRoute/>}>
                            <Route path='/dashboard/' element={<DashBoard/>} />                          
                            <Route element={<ProtectedSpecialRoleRoute allowedRoles={[ROLE_DOCTOR, ROLE_NURSE]} />}>
                              <Route path='/dashboard/examinations' element={<Examinations/>}/> 
                              <Route path='/dashboard/categories' element={<CategoryList/>}/>
                              <Route path='/dashboard/doctor-schedules' element={<DoctorSchedules/>}/>  
                              <Route path='/dashboard/medicines' element={<MedicineList/>}/> 
                              <Route path='/dashboard/waiting-room' element={<DashboardWaitingRoom/>}/>
                            </Route>

                            <Route element={<ProtectedSpecialRoleRoute allowedRoles={[ROLE_DOCTOR]} />}>
                              <Route path='/dashboard/examinations/:examinationId/diagnosis' element={<Diagnosis />} />
                              <Route path='/dashboard/prescribing' element={<PrescriptionList/>} />
                              <Route path='/dashboard/prescribing/:prescribingId' element={<PrescriptionDetail/>} />
                            </Route>

                            <Route element={<ProtectedSpecialRoleRoute allowedRoles={[ROLE_NURSE]}/>}>
                              <Route path='/dashboard/payments' element={<PrescriptionList/>} />
                              <Route path='/dashboard/payments/examinations/:examinationId' element={<Payments />} />
                            </Route>

                            <Route path='/dashboard/profile' element={<DashboardProfile />} >
                              <Route path='/dashboard/profile/address-info' element={<ProfileAddressInfo />} />
                              <Route path='/dashboard/profile/examinations' element={<ExaminationList />} />
                              <Route path='/dashboard/profile/patient-management' element={<PatientManagement />} />
                            </Route>

                            <Route path='/dashboard/conversations'  element={<ConversationList/>} >
                              <Route path='/dashboard/conversations/:conversationId/:recipientId/message' element={<ChatWindow/>} />
                            </Route>

                            <Route path="/dashboard/forbidden" element={<Forbidden />} />
                        </Route>
                      </Route>

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    </Routes>
                  </ConfigLoader>
                </PrescribingProvider>
              </BookingProvider>
            </UserProvider>
          </LocalizationProvider>
        </BrowserRouter>
      </I18nextProvider>
      <div>
        <ToastContainer
          position="bottom-left"
          theme='colored'
        />
      </div>
    </QueryClientProvider>
  )
}

export default App

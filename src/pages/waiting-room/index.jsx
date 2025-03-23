import { Box, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material"
import moment from "moment";
import { useContext } from "react";
import { useGeolocated } from "react-geolocated";
import { CURRENT_DATE, MAX_EXAM_PER_DAY, ROLE_USER } from "../../lib/constants";
import { QueueStateContext } from "../../lib/context/QueueStateContext";
import CountDownExam from "../../modules/pages/WaittingRoomComponents/CountDownExam"
import useWaitingRoom from "../../modules/pages/WaittingRoomComponents/hooks/useWaitingRoom";
import Loading from "../../modules/common/components/Loading";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import InfoIcon from '@mui/icons-material/Info';
import UserContext from "../../lib/context/UserContext";
import { useSelector } from "react-redux";

const WaitingRoom = () => {
    const queue = useContext(QueueStateContext)
    const { exams , isLoading, handleMoveToTop, handleBringToBottom} = useWaitingRoom()
    const {t, tReady} = useTranslation(['waiting-room'])
    const {user} = useContext(UserContext)
    const { allConfig } = useSelector((state) => state.config);


    if(isLoading || tReady){
        return <>
            <Helmet>
                <title>Waiting room</title>
            </Helmet>
            <Box> 
                <Loading/> 
            </Box>
        </>
    }

    const renderCurrentAndNextExam = (exams) => {
        const filteredExams = exams && exams.filter(exam => !exam.isCommitted);
      
        if (filteredExams.length === 0) {
          return null;
        }
      
        const sortedExams = filteredExams.sort((a, b) => a.startTime.localeCompare(b.startTime));
      
        const currentExams = [];
        const nextExams = [];
      
        let currentIndex = 0;
      
        while (currentIndex < sortedExams.length) {
          let currentExam = sortedExams[currentIndex];
          let nextExam = sortedExams[currentIndex + 1];
      
          const examsWithSameStartTime = [currentExam];
      
          while (nextExam && nextExam.startTime === currentExam.startTime) {
            examsWithSameStartTime.push(nextExam);
            currentIndex++;
            currentExam = sortedExams[currentIndex];
            nextExam = sortedExams[currentIndex + 1];
          }
      
          if (currentExams.length === 0) {
            currentExams.push(...examsWithSameStartTime);
          } else {
            nextExams.push(...examsWithSameStartTime);
            break;
          }
      
          currentIndex++;
        }
      
        return (
          <>
            <Box className="ou-py-4 ou-col-span-6 ou-m-auto ou-mt-8">
              {currentExams.map(exam => (
                <Box className="ou-my-3">
                  <CountDownExam
                    key={exam.examID}
                    currentID={exam.examID}
                    startTime={moment(`${exam.startedDate} ${exam.startTime}`, 'YYYY-MM-DD HH:mm:ss').valueOf()}
                  />
                </Box>
              ))}
            </Box>
            {nextExams.length > 0 && (
              <Box className="ou-py-4 ou-col-span-6 ou-m-auto ou-mt-8">
                {nextExams.map(exam => (
                  <Box className="ou-my-3">
                    <CountDownExam
                      key={exam.examID}
                      nextID={exam.examID}
                      startTime={moment(`${exam.startedDate} ${exam.startTime}`, 'YYYY-MM-DD HH:mm:ss').valueOf()}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
        );
      };
      
      
      
   const renderButton = (index,isCommitted) => {
        if (!exams.length)
            return 

        if(exams.length === 1)
            return <Tooltip followCursor title={t('userInfo')}>
                  <span>
                    <Button className="!ou-bg-green-700 !ou-text-white !ou-mr-1" onClick={()=> handleMoveToTop(index)}><InfoIcon/></Button>
                  </span>
            </Tooltip>
        else
            return(
                <>
                   
                    {isCommitted || (!user || user.role !== ROLE_USER) ? <></> : <>
                        <Tooltip followCursor title={t('moveToTop')}>
                            <span>
                                <Button className="!ou-bg-green-700 !ou-text-white !ou-mr-1" onClick={()=> handleMoveToTop(index)}><ArrowUpwardIcon/></Button>
                            </span>
                        </Tooltip>
                        <Tooltip followCursor title={t('bringToBottom')}>
                            <span>
                                <Button className="!ou-bg-blue-700 !ou-text-white !ou-mx-1" onClick={()=> handleBringToBottom(index)}><ArrowDownwardIcon/></Button>
                            </span>
                        </Tooltip>
                    </>}
               </>
            ) 
   }

    const renderStatus = (isCommitted, isStarted) => {
        if(isCommitted)
            return <span className="ou-text-green-700">{t('done')}</span>

        if(!isCommitted && isStarted)
            return <span className="ou-text-yellow-600">{t('processing')}</span>
        
        return  <span className="ou-text-red-700">{t('unDone')}</span>
    }

    const renderDoctor = (doctorId) => {
        const doctor = allConfig.doctors.find(doctor => doctor.id === doctorId);
        
        if (doctor) {
          const { first_name, last_name } = doctor;
          return <Box>{`${first_name} ${last_name}`}</Box>;
        }
        
        return null;
      };

    return (
        <Container>
            <Helmet>
                <title>Waiting room</title>
            </Helmet>
                <div className="ou-grid ou-grid-cols-12 ou-text-center">
                    {renderCurrentAndNextExam(exams)}
                </div>
             
                <div className="ou-text-center ou-mt-8 ou-pb-8">
                    {t('listExamsToday')}

                    <TableContainer component={Paper} elevation={6} className="ou-my-3 ">

                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                            <TableCell>{t("examID")}</TableCell>
                            <TableCell align="center">{t("patientFullName")}</TableCell>
                            <TableCell align="center">{t("doctorFullName")}</TableCell>
                            <TableCell align="center">{t("startedTime")}</TableCell>
                            <TableCell align="center">{t("endTime")}</TableCell>
                            <TableCell align="center">{t("status")}</TableCell>
                            {(!user || user.role !== ROLE_USER) &&    <>
                                <TableCell align="center">{t("emailRemind")}</TableCell>
                            </> }
                         
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {
                            ! exams.length ? <TableRow>
                                <TableCell colSpan={12}>
                                <Box className="ou-col-span-12 ou-mt-4 ou-mb-2 ou-text-center">
                            {t('waiting-room:errNullExams')}
                        </Box> 
                                </TableCell>
                                
                                </TableRow>
                        : 
                            exams.map((e,index) => (
                                    <TableRow>
                                        <TableCell>
                                            {e.examID}
                                        </TableCell>
                                        <TableCell align="center">
                                            {e.patientFullName ? e.patientFullName : t('unKnown')}
                                        </TableCell>

                                        <TableCell align="center">
                                            {e.doctorID ? renderDoctor(e.doctorID): t('unKnown')}
                                        </TableCell>

                                        <TableCell align="center">
                                            {e.startTime ? e.startTime : <></> }
                       
                                        </TableCell>
                                        <TableCell align="center">
                                            {e.endTime ? e.endTime : <></> }
                                       
                                        </TableCell>
                                        <TableCell align="center">
                                            {renderStatus(e.isCommitted, e.isStarted)}
                                        </TableCell>
                                       
                                        {(!user || user.role !== ROLE_USER) && <>

                                            <TableCell align="center">
                                                {e.remindStatus ?  <span className="ou-text-green-700">{t('sent')}</span> 
                                                : <span className="ou-text-red-700">{t('unSent')}</span>}
                                            </TableCell>
                                        </>}
                                       
                                    </TableRow>
                            ))
                        }
                        
                        </TableBody>
                       

                        </Table>
                        
                    </TableContainer>
                </div>
            </Container>

    )
}
export default WaitingRoom

import { Box, Paper } from "@mui/material";
import CountDownTimer from "../CountDownTimer";
import moment from "moment";
import { timeUntilExam } from "../../../../lib/utils/helper";
import { useTranslation } from "react-i18next";

const CountDownExam = (props) => {

        const {t} = useTranslation(['waiting-room'])
        return(
            <>
                <Box component={Paper} elevation={6} className="ou-min-w-[300px] ou-p-5
                ou-border-[1.5px] ou-border-black ou-border-solid 
                ou-rounded-[8px]">
                    {props.currentID ? <>
                        <Box>
                            {t('currentExam')} : {props.currentID}
                            {props.startTime && <Box>{t('startedTime')} {moment(props.startTime).format('HH:mm:ss')}
                                {/* {timeUntilExam(props.startedTime)} */}
                            </Box> }
                            <CountDownTimer  startedTime={props.startTime}/>
                        </Box>
                    </> : <>
                        <h1>
                            {t('nextExam')} : {props.nextID}
                            {props.startTime && <Box>{t('startedTime')} {moment(props.startTime).format('HH:mm:ss')}</Box> }
                            <CountDownTimer  startedTime={props.startTime}/>
                        
                        </h1>
                    </>
                    } 
                </Box>
            </>
        )
}
export default CountDownExam
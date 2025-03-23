import { Box } from "@mui/material"
import { useGeolocated } from "react-geolocated"
import { getMinAndSecs } from "../../../../lib/utils/getMinAndSecs"
import useCountDownTimer from "../hooks/useCountDownTimer"
import { timeUntilExam } from "../../../../lib/utils/helper"
import { useTranslation } from "react-i18next"
import Loading from "../../../common/components/Loading"

const CountDownTimer = ({startedTime}) => {
    const {timerSeconds} = useCountDownTimer()
    const {min, secs} = getMinAndSecs(timerSeconds)
    const {hasStarted, hours, minutes, seconds} = timeUntilExam(startedTime)
    const {t, tReady} = useTranslation(['waiting-room'])

    if(tReady){
        return <>
            <Box> <Loading/> </Box>
        </>
    }

    if(!hasStarted)
        return <>
            <Box className="ou-text-red-700 ou-mt-3">
                {t('examWaiting')} {hours + t('hours')} {minutes + t('mins')} {seconds} {t('secs')}
            </Box>
        </>
    return (
        <>
        <Box className="ou-text-green-700 ou-mt-3">
           {t('examIn')}
        </Box>
        </>
     
    )
        
}

export default CountDownTimer
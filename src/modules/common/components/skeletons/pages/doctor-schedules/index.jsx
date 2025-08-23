import { Box, Paper } from "@mui/material"
import SkeletonListLineItem from "../../listLineItem"

const SkeletonDoctorScheduleList = () => {
    return (
        <Box component={Paper} elevation={4} className="ou-text-center ou-container ou-mx-auto ou-p-10 ou-h-[100%]">
            <Box className="ou-flex ou-justify-end">
                <SkeletonListLineItem count={1} height="32px" className="ou-w-[10%]"/>
            </Box>

            <SkeletonListLineItem count={1} height="32px" className="ou-w-[30%] ou-mx-auto ou-my-6"/>

            {/* TABLE HEADER */}
            <Box className="ou-flex ou-justify-between ou-mb-3">
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-pr-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-px-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-px-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-px-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-px-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-px-1"/>
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[15%] ou-pl-1"/>
            </Box>

            {/* TABLE BODY */}
            <Box>
                <Box className="ou-flex ou-justify-between">
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-pr-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-pl-1"/>
                </Box>
                <Box className="ou-flex ou-justify-between ou-mt-1">
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-pr-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-px-1"/>
                    <SkeletonListLineItem count={1} height="60px" className="ou-w-[15%] ou-pl-1"/>
                </Box>
            </Box>

            {/* SCHEDULE */}
            <Box className="ou-mt-8">
                <SkeletonListLineItem count={1} height="72px" className="ou-w-[100%] ou-mb-2"/>
                <SkeletonListLineItem count={2} height="60px" className="ou-w-[100%]"/>
            </Box>
        </Box>
    )
}

export default SkeletonDoctorScheduleList
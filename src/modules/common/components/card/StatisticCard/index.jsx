import { Box, Divider, Paper } from "@mui/material"

const StatisticCard = ({icon, title, value, footer}) => {
    return (
        <Box component={Paper}>
            <div className="ou-flex ou-justify-between ou-p-4">
                <p>
                    {icon}
                </p>

                <div className="ou-flex ou-flex-col ou-justify-center 
                ou-items-end ou-text-right ou-w-full">
                    <span>{title}</span>
                    <span className="ou-text-[32px]">{value}</span>
                </div>
            </div>

            <Divider className="ou-w-[90%] !ou-m-auto"/>
            <div className="ou-p-4 ou-py-2">
                {footer}
            </div>
        </Box>
    )
}

export default StatisticCard
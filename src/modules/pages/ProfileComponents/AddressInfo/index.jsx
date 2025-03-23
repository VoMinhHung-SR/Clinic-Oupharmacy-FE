import { Box, FormControl, Grid, Paper, TextField } from "@mui/material"
import { useContext, useState } from "react";
import clsx from "clsx";
import { userContext } from "../../../../App";
import UserContext from "../../../../lib/context/UserContext";
import { useTranslation } from "react-i18next";
import MapGL from "../../../common/components/Mapbox";

const AddressInfo = ({locationData}) => {
    const { t, tReady } = useTranslation(['register', 'common']);
const [viewport, setViewport] = useState({
        latitude: locationData.lat,
        longitude: locationData.lng,
        zoom: 16,
    }); 
    return (
        <>
        
        <Grid container justifyContent="flex">
                <Grid item xs={6} className={clsx('ou-pr-2 !ou-mt-4')} >
                    <FormControl fullWidth >
                        <TextField value={locationData.city.name}   label={t('city')} ></TextField>
                    </FormControl>
                </Grid>
                <Grid item xs={6} className="!ou-mt-4 ou-pl-2" >
                    <FormControl fullWidth >
                        <TextField value={locationData.district.name}   label={t('district')}></TextField>   
                    </FormControl>
                </Grid>
            </Grid>
                <Grid item xs={12} className="!ou-mt-4">
                <FormControl fullWidth >
                    <TextField value={locationData.address}   label={t('address')}></TextField>   
                        
                </FormControl>
            </Grid>
            <Grid>
                <Grid item xs={12} className="!ou-my-4 !ou-mt-8">
                <Paper style={{height: '80%'}} className="ou-w-[75%] ou-m-auto">
                    <Box
                    component={Paper} elevation={5}
                            // max-[600px]:ou-w-[354px] max-[600px]:ou-m-auto 
                        className=" ou-rounded  ou-min-w-[300px] "
                    >
                        {/* <MapGL longitude={viewport.longitude} latitude={viewport.latitude} zoom={viewport.zoom}/> */}
                    </Box>
                        
                    </Paper>
                </Grid>
            </Grid>

        </>
    )
}
export default AddressInfo
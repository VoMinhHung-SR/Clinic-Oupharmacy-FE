import { Box, FormControl, Grid, Paper, TextField } from "@mui/material"
import { useState } from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import MapGL from "../../../common/components/Mapbox";

const AddressInfo = ({locationData = {}}) => {
    const { t, tReady } = useTranslation(['register', 'common']);
    // const [viewport, setViewport] = useState({
    //     latitude: locationData.lat,
    //     longitude: locationData.lng,
    //     zoom: 16,
    // }); 
    return (
        <>
        <Grid container justifyContent="flex">
            <Grid item xs={6} className={clsx('ou-pr-2 !ou-mt-4')} >
                <FormControl fullWidth >
                    <TextField value={locationData?.city?.name}   label={t('city')} ></TextField>
                </FormControl>
            </Grid>
            <Grid item xs={6} className="!ou-mt-4 ou-pl-2" >
                <FormControl fullWidth >
                    <TextField value={locationData?.district?.name}   label={t('district')}></TextField>   
                </FormControl>
            </Grid>
            </Grid>
                <Grid item xs={12} className="!ou-mt-4">
                <FormControl fullWidth >
                    <TextField value={locationData?.address}   label={t('address')}></TextField>   
                </FormControl>
            </Grid>
            {/* <Grid>
                <Grid item xs={12} className="!ou-my-4 !ou-mt-8">
                    <Paper className="ou-m-auto">
                        <Box
                            className=" ou-rounded  ou-min-w-[300px] "
                        >
                            {locationData.lat && locationData.lng && (
                                <MapGL longitude={viewport.longitude} latitude={viewport.latitude} zoom={viewport.zoom}/>
                            )}
                        </Box>
                            
                    </Paper>
                </Grid>
            </Grid> */}
        </>
    )
}
export default AddressInfo
import { mapApi } from "../../config/APIs"
import { GOONGMAP_APITOKEN, ORIGIN_LAT, ORIGIN_LNG } from "../constants"

export const getDirections = async (lat, lng, vehicle='car') => {
    //vehicle : car, bike, taxi, truck
    const directionUrl = `/Direction?origin=${ORIGIN_LAT},${ORIGIN_LNG}&destination=${lat},${lng}&vehicle=${vehicle}&api_key=${GOONGMAP_APITOKEN}`
    const res = await mapApi().get(directionUrl)
    return res;
}
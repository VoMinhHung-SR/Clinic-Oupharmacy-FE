import { Map, Marker } from "react-map-gl"
import { MAPGL_TOKEN, ORIGIN_LAT, ORIGIN_LNG } from "../../../../lib/constants"

const MapGL = ({ longitude, latitude, zoom, style, ...rest }) => {
  const lng = longitude ?? ORIGIN_LNG
  const lat = latitude ?? ORIGIN_LAT

  return (
    <Map
      mapboxAccessToken={MAPGL_TOKEN}
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: zoom ?? 15,
      }}
      style={{
        width: "100%",
        height: "100%",
        minHeight: 240,
        ...style,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      {...rest}
    >
      <Marker latitude={lat} longitude={lng} />
    </Map>
  )
}

export default MapGL

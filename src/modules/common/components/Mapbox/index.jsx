import { useState } from "react";
import { Map, Marker } from "react-map-gl"
import { MAPGL_TOKEN } from "../../../../lib/constants"
// import ReactMapGL from '@goongmaps/goong-map-react';
// import { GOONGMAP_MAPTOKEN } from "../../../../lib/constants";
import { ORIGIN_LAT } from "../../../../lib/constants";
import { ORIGIN_LNG } from "../../../../lib/constants";

const MapGL = (props) => {
      return (
        // <ReactMapGL
        //   {...viewport}
        //   goongApiAccessToken={GOONGMAP_MAPTOKEN}
        //   onViewportChange={nextViewport => setViewport(nextViewport)}
        // />   
        <Map        
          mapboxAccessToken={MAPGL_TOKEN}  
          initialViewState={  
              {
                  longitude:props.longitude ? props.longitude : ORIGIN_LNG ,
                  latitude: props.latitude ? props.latitude : ORIGIN_LAT,
                  zoom: props.zoom ? props.zoom : 15

              }
          }

          style={{minWidth:300, minHeight:450}}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >

          <Marker latitude={props.latitude ? props.latitude :  ORIGIN_LAT} 
          longitude={props.longitude ? props.longitude : ORIGIN_LNG}>
          </Marker>

        </Map>
      );
}

export default MapGL
'use strict'
'use client'
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

const NEXT_PUBLIC_GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
const NEXT_PUBLIC_GMAPS_MAP_ID = process.env.NEXT_PUBLIC_GMAPS_MAP_ID;

const defaultMapContainerStyle = {
  width: '400px',
  height: '400px'
};

const radiusDegrees = 500 / (111.32 * 1000);

const defaultMapOptions = {
  mapId: NEXT_PUBLIC_GMAPS_MAP_ID,
  disableDefaultUI: true
};

export default ({center = null, mapContainerStyle, mapOptions, markers = [] }) => {

  return (
    <APIProvider apiKey={NEXT_PUBLIC_GMAPS_KEY}>
      <Map
        center={center}
        zoom={17}
        {...defaultMapOptions}
        restriction={{
          latLngBounds: {
            north: center.lat + radiusDegrees,
            south: center.lat - radiusDegrees,
            east: center.lng + radiusDegrees,
            west: center.lng - radiusDegrees
          }
        }}
        style={{...defaultMapContainerStyle, ...mapContainerStyle}}
      >
        {...[<AdvancedMarker title={"Your location"} key={"User Location"} position={center} />, ...markers]}
      </Map>
    </APIProvider>
  );
};
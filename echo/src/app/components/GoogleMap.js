'use strict'
'use client'
import React, { memo, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

const NEXT_PUBLIC_GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
const NEXT_PUBLIC_GMAPS_MAP_ID = process.env.NEXT_PUBLIC_GMAPS_MAP_ID;

const defaultMapContainerStyle = {
  width: '400px',
  height: '400px'
};
const defaultMapOptions = {
  mapId: NEXT_PUBLIC_GMAPS_MAP_ID,
  disableDefaultUI: true,
  minZoom: 16,
  gestureHandling: "none"
};

export default memo(({center = null, mapContainerStyle, mapOptions, markers = [] }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: NEXT_PUBLIC_GMAPS_KEY
  });  

  const onLoad = useCallback(function callback(map) {}, [])
  const onUnmount = useCallback(function callback(map) {}, [])

  return isLoaded && center ? (
      <GoogleMap
        mapContainerStyle={{...defaultMapContainerStyle, ...mapContainerStyle}}
        center={center}
        zoom={17}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{...defaultMapOptions, ...mapOptions}}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>
          <Marker
            title={"Your position"}
            key={"User Location"}
            position={center}
            icon={"./marker.svg"}
          />
          { markers.map(((m, i) => <Marker key={i} position={m.position} icon={"./marker.svg"} />))}
        </>
      </GoogleMap>
  ) : <></>
});
'use strict'
'use client'
import React, { memo, useState, useCallback } from 'react'
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
  maxZoom: 18,
  gestureHandling: "none"
};

export default memo(
  ({
    center = null,
    mapContainerStyle,
    mapOptions
  }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: NEXT_PUBLIC_GMAPS_KEY
  })

  const [map, setMap] = useState(null)

  const onLoad = useCallback(function callback(map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded && center ? (
      <GoogleMap
        mapContainerStyle={{...defaultMapContainerStyle, ...mapContainerStyle}}
        center={center}
        zoom={15}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{...defaultMapOptions, ...mapOptions}}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <>
          <Marker
            key={"User Location"}
            position={center}
          />
        </>
      </GoogleMap>
  ) : <></>
});
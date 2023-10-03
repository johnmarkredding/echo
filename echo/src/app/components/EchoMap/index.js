'use strict'
'use client'
import { useEffect, useState } from 'react';
import { Map, useMapsLibrary } from '@vis.gl/react-google-maps';
const QUERY_RADIUS_M = process.env.NEXT_PUBLIC_QUERY_RADIUS_M;

export default function EchoMap ({children, center, ...otherProps}) {
  const geometryIsLoaded = useMapsLibrary('geometry');
  const [restriction, setRestriction] = useState(null);

  useEffect(() => {
    if (geometryIsLoaded) {
      const computeOffset = google.maps.geometry.spherical.computeOffset;
      const radiusM = Number(QUERY_RADIUS_M);
      const north = computeOffset(center, radiusM, 0).lat();
      const south = computeOffset(center, radiusM, 180).lat();
      const east = computeOffset(center, radiusM, 90).lng();
      const west = computeOffset(center, radiusM, -90).lng();
      setRestriction({latLngBounds: {north, south, east, west}});
    }
    return () => {setRestriction(null)};
  }, [geometryIsLoaded]);

  return (
    restriction
    ? <Map center={center} restriction={restriction} {...otherProps}>{children}</Map>
    : <Map center={center} {...otherProps}>{children}</Map>
  );
};
'use strict'
'use client'
import { useEffect, useState } from 'react';
import { Map, useMapsLibrary } from '@vis.gl/react-google-maps';
const QUERY_RADIUS_M = process.env.NEXT_PUBLIC_QUERY_RADIUS_M;

export default function EchoMap ({children, center, ...otherProps}) {
  const geometryIsLoaded = useMapsLibrary('geometry');
  const [restriction, setRestriction] = useState(null);

  useEffect(() => {
    if (geometryIsLoaded && QUERY_RADIUS_M) {
      const radiusM = Number(QUERY_RADIUS_M);
      const computeOffset = google.maps.geometry.spherical.computeOffset;
      const north = computeOffset(center, radiusM, 0).lat();
      const south = computeOffset(center, radiusM, 180).lat();
      const east = computeOffset(center, radiusM, 90).lng();
      const west = computeOffset(center, radiusM, -90).lng();
      setRestriction({latLngBounds: {north, south, east, west}});
    }
    return () => {setRestriction(null)};
  }, [geometryIsLoaded]);

  return (
    <Map
      center={center}
      restriction={restriction ? restriction: undefined}
      {...otherProps}
    >
      {children}
    </Map>
  );
};
import { useEffect, useState } from 'react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default () => {
  const markerLoaded = useMapsLibrary('marker');
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if (!markerLoaded) { return }
    if (!google.maps.marker) {
      throw Error("Marker library missing. Add 'marker' to the libraries array of the Google Maps 'Provider' component.")
    } else {
      setMarker(google.maps.marker);
      return () => {setMarker(null)};
    }
  }, [markerLoaded]);

  return marker;
};
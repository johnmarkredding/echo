import { useEffect, useState } from 'react';
import { useMapsLibrary } from "@vis.gl/react-google-maps";

export default () => {
  const geometryLoaded = useMapsLibrary('geometry');
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    if (!geometryLoaded) { return }
    if (!google.maps.geometry) {
      throw Error("Geometry library missing. Add 'geometry' to the libraries array of the Google Maps 'Provider' component.")
    } else {
      setGeometry(google.maps.geometry);
      return () => {setGeometry(null)};
    }
  }, [geometryLoaded]);

  return geometry;
};
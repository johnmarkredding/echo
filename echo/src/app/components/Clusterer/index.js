import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ClustererContext } from '@/app/components';
import { useEffect } from "react";

export default ({children}) => {
  const map = useMap();
  const clusterer = new MarkerClusterer({map});
  useEffect(() => {
    return () => {clusterer.clearMarkers()};
  });
  return <ClustererContext.Provider value={clusterer}>{children}</ClustererContext.Provider>;
};
import { useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { ClustererContext } from './contexts';
import { useEffect } from "react";

const Clusterer = ({children}) => {
  const map = useMap();
  const clusterer = new MarkerClusterer({map});
  useEffect(() => {
    return () => {clusterer.clearMarkers()};
  });
  return <ClustererContext.Provider value={clusterer}>{children}</ClustererContext.Provider>;
};

export default {Clusterer, ClustererContext};
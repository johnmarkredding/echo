/*global google*/
'use strict';
import {useState, useEffect, useRef} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateClusterIcon} from '@/app/helpers';

const clusterAlgorithm = new SuperClusterAlgorithm({maxZoom: 22, radius: 60});

const renderer = {
  render: (cluster, _, map) => {

    return new google.maps.marker.AdvancedMarkerElement({
      position: cluster.position,
      map,
      content: generateClusterIcon(cluster.count),
      zIndex: 1000 + cluster.count,
    });
  }
};

const EchoClusterer = ({onClick, children}) => {
  const [markerRefs, setMarkerRefs] = useState({});
  const clusterer = useRef(null);
  const map = useMap();
  
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        algorithm: clusterAlgorithm,
        markers: Object.values(markerRefs),
        map,
        renderer,
        onClusterClick: (e, cluster) => {
          e.stop();
          onClick(cluster.markers.map((m) => m.echo));
        }
      });
    }
  }, [map, markerRefs, onClick]);
  
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markerRefs));
  }, [markerRefs]);

  const addMarkerRef = (marker, key) => {
    if (marker && markerRefs[key]) return;
    if (!marker && !markerRefs[key]) return;

    setMarkerRefs((prev) => {
      if (marker) {
        return {...prev, [key]: marker};
      } else {
        const {[key]: _, ...newMarkerRefs} = prev;
        return newMarkerRefs;
      }
    });
  };

  return (
    <>
      {children}
    </>
  );
};

export default EchoClusterer;
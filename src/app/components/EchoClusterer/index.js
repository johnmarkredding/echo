/*global google*/
'use strict';
import {useState, useEffect, useRef} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateClusterIcon} from '@/app/helpers';
import {ClustererContext} from '@/app/contexts';

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
  const [markerCacheRef, setMarkerCacheRef] = useState({});
  const clusterer = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        algorithm: clusterAlgorithm,
        markers: Object.values(markerCacheRef),
        map,
        renderer,
        onClusterClick: (e, cluster) => {
          e.stop();
          onClick(cluster.markers.map((m) => m.echo));
        }
      });
    }
  }, [map, markerCacheRef, onClick]);
  
  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markerCacheRef));
  }, [markerCacheRef]);

  const addMarkerToCache = (marker, key) => {
    if (!marker || markerCacheRef[key]) return;

    setMarkerCacheRef((prev) => {
      return {...prev, [key]: marker};
    });
  };
  
  const removeMarkerFromCache = (key) => {
    if (!markerCacheRef[key]) return;

    setMarkerCacheRef(({[key]: _, ...newMarkerRefs}) => {
      return newMarkerRefs;
    });
  };

  return (
    <ClustererContext.Provider value={{add: addMarkerToCache, remove: removeMarkerFromCache}}>
      {children}
    </ClustererContext.Provider>
  );
};

export default EchoClusterer;
/*global google*/
'use strict';
import {useEffect, useRef} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateClusterIcon} from '@/app/helpers';
import {ClustererContext} from '@/app/contexts';

const clusterAlgorithm = new SuperClusterAlgorithm({maxZoom: 22, radius: 60});

const renderer = {
  render: (cluster, _, map) => new google.maps.marker.AdvancedMarkerElement({
    position: cluster.position,
    map,
    content: generateClusterIcon(cluster.count),
    zIndex: 1000 + cluster.count,
  })
};

const EchoClusterer = ({onClick, children}) => {
  const clusterer = useRef(null);
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({
        algorithm: clusterAlgorithm,
        map,
        renderer,
        onClusterClick: (e, cluster) => {
          e.stop();
          onClick(cluster.markers.map((m) => m.echo));
        }
      });
    }
  }, [map, onClick]);

  return (
    <ClustererContext.Provider value={clusterer}>
      {children}
    </ClustererContext.Provider>
  );
};

export default EchoClusterer;
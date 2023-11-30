/*global google*/
'use strict';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateMarkerIcon, generateClusterIcon} from '@/app/helpers';

const addMarkers = (map, data, listenerCallback) => {
  const markers = data.map((echo) => {
    const {
      coords: {latitude: lat, longitude: lng},
      id
    } = echo;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      title: 'Echo ' + id,
      map,
      position: {lat, lng},
      content: generateMarkerIcon()
    });
    marker.echo = echo;
    marker.addListener('click', (e) => {
      e.stop();
      listenerCallback([echo]);
    });
    return marker;
  });

  const renderer = {
    render: (cluster, stats, map) => {
      // change color if this cluster has more markers than the mean cluster
      const color = cluster.count > Math.max(10, stats.clusters.markers.mean)
        ? '#0f0'
        : 'rgba(0, 0, 0, 0.80)';

      return new google.maps.marker.AdvancedMarkerElement({
        position: cluster.position,
        map,
        content: generateClusterIcon(color, cluster.count),
        zIndex: 1000 + cluster.count,
      });
    }
  };

  const markerClusterer = new MarkerClusterer({
    algorithm: new SuperClusterAlgorithm({maxZoom: 22, radius: 60}),
    onClusterClick: (e, cluster) => {
      e.stop();
      listenerCallback(cluster.markers.map((m) => m.echo));
    },
    markers,
    map,
    renderer
  });
  return () => {markerClusterer.clearMarkers()};
};

export default addMarkers;
/*global google*/
'use strict';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateMarkerIcon, generateClusterIcon} from '@/app/helpers';

const superClusterAlgorithm = new SuperClusterAlgorithm({maxZoom: 22, radius: 60});

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

const addMarker = (map, echo, listenerCallback) => {
  const {coords: {latitude: lat, longitude: lng}, id} = echo;
  
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
};

const addMarkers = (map, data, listenerCallback) => {
  const markers = data.map((echo) => addMarker(map, echo, listenerCallback));

  const markerClusterer = new MarkerClusterer({
    algorithm: superClusterAlgorithm,
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
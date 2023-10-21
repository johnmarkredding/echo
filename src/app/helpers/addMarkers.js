/*global google*/
'use strict';
import {MarkerClusterer, SuperClusterAlgorithm} from '@googlemaps/markerclusterer';
import {generateMarkerIcon} from '@/app/helpers';

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
        ? '#444'
        : 'rgba(0, 0, 0, 0.80)';

      // create svg url with fill color
      const svg = window.btoa(`
      <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
        <circle cx="120" cy="120" opacity=".6" r="70" />
        <circle cx="120" cy="120" opacity=".3" r="90" />
        <circle cx="120" cy="120" opacity=".2" r="110" />
        <circle cx="120" cy="120" opacity=".1" r="130" />
      </svg>`);

      // create marker using svg icon
      return new google.maps.Marker({
        position: cluster.position,
        map,
        icon: {
          url: `data:image/svg+xml;base64,${svg}`,
          scaledSize: new google.maps.Size(35, 35),
        },
        label: {
          text: String(cluster.count),
          color: 'rgba(255,255,255,0.9)',
          fontSize: '12px',
        },
        // adjust zIndex to be above other markers
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
/*global google*/
'use strict';
'use client';
import {useRef, useEffect, useContext} from 'react';
import {useMap} from '@vis.gl/react-google-maps';
import {generateMarkerIcon} from '@/app/helpers';
import {ClustererContext} from '@/app/contexts';

const EchoMarker = ({echo, onClick}) => {
  const clusterer = useContext(ClustererContext);
  const map = useMap();
  const marker = useRef(null);
  
  // Add marker to map, if not inside a clusterer
  useEffect(() => {
    if (clusterer || !marker.current || !map) {return}
    marker.current.map = map;
    return () => {marker.current.map = null};
  }, [map, marker, clusterer]);

  // Add marker to clusterer, if one exists
  useEffect(() => {
    if (!clusterer || !marker.current) {return}
    const currentClusterer = clusterer.current;
      
    // Check that ref has a clusterer instance
    if (currentClusterer) {
      currentClusterer.addMarker(marker.current);
      return () => {
        currentClusterer.removeMarker(marker.current);
      };
    }
  }, [marker, clusterer, map]);
  
  // Create marker
  useEffect(() => {
    if (!marker.current) {
      const newMarker = Object.assign(new google.maps.marker.AdvancedMarkerElement({
        title: 'Echo ' + echo.id,
        position: {lat: echo.coords.latitude, lng: echo.coords.longitude},
        content: generateMarkerIcon(),
        zIndex: 100
      }), {echo});

      marker.current = newMarker;
    }

    const markerClickListener = marker.current.addListener('click', (e) => {
      e.stop();
      onClick([echo]);
    });

    return () => {
      markerClickListener.remove();
    };
  }, [marker, echo, onClick]);
  
  return (<></>);
};

export default EchoMarker;
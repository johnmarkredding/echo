/*global google*/
'use strict';
'use client';
import {useState, memo, useEffect, useEventEffect} from 'react';
import {generateMarkerIcon} from '@/app/helpers';

const EchoMarker = memo(({echo, onClick}) => {
  const [marker, setMarker] = useState(null);
  const markerClickListener = useEventEffect((e) => {
    e.stop();
    onClick([echo]);
  });

  useEffect(() => {
    const {coords: {latitude: lat, longitude: lng}, id} = echo;
    const echoMarker = new google.maps.marker.AdvancedMarkerElement({
      title: 'Echo ' + id,
      position: {lat, lng},
      content: generateMarkerIcon()
    });
    echoMarker.echo = echo;
    echoMarker.addListener('click', markerClickListener);
    setMarker(echoMarker);
    return () => {
      marker.removeListener('click', markerClickListener);
      marker.map = null;
      setMarker(null);
    };
  }, [echo, marker, markerClickListener]);
  
  return (<></>);
}, (prevProps, nextProps) => prevProps.echo.id === nextProps.echo.id);

export default EchoMarker;
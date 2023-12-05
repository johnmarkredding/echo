/*global google*/
'use strict';
'use client';
import {memo, useEffect, useContext} from 'react';
import {generateMarkerIcon} from '@/app/helpers';
import {ClustererContext} from '@/app/contexts';

const EchoMarker = memo(({echo, onClick}) => {
  const clusterer = useContext(ClustererContext);

  useEffect(() => {
    const newMarker = new google.maps.marker.AdvancedMarkerElement({
      title: 'Echo ' + echo.id,
      position: {lat: echo.coords.latitude, lng: echo.coords.longitude},
      content: generateMarkerIcon()
    });
    newMarker.echo = echo;

    const markerClickListener = newMarker.addListener('click', (e) => {
      e.stop();
      onClick([echo]);
    });

    clusterer.add(newMarker, newMarker.echo.id);

    return () => {
      markerClickListener.remove();
      clusterer.remove(newMarker.echo.id);
    };
  }, [echo, onClick, clusterer]);
  
  return (<></>);
}, (prevProps, nextProps) => prevProps.echo.id === nextProps.echo.id);

export default EchoMarker;
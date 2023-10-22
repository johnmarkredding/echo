'use strict';
'use client';
import {useState, useCallback, useEffect} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {EchoModal} from '@/app/components';
import {addMarkers, generateMapRestriction} from '@/app/helpers';
const GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
const GMAPS_MAP_ID = process.env.NEXT_PUBLIC_GMAPS_MAP_ID;
const mapStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: '0',
  left: '0'
};

const EchoMap = ({center, echoes}) => {
  const [restriction, setRestriction] = useState(null);
  const [loadedAPI, setLoadedAPI] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  
  useEffect(() => {
    if (mapInstance) {
      const cleanupMarkers = addMarkers(mapInstance, echoes, setModalData);
      return cleanupMarkers;
    }
  }, [echoes, mapInstance]);

  useEffect(() => {
    if (loadedAPI) {
      generateMapRestriction(center, setRestriction);
    } else {console.log('no loaded API')}
    return () => {setRestriction(null)};
  }, [center, loadedAPI]);
  
  const onLoadApi = () => setLoadedAPI(true);
  const onLoadMap = useCallback(
    (map) => {
      setMapInstance(map);
      map.addListener('click', () => setModalData(null));
    }, []
  );

  return (
    <>
      <APIProvider
        apiKey={GMAPS_KEY}
        libraries={['geometry', 'marker']}
        onLoad={onLoadApi}
      >
        <Map
          center={center}
          restriction={restriction || undefined}
          onLoadMap={onLoadMap}
          mapId={GMAPS_MAP_ID}
          zoom={18}
          disableDefaultUI={true}
          style={mapStyle}
        />
      </APIProvider>
      <EchoModal echoes={modalData} />
    </>
  );
};

export default EchoMap;
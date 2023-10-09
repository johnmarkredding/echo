'use strict';
'use client';
import {useState, useCallback, useEffect} from 'react';
import {APIProvider, Map} from '@vis.gl/react-google-maps';
import {
  MarkerClusterer,
  SuperClusterAlgorithm
} from '@googlemaps/markerclusterer';
const QUERY_RADIUS_M = process.env.NEXT_PUBLIC_QUERY_RADIUS_M;
const GMAPS_KEY = process.env.NEXT_PUBLIC_GMAPS_KEY;
const GMAPS_MAP_ID = process.env.NEXT_PUBLIC_GMAPS_MAP_ID;
const svgIcon = `<svg width="40px" preserveAspectRatio viewBox="0 0 86 95" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M17,47 C25,31 34,31 34,17 C34,7.61115925 26.3888407,0 17,0 C7.61115925,0 0,7.61115925 0,17 C0,31 9,31 17,47 Z" id="path-1"></path><filter x="-116.2%" y="-84.0%" width="332.4%" height="269.4%" filterUnits="objectBoundingBox" id="filter-2"><feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology><feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="13" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite><feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Tablet-Portrait" transform="translate(-383.000000, -336.000000)"><g id="Marker" transform="translate(409.000000, 361.000000)"><g id="Oval"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use stroke="#FAF8F8" stroke-width="1" fill-opacity="0.75" fill="#1C1C1C" fill-rule="evenodd" xlink:href="#path-1"></use></g><circle id="Oval" fill="#FFFFFF" cx="17" cy="18" r="7"></circle></g></g></g></svg>`;
const mapStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  top: '0',
  left: '0'
};

const EchoMap = ({center, echoes}) => {
  const [restriction, setRestriction] = useState(null);
  const [modalData, setModalData] = useState(null);

  const onLoadApi = useCallback(
    () => generateRestriction(center, setRestriction),
    [center]
  );
  const onLoadMap = useCallback(
    (map) => addMarkers(map, echoes, setModalData),
    [echoes]
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
      {
        modalData
        ? (<section
            style={{
              overflow: 'scroll',
              maxHeight: '50vh',
              backgroundColor: '#1C1C1C',
              width: '55vw',
              justifySelf: 'center',
              zIndex: 2999999,
              position: 'fixed',
              top: 'calc(50% - 3.5rem)',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            {
              Array.isArray(modalData)
              ? modalData.map((e) => <p key={e.id}>{e.text}</p>)
              : <p>{modalData.text}</p>
            }
          </section>)
        : null
      }
    </>
  );
};

const addMarkers = (map, data, listenerCallback) => {
  const markers = data.map((echo) => {
    const {
      coords: {latitude: lat, longitude: lng},
      id,
      text
    } = echo;
    const marker = new google.maps.marker.AdvancedMarkerElement({
      title: 'Echo ' + id,
      map,
      position: {lat, lng},
      content: generateMarkerIcon()
    });
    marker.echo = echo;
    marker.addListener('click', () => listenerCallback(echo));
    return marker;
  });

  new MarkerClusterer({
    algorithm: new SuperClusterAlgorithm({maxZoom: 22, radius: 60}),
    onClusterClick: (_, cluster) => {
      listenerCallback(cluster.markers.map((m) => m.echo));
    },
    markers,
    map
  });
};

const generateRestriction = (center, setRestriction) => {
  if (!google.maps.geometry) {
    if (QUERY_RADIUS_M) {
      throw Error(
        "Geometry library missing. Add 'geometry' to the libraries array of the Google Maps 'Provider' component."
      );
    } else {
      throw Error("ENV variable value for 'QUERY_RADIUS_M' is missing");
    }
  } else if (QUERY_RADIUS_M) {
    const {computeOffset} = google.maps.geometry.spherical;
    const radiusM = Number(QUERY_RADIUS_M) + 50; // add margin

    setRestriction({
      latLngBounds: {
        north: computeOffset(center, radiusM, 0).lat(),
        south: computeOffset(center, radiusM + 100, 180).lat(), // Extra margin for input form…
        east: computeOffset(center, radiusM, 90).lng(),
        west: computeOffset(center, radiusM, -90).lng()
      }
    });
  }
};

const generateMarkerIcon = () => {
  const markerContent = document.createElement('div');
  markerContent.innerHTML = svgIcon;
  return markerContent;
};

export default EchoMap;

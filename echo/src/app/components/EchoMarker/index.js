import { useContext, useEffect } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { ClustererContext } from '@/app/components';
const svgIcon = `<svg width="60px" preserveAspectRatio viewBox="0 0 86 95" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><path d="M17,47 C25,31 34,31 34,17 C34,7.61115925 26.3888407,0 17,0 C7.61115925,0 0,7.61115925 0,17 C0,31 9,31 17,47 Z" id="path-1"></path><filter x="-116.2%" y="-84.0%" width="332.4%" height="269.4%" filterUnits="objectBoundingBox" id="filter-2"><feMorphology radius="0.5" operator="dilate" in="SourceAlpha" result="shadowSpreadOuter1"></feMorphology><feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"></feOffset><feGaussianBlur stdDeviation="13" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur><feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite><feColorMatrix values="0 0 0 0 1   0 0 0 0 1   0 0 0 0 1  0 0 0 0.5 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix></filter></defs><g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Tablet-Portrait" transform="translate(-383.000000, -336.000000)"><g id="Marker" transform="translate(409.000000, 361.000000)"><g id="Oval"><use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use><use stroke="#FAF8F8" stroke-width="1" fill-opacity="0.75" fill="#1C1C1C" fill-rule="evenodd" xlink:href="#path-1"></use></g><circle id="Oval" fill="#FFFFFF" cx="17" cy="18" r="7"></circle></g></g></g></svg>`;

const EchoMarker = ({text, timestamp, id, ...props}) => {
  const markerIsLoaded = useMapsLibrary('marker');
  const clusterer = useContext(ClustererContext);
  
  useEffect(() => {
    if (markerIsLoaded) {
      const newMarker = new google.maps.marker.AdvancedMarkerElement(props);
      const markerContent = document.createElement('div');
      markerContent.innerHTML = svgIcon;
      markerContent.style.width = "8vw";
      newMarker.content = markerContent;
      clusterer.addMarker(newMarker);
      return () => {clusterer.removeMarker(newMarker)};
    }
  }, [markerIsLoaded]);

  return <></>
};
export default EchoMarker;
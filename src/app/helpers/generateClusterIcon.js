'use strict';

const getSvg = (color) => `
  <svg fill="${color}" width="40px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
    <circle cx="120" cy="120" opacity=".6" r="70" />
    <circle cx="120" cy="120" opacity=".3" r="90" />
    <circle cx="120" cy="120" opacity=".2" r="110" />
    <circle cx="120" cy="120" opacity=".1" r="130" />
  </svg>`;

const getLabel = (text) => `
  <div
    style="
      color: rgba(255,255,255,0.9);
      font-size: 12px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -62%);"
  >
    ${text}
  </div>`;

const generateClusterIcon = (svgColor, markerCount) => {
  const markerContent = document.createElement('div');
  markerContent.innerHTML = getSvg(svgColor) + getLabel(markerCount);
  return markerContent;
};

export default generateClusterIcon;
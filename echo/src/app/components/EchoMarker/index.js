import {AdvancedMarker} from '@vis.gl/react-google-maps';

const EchoMarker = ({position, ...otherProps}) => (
  <AdvancedMarker position={position} {...otherProps}>
    <div style={{width:"8vw"}}>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 86 95">
        <defs>
          <filter id="a" width="332.4%" height="269.4%" x="-116.2%" y="-84%" filterUnits="objectBoundingBox">
            <feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="shadowSpreadOuter1"/>
            <feOffset in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
            <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="13"/>
            <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
            <feColorMatrix in="shadowBlurOuter1" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
          </filter>
          <path id="b" d="M17 47c8-16 17-16 17-30 0-9.38884075-7.6111593-17-17-17C7.61115925 0 0 7.61115925 0 17c0 14 9 14 17 30Z"/>
        </defs>
        <g fill="none" fillRule="evenodd" transform="translate(26 25)">
          <use xlinkHref="#b" fill="#000" filter="url(#a)"/>
          <use xlinkHref="#b" fill="#1C1C1C" fillOpacity=".75" stroke="#FAF8F8"/>
          <circle cx="17" cy="18" r="7" fill="#FFF"/>
        </g>
      </svg>
    </div>
  </AdvancedMarker>
);

export default EchoMarker;
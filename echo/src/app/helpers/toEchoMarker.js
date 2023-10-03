import { EchoMarker } from '../components';

export default ({coords: {latitude: lat, longitude: lng}, id, ...rest}) => {
  return (
    <EchoMarker
      title={"Echo"}
      key={id}
      position={{lat, lng}}
      {...rest}
    />
  );
}
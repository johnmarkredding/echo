import { Marker } from '../components';

export default ({coords: {latitude: lat, longitude: lng}, id, ...rest}) => {
  return (
    <Marker
      title={"Echo"}
      key={id}
      position={{lat, lng}}
      icon={"./marker.svg"}
      {...rest}
    />
  );
}
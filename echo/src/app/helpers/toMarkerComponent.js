import { Marker } from '@react-google-maps/api';

export default ({coords: {latitude, longitude}, id, ...rest}) => {
  return (
    <Marker
      title={"Echo"}
      key={id}
      position={{lat: latitude, lng: longitude}}
      icon={"./marker.svg"}
      {...rest}
    />
  );
}
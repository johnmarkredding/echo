export default ({coords: {latitude, longitude}, ...rest}) => {
  return {position: {lat: latitude, lng: longitude}, ...rest};
}
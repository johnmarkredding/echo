import {Observable} from 'rxjs';

export default (geoOptions = {enableHighAccuracy: true}) => {
  return new Observable((subscriber) => {
    let watchId = null;
    try {
      watchId = navigator.geolocation.watchPosition(
        (nextPosition) => {subscriber.next(nextPosition)},
        (positionError) => {subscriber.error(positionError)},
        geoOptions
      );
    } catch (setupError) {
      console.error(setupError);
    }
    return () => {
      try {
        navigator.geolocation.clearWatch(watchId);
      } catch (err) {
        console.error(err);
      }
    };
  });
};
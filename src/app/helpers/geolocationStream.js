import {Observable, distinctUntilChanged} from 'rxjs';

export default (geoOptions = {enableHighAccuracy: true}) => {
  return new Observable((subscriber) => {
    let watchId = null;
    try {
      watchId = navigator.geolocation.watchPosition(
        ({coords}) => {subscriber.next(coords)},
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
  }).pipe(distinctUntilChanged());
};
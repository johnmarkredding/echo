import { Observable } from 'rxjs';

export const createGeoPositionObservable = (geoOptions = { enableHighAccuracy: true }) => {
  return new Observable(subscriber => {
    const watchId = navigator.geolocation.watchPosition(
      (nextPosition) => {subscriber.next(nextPosition)},
      (positionError) => {subscriber.error(positionError)},
      geoOptions
    );
    return () => {
      navigator.geolocation.clearWatch(watchId);
      subscriber.complete();
    };
  });
};
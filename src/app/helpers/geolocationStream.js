import {Observable, distinctUntilChanged} from 'rxjs';

export default (geoOptions = {enableHighAccuracy: true}) => {
  return new Observable((subscriber) => {
    let geoWatcher = null;
    try {
      geoWatcher = navigator.geolocation.watchPosition(
        ({coords:{longitude, latitude}}) => {subscriber.next({longitude, latitude})},
        (positionError) => {subscriber.error(positionError)},
        geoOptions
      );
    } catch (setupError) {
      console.error(setupError);
    }
    return () => {
      try {
        navigator.geolocation.clearWatch(geoWatcher);
      } catch (err) {
        console.error(err);
      }
    };
  })
    .pipe(
      distinctUntilChanged(
        (prev, curr) => {
          const latsEqual = prev.latitude.toFixed(5) == curr.latitude.toFixed(5);
          const lonsEqual = prev.longitude.toFixed(5) == curr.longitude.toFixed(5);
          return latsEqual && lonsEqual;
        }
      )
    );
};
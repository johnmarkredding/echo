import { Observable } from 'rxjs';



const setupPermissionsChangeHandler = (cb) => (permissionStatus) => {
  console.log(permissionStatus);
  // cb(permissionStatus.state);
  
  // permissionStatus.onchange = cb;
  
  // return () => {
  //   permissionStatus.onchange = null; // Remove the handler when unsubscribed
  // };
};

export const createPermissionsObservable = () => {
  return new Observable(subscriber => {
    
    const handlePermissionsChange = setupPermissionsChangeHandler(subscriber.next);

    navigator.permissions.query({ name: 'geolocation' })
    .then(handlePermissionsChange)
    .catch(subscriber.error);
  });
};
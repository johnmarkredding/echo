import {Observable, distinctUntilChanged} from 'rxjs';

const setupPermissionsChangeHandler = (sendToSubscriber) => (permissionStatus) => {
  const checkPermissionGranted = (permissionIs) => (permissionIs === 'granted' || permissionIs === 'prompt');
  sendToSubscriber(checkPermissionGranted(permissionStatus.state));
  permissionStatus.onchange = (permissionsEvent) => {
    sendToSubscriber(checkPermissionGranted(permissionsEvent.target.state));
  };
  
  return () => {
    permissionStatus.onchange = null; // Remove the handler when unsubscribed
  };
};

export default () => {
  return new Observable((subscriber) => {
    const handlePermissionsChange = setupPermissionsChangeHandler((status) => subscriber.next(status));
    
    navigator.permissions.query({name: 'geolocation'})
      .then(handlePermissionsChange)
      .catch((permissionsQueryError) => { subscriber.error(permissionsQueryError) });
  }).pipe(distinctUntilChanged());
};
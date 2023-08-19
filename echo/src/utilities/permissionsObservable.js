import { Observable } from 'rxjs';

const setupPermissionsChangeHandler = (sendToSubscriber) => (permissionStatus) => {
  sendToSubscriber(permissionStatus.state);
  permissionStatus.onchange = (permissionsEvent) => sendToSubscriber(permissionsEvent.target);
  
  return () => {
    permissionStatus.onchange = null; // Remove the handler when unsubscribed
  };
};

export default () => {
  return new Observable(subscriber => {
    
    const handlePermissionsChange = setupPermissionsChangeHandler((status) => subscriber.next(status));

    navigator.permissions.query({ name: 'geolocation' })
    .then(handlePermissionsChange)
    .catch((permissionsQueryError) => { subscriber.error(permissionsQueryError) });
  });
};
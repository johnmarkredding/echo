'use strict'
'use client'
import { useState, useEffect } from 'react';
import { distinctUntilChanged } from 'rxjs';
import styles from './page.module.css';
import { createGeolocationStream, createPermissionsStream, handleNewEcho, toMarkerData } from './helpers';
import { GoogleMap, EchoForm } from './components';
const API_SERVER_URL = process.env.NEXT_PUBLIC_API_SERVER_URL

export default () => {
  const [echoes, setEchoes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const geolocationStream$ = createGeolocationStream();
  const permissionsStream$ = createPermissionsStream();

  // Get messages on userLocation change. This is a side effect.
  useEffect(() => {
    if (userLocation && locationAllowed) {
      const { latitude, longitude } = userLocation;
      const listenToEchoes = new EventSource(
        `${API_SERVER_URL}/echoes?latitude=${latitude}&longitude=${longitude}`, {}
      );
      listenToEchoes.onopen = () => {console.log("--------Echo listener connected-----------")};
      listenToEchoes.onerror = (err) => {console.error(err)};
      listenToEchoes.onmessage = (message) => {
        const serverMessages = JSON.parse(message?.data);
        typeof serverMessages === 'object' ? setEchoes(serverMessages) : console.log(serverMessages);
      };
      listenToEchoes.addEventListener('close', (closeEvent) => {
        console.log("--------Server closed the connection-----------", closeEvent.data);
        listenToEchoes.close();
      });
  
      return () => {
        listenToEchoes.close();
        console.log("--------Echo listener disconnected-----------");
      }
    }
  }, [userLocation, locationAllowed]);

  // Setup permissions subscription
  useEffect(() => {
    const permissionsSubscription = permissionsStream$
      .pipe(distinctUntilChanged())
      .subscribe({
        next: (permissionGranted) => { setLocationAllowed(permissionGranted) },
        error: (permissionError) => {
          console.error(permissionError);
          setLocationAllowed(false);
        },
        complete: () => { console.log("No more permissions changes will be emitted") }
      });
    return () => {
      permissionsSubscription.unsubscribe();
    }
  }, []);

  // Setup geolocation subscription
  useEffect(() => {
    if (locationAllowed) {
      const geolocationSubscription = geolocationStream$
        .pipe(distinctUntilChanged())
        .subscribe({
          next: (position) => { setUserLocation(position.coords) },
          error: (positionError) => {
            console.error(positionError);
            setUserLocation(null);
          },
          complete: () => { console.log("No more geolocation changes will be emitted") }
        });
      return () => {
        geolocationSubscription?.unsubscribe();
      }
    }
  }, [locationAllowed]);

  return (
    <main className={styles.main}>
      {
        locationAllowed && userLocation
        ?
          <>
            <GoogleMap
              markers={echoes.map(toMarkerData)}
              center={{
                lat: userLocation?.latitude,
                lng: userLocation?.longitude
              }}
              mapContainerStyle={{
                width: '100vw',
                height: '100vh',
                position: 'absolute',
                top: '0',
                left: '0'
              }}
            />
            <h3>{userLocation?.latitude + ", " + userLocation?.longitude}</h3>
            <ol>
              { echoes.map(m => <li key={m.id}>{m.text} {m.coords?.latitude + ", " + m.coords?.longitude}</li>) }
            </ol>
            <EchoForm handler={(e, echoInput, setEchoInput) => handleNewEcho(e, echoInput, userLocation, setEchoInput)} />
          </>
        :
          <>
            <h1>Echo</h1>
            <h2>No known location.</h2>
            <p>Be sure to allow access to location in your browser.</p>
          </>
      }
    </main>
  )
};

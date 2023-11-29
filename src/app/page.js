'use strict';
'use client';
import styles from './page.module.css';
import {useState, useEffect} from 'react';
import {
  createGeolocationStream,
  createPermissionsStream,
  handleNewEcho,
} from '@/app/helpers';
import {EchoForm, EchoMap} from '@/app/components';

const ECHO_SERVER_URL = process.env.NEXT_PUBLIC_ECHO_SERVER_URL;
const QUERY_RADIUS_M = process.env.NEXT_PUBLIC_QUERY_RADIUS_M;
const geolocationStream$ = createGeolocationStream();
const permissionsStream$ = createPermissionsStream();

export default () => {
  const [echoes, setEchoes] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);

  // Get echoes on userLocation change
  useEffect(() => {
    if (userLocation && locationAllowed) {
      const {latitude, longitude} = userLocation;
      const listenToEchoes = new EventSource(
        `${ECHO_SERVER_URL}/echoes?latitude=${latitude}&longitude=${longitude}&radius=${QUERY_RADIUS_M}`,
        {}
      );
      listenToEchoes.onopen = () => {
        console.log('--------Echo listener connected-----------');
      };
      listenToEchoes.onerror = (err) => {
        console.error(err);
      };
      listenToEchoes.onmessage = (message) => {
        const serverMessages = JSON.parse(message?.data);
        typeof serverMessages === 'object'
          ? setEchoes(serverMessages)
          : console.log(serverMessages);
      };
      listenToEchoes.addEventListener('close', (closeEvent) => {
        console.log(
          '--------Server closed the connection-----------',
          closeEvent.data
        );
        listenToEchoes.close();
      });

      return () => {
        listenToEchoes.close();
        console.log('--------Echo listener disconnected-----------');
      };
    }
  }, [userLocation, locationAllowed]);

  // Setup permissions subscription
  useEffect(() => {
    const permissionsSubscription = permissionsStream$
      .subscribe({
        next: (permissionGranted) => {
          setLocationAllowed(permissionGranted);
        },
        error: (permissionError) => {
          console.error(permissionError);
          setLocationAllowed(false);
        },
        complete: () => {
          console.log('No more permissions changes will be emitted');
        },
      });
    return () => {
      permissionsSubscription.unsubscribe();
    };
  }, []);

  // Setup geolocation subscription
  useEffect(() => {
    if (locationAllowed) {
      const geolocationSubscription = geolocationStream$
        .subscribe({
          next: (coords) => {
            setUserLocation(coords);
          },
          error: (positionError) => {
            console.error(positionError);
            setUserLocation(null);
          },
          complete: () => {
            console.log('No more geolocation changes will be emitted');
          },
        });
      return () => {
        geolocationSubscription?.unsubscribe();
      };
    }
  }, [locationAllowed]);

  return (
    <main className={styles.main}>
      {locationAllowed && userLocation
        ? (
          <>
            <EchoMap
              center={{
                lat: userLocation.latitude,
                lng: userLocation.longitude,
              }}
              echoes={echoes}
            />
            <EchoForm
              handler={(e, echoInput, setEchoInput) =>
                handleNewEcho(e, echoInput, userLocation, setEchoInput)
              }
            />
          </>
        )
        : (
          <>
            <h1>Echo</h1>
            <h2>No known location.</h2>
            <p>Be sure to allow access to location in your browser.</p>
          </>
        )}
    </main>
  );
};
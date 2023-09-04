'use strict'
'use client'
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import { createGeolocationObservable, createPermissionsObservable, getEchoes, postEcho } from '../utilities';
import { distinctUntilChanged } from 'rxjs';

export default () => {
  const [messages, setMessages] = useState([]);
  const [echoInput, setEchoInput] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(false);
  const geolocationObservable$ = createGeolocationObservable();
  const permissionsObservable$ = createPermissionsObservable();

  // Get messages on userLocation change. This is a side effect.
  useEffect(() => {
    if (!userLocation || !locationAllowed) return () => {};
    const listenToEchoes = new EventSource(process.env.NEXT_PUBLIC_API_SERVER_URL + "/events", {});
    listenToEchoes.onopen = () => {console.log("--------Echo listener connected-----------")};
    listenToEchoes.onerror = (err) => {console.error(err)};
    listenToEchoes.onmessage = (message) => {
      const serverMessages = JSON.parse(message?.data);
      typeof serverMessages === 'object' ? setMessages(serverMessages) : console.log(serverMessages);
    };

    return () => {
      listenToEchoes.close();
      console.log("--------Echo listener disconnected-----------");
    }
  }, [userLocation, locationAllowed]);

  // Setup permissions subscription
  useEffect(() => {
    const permissionsSubscription = permissionsObservable$
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
      const geolocationSubscription = geolocationObservable$
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

  const sendNewEcho = (e) => {
    e.preventDefault();
    try {
      postEcho({text:echoInput, coords: {latitude: userLocation.latitude, longitude: userLocation.longitude}})
        .then(console.log)
        .catch(console.error);
      setEchoInput("");
    } catch {
      console.error("Not possible");
    }
  }
  return (
    <main className={styles.main}>
      <h1>Echo</h1>
      {
        locationAllowed && userLocation
        ? <>
            <h3>{userLocation?.latitude + ", " + userLocation?.longitude}</h3>
            <ol>
              { messages.map(m => <li key={m.id}>{m.text} {m.coords?.latitude + ", " + m.coords?.longitude}</li>) }
            </ol>
            <form onSubmit={sendNewEcho}>
              <label htmlFor="echo-input">your echo</label>
              <input required id="echo-input" onChange={e => setEchoInput(e.target.value)} placeholder={'There\u2019s a snake…'} type='text' value={echoInput}/>
            </form>
          </>
        : <><h2>No known location.</h2><p>Be sure to allow access to location in your browser.</p></>
      }
    </main>
  )
};
